#!/usr/bin/env npx ts-node

/**
 * Slack Demo Bot for 0 Finance Video
 *
 * Usage:
 *   SLACK_BOT_TOKEN=... npx ts-node scripts/slack-demo-bot.ts simple     # Invoice approval flow
 *   SLACK_BOT_TOKEN=... npx ts-node scripts/slack-demo-bot.ts advanced   # Multi-tool agent flow
 *   SLACK_BOT_TOKEN=... npx ts-node scripts/slack-demo-bot.ts both       # Run both sequences
 */

const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;
if (!SLACK_TOKEN) {
  console.error('Missing SLACK_BOT_TOKEN. Set it before running.');
  process.exit(1);
}

const SLACK_CHANNEL = 'contracts';
const BEN_USER_ID = 'U0906BH50NA';

const DELAY_MS = 2000;

// Simple flow: Single invoice approval
const simpleMessages = [
  '🧾 New Invoice Detected in #contracts.',
  '✅ Budget Check Passed.',
  `💸 Transfer drafted for <@${BEN_USER_ID}> to approve.`,
];

// Advanced flow: Multi-tool agent workflow
const advancedMessages = [
  '📧 *Gmail Scan Complete*\nFound 15 new contractor invoices in the last 24 hours.',
  '🔍 *Cross-referencing payment history...*\n• 13 contractors have received previous payments\n• 1 invoice has a different amount than last time ⚠️',
  '📋 *Notion Check*\n1 contractor still has an outstanding deliverable — holding payment.',
  '💰 *0 Finance*\nCreated 13 draft transfers totaling $47,250.00',
  `✅ <@${BEN_USER_ID}> check <https://0.finance/dashboard|0.finance/dashboard> to approve`,
];

async function postMessage(text: string) {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SLACK_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel: SLACK_CHANNEL,
      text,
    }),
  });

  const data = await response.json();
  if (!data.ok) {
    console.error('Error posting message:', data.error);
    return false;
  }
  console.log('✓ Posted:', text.split('\n')[0]);
  return true;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSequence(name: string, messages: string[]) {
  console.log(`\n🚀 Running "${name}" sequence`);
  console.log(`📍 Channel: #${SLACK_CHANNEL}`);
  console.log(`⏱️  Delay: ${DELAY_MS}ms between messages\n`);

  for (let i = 0; i < messages.length; i++) {
    const success = await postMessage(messages[i]);
    if (!success) {
      console.error('Failed to post message, stopping.');
      process.exit(1);
    }

    if (i < messages.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n✅ "${name}" sequence complete!`);
}

async function main() {
  const mode = process.argv[2] || 'simple';

  switch (mode) {
    case 'simple':
      await runSequence('Simple Invoice', simpleMessages);
      break;
    case 'advanced':
      await runSequence('Advanced Multi-Tool', advancedMessages);
      break;
    case 'both':
      await runSequence('Simple Invoice', simpleMessages);
      await sleep(3000);
      await runSequence('Advanced Multi-Tool', advancedMessages);
      break;
    default:
      console.log('Usage:');
      console.log(
        '  npx ts-node scripts/slack-demo-bot.ts simple     # Invoice approval flow',
      );
      console.log(
        '  npx ts-node scripts/slack-demo-bot.ts advanced   # Multi-tool agent flow',
      );
      console.log(
        '  npx ts-node scripts/slack-demo-bot.ts both       # Run both sequences',
      );
  }
}

main();
