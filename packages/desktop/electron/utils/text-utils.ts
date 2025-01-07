/**
 * Extracts a snippet of text around a match index
 */
export function extractSnippet(
  content: string,
  matchIndex: number,
  snippetRadius: number = 200
): { snippet: string; lineNumber: number } {
  // Get the line number
  const lineNumber = content.slice(0, matchIndex).split('\n').length;

  // Get snippet boundaries
  const start = Math.max(0, matchIndex - snippetRadius);
  const end = Math.min(content.length, matchIndex + snippetRadius);
  
  // Extract the snippet
  const snippet = content.slice(start, end);

  // If snippet starts mid-sentence, try to find the start of the sentence
  const firstPeriod = content.slice(Math.max(0, start - 100), start).lastIndexOf('.');
  const adjustedStart = firstPeriod !== -1 ? start + firstPeriod + 1 : start;

  // If snippet ends mid-sentence, try to find the end of the sentence
  const lastPeriod = content.slice(end, Math.min(content.length, end + 100)).indexOf('.');
  const adjustedEnd = lastPeriod !== -1 ? end + lastPeriod + 1 : end;

  // Get the final snippet with complete sentences where possible
  const finalSnippet = content.slice(adjustedStart, adjustedEnd).trim();

  return {
    snippet: finalSnippet,
    lineNumber
  };
}

/**
 * Extracts a snippet of text based on line numbers
 */
export function extractLineSnippet(
  content: string,
  lineNumber: number,
  linesBefore: number = 3,
  linesAfter: number = 3
): { snippet: string; lineNumber: number } {
  const lines = content.split('\n');
  const start = Math.max(0, lineNumber - linesBefore);
  const end = Math.min(lines.length, lineNumber + linesAfter);
  
  return {
    snippet: lines.slice(start, end).join('\n'),
    lineNumber
  };
}

/**
 * Performs fuzzy matching on text content
 */
export function fuzzyMatch(
  content: string,
  query: string,
  threshold: number = 0.7
): { matched: boolean; index: number; score: number } {
  const contentLower = content.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // First try exact match
  const exactIndex = contentLower.indexOf(queryLower);
  if (exactIndex !== -1) {
    return { matched: true, index: exactIndex, score: 1 };
  }

  // Split into words and try partial matches
  const queryWords = queryLower.split(/\s+/);
  const contentWords = contentLower.split(/\s+/);
  
  let bestMatch = { matched: false, index: -1, score: 0 };
  
  for (let i = 0; i < contentWords.length; i++) {
    const wordMatches = queryWords.map(qWord => {
      const contentWord = contentWords[i];
      if (contentWord.includes(qWord) || qWord.includes(contentWord)) {
        return true;
      }
      // Calculate Levenshtein distance for fuzzy matching
      const distance = levenshteinDistance(contentWord, qWord);
      const maxLength = Math.max(contentWord.length, qWord.length);
      const similarity = 1 - distance / maxLength;
      return similarity > threshold;
    });

    const matchScore = wordMatches.filter(Boolean).length / queryWords.length;
    if (matchScore > bestMatch.score) {
      // Find the actual index in the original content
      const index = content.toLowerCase().indexOf(contentWords[i]);
      bestMatch = { matched: matchScore >= threshold, index, score: matchScore };
    }
  }

  return bestMatch;
}

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1,
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
} 