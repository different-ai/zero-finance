/**
 * Skill Reinforcement Plugin
 *
 * Listens for session.idle events and checks if the session contains
 * the <update-skills> pattern. If found, logs the learnings to a file.
 *
 * Pattern format:
 * <update-skills>
 * - learned: What was learned during this task
 * - skill: Which skill file to update (optional)
 * - improvement: Specific improvement to make
 * </update-skills>
 */

interface SkillUpdate {
  learned: string;
  skill?: string;
  improvement: string;
}

function parseUpdateSkills(content: string): SkillUpdate | null {
  const pattern = /<update-skills>([\s\S]*?)<\/update-skills>/i;
  const match = content.match(pattern);

  if (!match) return null;

  const block = match[1];

  // Parse the structured content
  const learnedMatch = block.match(/[-*]\s*learned:\s*(.+?)(?=\n[-*]|\n*$)/is);
  const skillMatch = block.match(/[-*]\s*skill:\s*(.+?)(?=\n[-*]|\n*$)/is);
  const improvementMatch = block.match(
    /[-*]\s*improvement:\s*(.+?)(?=\n[-*]|\n*$)/is,
  );

  // At minimum we need learned and improvement
  if (!learnedMatch || !improvementMatch) {
    // Try a more lenient parse - just grab all content
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

// Simple plugin using the event pattern from docs
export const SkillReinforcementPlugin = async ({
  $,
  directory,
}: {
  $: any;
  directory: string;
}) => {
  console.log('[skill-reinforcement-plugin] Initialized');

  // Track processed sessions to avoid duplicates
  const processedSessions = new Set<string>();

  return {
    event: async ({ event }: { event: { type: string; properties?: any } }) => {
      // Only process session.idle events
      if (event.type !== 'session.idle') return;

      const sessionId =
        event.properties?.sessionId || event.properties?.id || 'unknown';

      // Skip if already processed
      if (processedSessions.has(sessionId)) return;
      processedSessions.add(sessionId);

      // Clean up old entries (keep last 100)
      if (processedSessions.size > 100) {
        const entries = Array.from(processedSessions);
        entries.slice(0, 50).forEach((id) => processedSessions.delete(id));
      }

      try {
        // Read the session file if it exists
        // Sessions are typically stored in a predictable location
        const possiblePaths = [
          `${directory}/.opencode/sessions/${sessionId}.json`,
          `~/.config/opencode/sessions/${sessionId}.json`,
        ];

        let sessionContent = '';

        // Try to get session content from event properties
        if (event.properties?.messages) {
          sessionContent = JSON.stringify(event.properties.messages);
        }

        // Check for update-skills pattern in the content
        const skillUpdate = parseUpdateSkills(sessionContent);

        if (!skillUpdate) {
          // No pattern found, that's okay
          return;
        }

        console.log(
          '[skill-reinforcement-plugin] Found skill update:',
          skillUpdate,
        );

        // Append the learning to a learnings log
        const learningsPath = `${directory}/.opencode/skill/learnings.log`;
        const timestamp = new Date().toISOString();
        const logEntry = `
## ${timestamp}
- **Learned**: ${skillUpdate.learned}
- **Skill**: ${skillUpdate.skill || 'general'}
- **Improvement**: ${skillUpdate.improvement}
- **Session**: ${sessionId}

---
`;

        // Append to learnings log using shell
        try {
          await $`mkdir -p ${directory}/.opencode/skill && echo ${logEntry} >> ${learningsPath}`;
          console.log(
            '[skill-reinforcement-plugin] Logged learning to:',
            learningsPath,
          );
        } catch (e) {
          console.error('[skill-reinforcement-plugin] Failed to write log:', e);
        }

        // Send macOS notification
        try {
          const notifMessage = `Learned: ${skillUpdate.learned.substring(0, 50)}...`;
          await $`osascript -e 'display notification "${notifMessage}" with title "Skill Updated"'`;
        } catch (e) {
          // Notification might fail on non-macOS
        }
      } catch (error) {
        console.error('[skill-reinforcement-plugin] Error:', error);
      }
    },

    // Also hook into message updates to catch the pattern in real-time
    'message.updated': async ({
      message,
    }: {
      message: {
        role?: string;
        parts?: Array<{ type: string; text?: string }>;
      };
    }) => {
      if (message.role !== 'assistant') return;

      let content = '';
      if (message.parts) {
        for (const part of message.parts) {
          if (part.type === 'text' && part.text) {
            content += part.text + '\n';
          }
        }
      }

      const skillUpdate = parseUpdateSkills(content);
      if (skillUpdate) {
        console.log(
          '[skill-reinforcement-plugin] Detected skill update in message:',
          skillUpdate.learned.substring(0, 50),
        );
      }
    },
  };
};
