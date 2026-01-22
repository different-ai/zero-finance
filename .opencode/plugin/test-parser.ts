/**
 * Quick test for the skill update parser
 * Run with: bun .opencode/plugin/test-parser.ts
 */

function parseUpdateSkills(content: string) {
  const pattern = /<update-skills>([\s\S]*?)<\/update-skills>/i;
  const match = content.match(pattern);

  if (!match) return null;

  const block = match[1];

  const learnedMatch = block.match(/[-*]\s*learned:\s*(.+?)(?=\n[-*]|\n*$)/is);
  const skillMatch = block.match(/[-*]\s*skill:\s*(.+?)(?=\n[-*]|\n*$)/is);
  const improvementMatch = block.match(
    /[-*]\s*improvement:\s*(.+?)(?=\n[-*]|\n*$)/is,
  );

  if (!learnedMatch || !improvementMatch) {
    const lines = block
      .trim()
      .split('\n')
      .filter((l) => l.trim());
    if (lines.length === 0) return null;

    return {
      learned: lines[0]?.replace(/^[-*]\s*/, '') || block.trim(),
      skill: undefined,
      improvement:
        lines
          .slice(1)
          .join(' ')
          .replace(/^[-*]\s*/, '') || block.trim(),
    };
  }

  return {
    learned: learnedMatch[1].trim(),
    skill: skillMatch?.[1]?.trim(),
    improvement: improvementMatch[1].trim(),
  };
}

// Test cases
const testCases = [
  // Standard format
  `Some text before
<update-skills>
- learned: Vercel logs require --scope prologe flag
- skill: debug-prod-issues
- improvement: Add note about scope flag
</update-skills>
Some text after`,

  // Without skill
  `<update-skills>
- learned: Something important
- improvement: Add this to docs
</update-skills>`,

  // No match
  `Just regular text without the pattern`,

  // Malformed but parseable
  `<update-skills>
This is a learning
And this is an improvement
</update-skills>`,
];

console.log('Testing parseUpdateSkills:\n');

testCases.forEach((test, i) => {
  console.log(`--- Test ${i + 1} ---`);
  console.log('Input:', test.substring(0, 50) + '...');
  const result = parseUpdateSkills(test);
  console.log('Result:', result);
  console.log();
});

console.log('✅ Parser tests complete!');
