import { openai, createOpenAI } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { screenpipeSearch } from '../tools/screenpipe-search';

// Search worker schemas
export const searchInputSchema = z.object({
  query: z.string().optional(),
  timeframe: z.string(),
  purpose: z.string(),
  context: z.record(z.any()).optional(),
  apiKey: z.string(),
  classificationId: z.string(),
});

export const searchResultSchema = z.object({
  items: z.array(z.object({
    type: z.string(),
    content: z.object({
      text: z.string(),
      timestamp: z.string(),
      frame_id: z.number().optional(),
      file_path: z.string().optional(),
      offset_index: z.number().optional(),
      app_name: z.string().optional(),
      window_name: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
    humanReadableAction: z.string().optional(),
  })),
  summary: z.string(),
  nextStepRecommendation: z.string(),
});

export type SearchInput = z.infer<typeof searchInputSchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;

// Add a schema for detailed search query information
const searchQueryDetailsSchema = z.object({
  query: z.string(),
  explanation: z.string(),
  expectedResults: z.array(z.string()),
  contentType: z.enum(['ocr', 'audio', 'ui']),
  confidence: z.number(),
  examples: z.array(z.string()),
});

// Update the query analysis schema to include more details
const queryAnalysisSchema = z.object({
  timeframe: z.object({
    type: z.enum(['specific', 'relative', 'none']),
    startTime: z.string(),
    endTime: z.string(),
    confidence: z.number(),
    explanation: z.string(),
  }),
  searchTerms: z.array(z.string()),
  searchQueries: z.array(searchQueryDetailsSchema),
  rationale: z.string(),
  contentTypes: z.array(z.enum(['ocr', 'audio', 'ui'])),
});

// Add a schema for search progress details
const searchProgressSchema = z.object({
  humanAction: z.string(),
  text: z.string(),
  details: z.object({
    currentQuery: z.string(),
    queryNumber: z.number(),
    totalQueries: z.number(),
    contentType: z.enum(['ocr', 'audio', 'ui']),
    estimatedTimeRemaining: z.string(),
  }),
  technicalDetails: z.object({
    queryJson: z.string(),
    parameters: z.record(z.any()),
  }).optional(),
});

// Additional schemas for search phases
const fuzzyExpansionSchema = z.object({
  synonyms: z.array(z.string()),
  fuzzyMatches: z.array(z.string()),
  rationale: z.string(),
});

const filteredResultSchema = z.object({
  relevant: z.boolean(),
  reason: z.string().optional(),
});

// Types for internal use
type ContentType = 'ocr' | 'audio' | 'ui';
type SearchTimeframe = {
  type: 'specific' | 'relative' | 'none';
  startTime: string;
  endTime: string;
  confidence: number;
  explanation: string;
};

class SearchWorker {
  private addStep: (classificationId: string, step: any) => void;
  private openai: any;

  // Composable: Each phase is a separate method
  private async analyzeQuery(input: SearchInput) {
    const { object: queryAnalysis } = await generateObject({
      model: this.openai('o3-mini'),
      schema: queryAnalysisSchema,
      system: `You are an expert at analyzing search queries to extract time references and meaningful search terms.
      Generate specific, targeted search queries that will help find relevant information.
      Include example matches for each query to illustrate what we're looking for.`,
      prompt: `Analyze this search query: "${input.query || ''}"
      Current time context: ${input.timeframe}
      Search purpose: ${input.purpose}

      Provide a structured analysis (JSON) with:
      1. timeframe (start/end with explanation)
      2. top searchTerms
      3. searchQueries (small set of queries best suited to find relevant info)
      4. rationale 
      5. contentTypes likely relevant: ["ocr","audio","ui"]`,
    });

    return queryAnalysis;
  }

  private async expandQueries(searchTerms: string[], queryAnalysis: any) {
    const mainTerms = searchTerms.join(', ');
    const { object: expansion } = await generateObject({
      model: this.openai('o3-mini'),
      schema: fuzzyExpansionSchema,
      prompt: `you are an expert in lexical and semantic matching. given these terms:
"${mainTerms}"

1. generate a short list of synonyms or near-synonyms
2. generate a short list of "fuzzy" variations that might account for typos or ocr errors
3. provide a rationale

the user is searching possibly messy text from ocr data, so be creative with common mistakes.`,
      system: 'you find helpful synonyms and fuzzy expansions for queries in messy text corpuses.',
    });

    const synonymsAndFuzzies = [...expansion.synonyms, ...expansion.fuzzyMatches];
    const expandedQueries = queryAnalysis.searchQueries.flatMap((q) => 
      synonymsAndFuzzies.map((sf) => ({
        ...q,
        query: `${q.query} OR ${sf}`,
      }))
    );

    return {
      expansion,
      finalQueries: [...queryAnalysis.searchQueries, ...expandedQueries],
      synonymsAndFuzzies,
    };
  }

  private async executeSearches(
    queries: any[],
    contentTypes: ContentType[],
    timeframe: SearchTimeframe,
    classificationId: string
  ) {
    const results = [];
    let queryCounter = 0;
    const totalQueries = queries.length * contentTypes.length;

    for (const searchQuery of queries) {
      for (const contentType of contentTypes) {
        queryCounter++;
        
        this.addStep(classificationId, {
          humanAction: `Search Progress`,
          text: `Query ${queryCounter}/${totalQueries}: "${searchQuery.query}" in ${contentType}
          
<details>
<summary>Query Details</summary>

\`\`\`json
${JSON.stringify({
  query: searchQuery.query,
  contentType,
  timeframe,
  confidence: searchQuery.confidence,
  examples: searchQuery.examples
}, null, 2)}
\`\`\`
</details>`,
          finishReason: 'complete',
        });

        try {
          const partialResults = await screenpipeSearch.execute(
            {
              query: searchQuery.query,
              contentType,
              appName: 'hypr',
              startTime: timeframe.startTime,
              endTime: timeframe.endTime,
              humanReadableAction: `Searching ${contentType} content`,
            },
            {
              toolCallId: crypto.randomUUID(),
              messages: [],
            }
          );

          if (Array.isArray(partialResults)) {
            results.push(...partialResults);
          }
        } catch (err) {
          console.error('0xHypr', 'Search error:', err);
          this.addStep(classificationId, {
            humanAction: 'Search Error',
            text: `Error executing search: ${err.message}
            
<details>
<summary>Error Details</summary>

\`\`\`json
${JSON.stringify({
  query: searchQuery.query,
  contentType,
  error: err.message
}, null, 2)}
\`\`\`
</details>`,
            finishReason: 'error',
          });
        }
      }
    }

    return results;
  }

  private async filterResults(results: any[], userQuery: string, CHUNK_SIZE = 10) {
    const relevantItems = [];

    for (let i = 0; i < results.length; i += CHUNK_SIZE) {
      const chunk = results.slice(i, i + CHUNK_SIZE);
      const chunkPrompt = chunk
        .map(
          (item, index) => `
item ${index}:
timestamp: ${item.content.timestamp}
text: "${item.content.text.replace(/\n/g, ' ')}"
`
        )
        .join('\n');

      const { object: filterDecisions } = await generateObject({
        model: this.openai('o3-mini'),
        schema: z.array(filteredResultSchema),
        prompt: `the user wants to find results for the query: "${userQuery}". 
we have a chunk of ${chunk.length} possible results from messy ocr or audio.

for each item, decide if it's truly relevant to the user query. return an array of
{ "relevant": boolean, "reason": string } in the same order.

items:
${chunkPrompt}`,
      });

      filterDecisions.forEach((decision, idx) => {
        if (decision.relevant) {
          relevantItems.push({
            ...chunk[idx],
            relevanceReason: decision.reason
          });
        }
      });
    }

    return relevantItems;
  }

  async execute(input: SearchInput): Promise<SearchResult> {
    console.log('0xHypr', 'searchWorker.execute', input);
    
    this.openai = createOpenAI({ apiKey: input.apiKey });
    this.addStep = useAgentStepsStore.getState().addStep;

    // Phase 1: Query Analysis
    const queryAnalysis = await this.analyzeQuery(input);
    
    // Phase 2: Query Expansion
    const { expansion, finalQueries, synonymsAndFuzzies } = 
      await this.expandQueries(queryAnalysis.searchTerms, queryAnalysis);

    // Phase 3: Execute Searches
    const broadResults = await this.executeSearches(
      finalQueries,
      queryAnalysis.contentTypes as ContentType[],
      queryAnalysis.timeframe as SearchTimeframe,
      input.classificationId
    );

    // Phase 4: Filter Results
    const relevantItems = await this.filterResults(broadResults, input.query || '');

    // Phase 5: Generate Summary
    const { text: finalSummary } = await generateText({
      model: this.openai('o3-mini'),
      prompt: `Summarize these ${relevantItems.length} relevant search results for the query: "${input.query}"

Items:
${relevantItems.map((item) => item.content.text.slice(0, 200)).join('\n---\n')}

Include:
1. Key findings
2. Patterns or trends
3. Notable timestamps or events
4. Suggested next steps`,
    });

    // Final Step
    this.addStep(input.classificationId, {
      humanAction: 'Search Complete',
      text: `Search Results Summary:
- Total items found: ${broadResults.length}
- Relevant items after filtering: ${relevantItems.length}
- Time range: ${queryAnalysis.timeframe.explanation}
- Query expansions used: ${synonymsAndFuzzies.join(', ')}

<details>
<summary>Search Statistics</summary>

\`\`\`json
${JSON.stringify({
  originalQueries: queryAnalysis.searchQueries.length,
  expandedQueries: finalQueries.length,
  contentTypes: queryAnalysis.contentTypes,
  timeframe: queryAnalysis.timeframe,
  totalResults: broadResults.length,
  relevantResults: relevantItems.length
}, null, 2)}
\`\`\`
</details>

${finalSummary}`,
      finishReason: 'complete',
    });

    return {
      items: relevantItems,
      summary: finalSummary,
      nextStepRecommendation: 'Proceed with classification of filtered items',
    };
  }
}

export const searchWorker = new SearchWorker(); 