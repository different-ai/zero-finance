import { tool, type Plugin } from '@opencode-ai/plugin';

type BridgeAction =
  | { type: 'navigate'; url: string }
  | { type: 'evaluate'; script: string }
  | { type: 'click'; selector: string }
  | { type: 'click_text'; text: string; tag?: string }
  | { type: 'fill'; selector: string; value: string }
  | { type: 'scroll'; x: number; y: number }
  | { type: 'get_dom' }
  | { type: 'get_text' }
  | { type: 'get_links' }
  | { type: 'get_inputs' }
  | { type: 'screenshot' };

async function postToBridge(
  action: BridgeAction,
  signal?: AbortSignal,
): Promise<unknown> {
  const response = await fetch('http://localhost:54321', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(action),
    signal,
  });

  return await response.json();
}

function asJsonString(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export const BrowserControlPlugin: Plugin = async () => {
  return {
    tool: {
      local_browser_navigate: tool({
        description:
          "Navigate the local user's Chrome browser to a specific URL",
        args: {
          url: tool.schema
            .string()
            .describe('The URL to navigate to (e.g. https://example.com)'),
        },
        async execute(args, context) {
          try {
            const result = await postToBridge(
              { type: 'navigate', url: args.url },
              context.abort,
            );
            return asJsonString(result);
          } catch {
            return asJsonString({
              error: 'Failed to connect to browser bridge. Is Chrome running?',
            });
          }
        },
      }),

      local_browser_evaluate: tool({
        description:
          "Execute JavaScript in the local user's active Chrome tab (via CDP, bypasses CSP)",
        args: {
          script: tool.schema
            .string()
            .describe('The JavaScript code to execute'),
        },
        async execute(args, context) {
          try {
            const result = await postToBridge(
              { type: 'evaluate', script: args.script },
              context.abort,
            );
            return asJsonString(result);
          } catch {
            return asJsonString({
              error: 'Failed to connect to browser bridge. Is Chrome running?',
            });
          }
        },
      }),

      local_browser_click: tool({
        description:
          'Click an element in the local browser identified by a CSS selector',
        args: {
          selector: tool.schema
            .string()
            .describe('CSS selector of the element to click'),
        },
        async execute(args, context) {
          try {
            const result = await postToBridge(
              { type: 'click', selector: args.selector },
              context.abort,
            );
            return asJsonString(result);
          } catch {
            return asJsonString({
              error: 'Failed to connect to browser bridge.',
            });
          }
        },
      }),

      local_browser_click_text: tool({
        description:
          'Click an element by its visible text content (e.g., "Login", "Submit")',
        args: {
          text: tool.schema
            .string()
            .describe('The visible text to search for and click'),
          tag: tool.schema
            .string()
            .optional()
            .describe(
              'Optional: limit search to specific tag (e.g., "button", "a")',
            ),
        },
        async execute(args, context) {
          try {
            const result = await postToBridge(
              { type: 'click_text', text: args.text, tag: args.tag || '*' },
              context.abort,
            );
            return asJsonString(result);
          } catch {
            return asJsonString({
              error: 'Failed to connect to browser bridge.',
            });
          }
        },
      }),

      local_browser_fill: tool({
        description: 'Fill an input element with text',
        args: {
          selector: tool.schema
            .string()
            .describe('CSS selector of the input element'),
          value: tool.schema.string().describe('The text value to fill'),
        },
        async execute(args, context) {
          try {
            const result = await postToBridge(
              { type: 'fill', selector: args.selector, value: args.value },
              context.abort,
            );
            return asJsonString(result);
          } catch {
            return asJsonString({
              error: 'Failed to connect to browser bridge.',
            });
          }
        },
      }),

      local_browser_scroll: tool({
        description: 'Scroll the page to specific coordinates',
        args: {
          x: tool.schema.number().describe('X coordinate'),
          y: tool.schema.number().describe('Y coordinate'),
        },
        async execute(args, context) {
          try {
            const result = await postToBridge(
              { type: 'scroll', x: args.x, y: args.y },
              context.abort,
            );
            return asJsonString(result);
          } catch {
            return asJsonString({
              error: 'Failed to connect to browser bridge.',
            });
          }
        },
      }),

      local_browser_get_dom: tool({
        description: 'Get the full HTML content of the active tab',
        args: {},
        async execute(_args, context) {
          try {
            const result = await postToBridge(
              { type: 'get_dom' },
              context.abort,
            );
            return asJsonString(result);
          } catch {
            return asJsonString({
              error: 'Failed to connect to browser bridge.',
            });
          }
        },
      }),

      local_browser_get_text: tool({
        description:
          'Get the visible text content of the page (clean, no HTML)',
        args: {},
        async execute(_args, context) {
          try {
            const result = await postToBridge(
              { type: 'get_text' },
              context.abort,
            );
            return asJsonString(result);
          } catch {
            return asJsonString({
              error: 'Failed to connect to browser bridge.',
            });
          }
        },
      }),

      local_browser_get_links: tool({
        description:
          'Get all visible links on the page with their text and URLs',
        args: {},
        async execute(_args, context) {
          try {
            const result = await postToBridge(
              { type: 'get_links' },
              context.abort,
            );
            return asJsonString(result);
          } catch {
            return asJsonString({
              error: 'Failed to connect to browser bridge.',
            });
          }
        },
      }),

      local_browser_get_inputs: tool({
        description:
          'Get all visible form inputs, buttons, and interactive elements on the page',
        args: {},
        async execute(_args, context) {
          try {
            const result = await postToBridge(
              { type: 'get_inputs' },
              context.abort,
            );
            return asJsonString(result);
          } catch {
            return asJsonString({
              error: 'Failed to connect to browser bridge.',
            });
          }
        },
      }),

      local_browser_screenshot: tool({
        description: "Take a screenshot of the local user's active Chrome tab",
        args: {},
        async execute(_args, context) {
          try {
            const result = await postToBridge(
              { type: 'screenshot' },
              context.abort,
            );
            return asJsonString(result);
          } catch {
            return asJsonString({
              error: 'Failed to connect to browser bridge. Is Chrome running?',
            });
          }
        },
      }),
    },
  };
};
