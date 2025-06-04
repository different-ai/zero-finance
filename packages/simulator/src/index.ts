#!/usr/bin/env node
import { Agent, run } from '@openai/agents';
import { Command } from 'commander';

// Define Persona Types and Instructions
interface Persona {
  name: string;
  instructions: string;
  weight: number; // For distribution
}

const personas: Persona[] = [
  {
    name: 'EnthusiasticTargetUser',
    instructions: "You are the ideal customer for a new B2B fintech product that automates financial tasks using AI. You're tech-savvy, looking for efficiency, and excited by innovation in this space. React enthusiastically to this marketing message as if you saw it on LinkedIn or Twitter.",
    weight: 20,
  },
  {
    name: 'CuriousTargetUser',
    instructions: "You are a potential customer for a B2B fintech product. You're interested in solutions that can save time and simplify financial management, but you need to understand the benefits clearly. React with curiosity and perhaps a question, as if you saw this on LinkedIn.",
    weight: 30,
  },
  {
    name: 'IndifferentUser',
    instructions: "You are a casual social media user scrolling your feed (Twitter or LinkedIn). Most posts don't grab your attention. React very briefly and neutrally (e.g., \'interesting\', \'noted\', \'ok\', or similar short, non-committal phrases), or imply you scrolled past.",
    weight: 30,
  },
  {
    name: 'OffTargetUser',
    instructions: "You are a social media user (e.g., a student, artist, retiree) who is NOT the target audience for a complex B2B financial software. React to this marketing message from your perspective, perhaps with confusion, polite disinterest, or by relating it to something completely different if it sparks an unrelated thought. Keep it brief.",
    weight: 10,
  },
  {
    name: 'SkepticalUser',
    instructions: "You are a cautious professional on LinkedIn. You've seen many tech claims. React to this marketing message with a bit of skepticism, questioning its practicality, or pointing out potential downsides if it seems too good to be true. Be concise.",
    weight: 10,
  },
];

function selectPersona(): Persona {
  const totalWeight = personas.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;
  for (const persona of personas) {
    if (random < persona.weight) {
      return persona;
    }
    random -= persona.weight;
  }
  return personas[personas.length - 1]; // Fallback
}

async function simulateMarketingMessage(message: string, numAudienceAgents: number = 100) {
  // Ensure the OPENAI_API_KEY environment variable is set
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set.');
    console.log('Please set it by running: export OPENAI_API_KEY=sk-...');
    process.exit(1);
  }

  console.log(`Simulating reactions for marketing message: "${message}"\n`);
  console.log(`Initializing ${numAudienceAgents} audience agents with diverse personas...`);
  const audienceReactions = [];

  for (let i = 0; i < numAudienceAgents; i++) {
    const selectedPersona = selectPersona();
    const audienceAgent = new Agent({
      name: `${selectedPersona.name}-${i + 1}`,
      instructions: selectedPersona.instructions,
      // model: 'gpt-3.5-turbo', // Consider for cost/speed for audience
    });
    try {
      // Adding a specific prompt for the agent to react TO the message
      const result = await run(audienceAgent, `Here\'s a marketing message: "${message}"\n\nYour brief reaction based on your persona:`);
      audienceReactions.push({ agent: audienceAgent.name, persona: selectedPersona.name, reaction: result.finalOutput });
      process.stdout.write(`.`); // Progress indicator
    } catch (error) {
      console.error(`\nError with ${audienceAgent.name}:`, error);
      audienceReactions.push({ agent: audienceAgent.name, persona: selectedPersona.name, reaction: 'Error fetching reaction.' });
    }
  }
  console.log('\n\n--- All Audience Reactions Collected ---');
  audienceReactions.forEach(r => console.log(`${r.agent} (Persona: ${r.persona}): ${r.reaction}`));

  // --- Placeholder for feedback agents --- 
  console.log('\n\nInitializing feedback agent...');
  const feedbackAgent = new Agent({
    name: 'ExpertFeedbackAgent',
    instructions: 'You are a marketing strategy expert. Given a marketing message and a list of audience reactions from diverse personas (including enthusiastic, curious, indifferent, off-target, and skeptical users), provide a nuanced summary of the overall reception. Specifically comment on: \n1. How well the message resonates with the likely target audience. \n2. Common points of confusion or disinterest from other groups. \n3. Key strengths of the message. \n4. Offer 3-5 actionable, concise suggestions to improve the message for its intended audience while minimizing negative reactions from others. Consider the diversity of reactions provided.',
    // model: 'gpt-4', // Recommended for nuanced analysis
  });

  const allReactionsText = audienceReactions.map(r => `${r.agent} (Persona: ${r.persona}): ${r.reaction}`).join('\n');
  
  try {
    console.log('\nGenerating expert feedback on the diverse reactions...');
    const feedbackResult = await run(
      feedbackAgent,
      `Original Marketing Message: "${message}"\n\nAudience Reactions (from various personas):\n${allReactionsText}\n\nYour expert analysis and suggestions:`
    );
    console.log('\n--- Expert Feedback & Suggestions (considering diverse personas) ---');
    console.log(feedbackResult.finalOutput);
  } catch (error) {
    console.error('\nError with FeedbackAgent:', error);
  }

  console.log('\n\nSimulation complete.');
}

const program = new Command();

program
  .name('marketing-simulator')
  .description('Simulates audience reactions to a marketing announcement using AI agents and provides feedback.')
  .version('0.1.0')
  .option('-n, --num-agents <number>', 'Number of audience agents to simulate', '100');

program
  .command('simulate')
  .description('Simulate reactions to a given marketing message.')
  .argument('<message>', 'The marketing message to simulate reactions for.')
  .action(async (messageStr) => {
    const options = program.opts();
    const numAgents = parseInt(options.numAgents, 10);
    await simulateMarketingMessage(messageStr, numAgents);
  });

async function main() {
  await program.parseAsync(process.argv);
}

main(); 