#!/usr/bin/env node

/**
 * MCP Bridge Script
 * Proxies JSON-RPC requests from Stdio to the Next.js API route.
 * Used to connect Claude Desktop to the local dev server.
 */

const API_URL = process.env.MCP_API_URL || 'http://localhost:3050/api/mcp';
const API_KEY = process.env.MCP_API_KEY;

if (!API_KEY) {
  console.error('Error: MCP_API_KEY environment variable is required');
  process.exit(1);
}

// Buffer for incoming data
let buffer = '';

process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  buffer += chunk;

  // Process line by line
  let newlineIndex;
  while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, newlineIndex);
    buffer = buffer.slice(newlineIndex + 1);

    if (line.trim()) {
      handleRequest(line);
    }
  }
});

async function handleRequest(jsonString) {
  try {
    const request = JSON.parse(jsonString);

    // Forward to API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`API Error ${response.status}: ${text}`);

      // Send error back to client if it was a request (has id)
      if (request.id !== undefined) {
        const errorResponse = {
          jsonrpc: '2.0',
          id: request.id,
          error: {
            code: -32000,
            message: `API Error ${response.status}: ${text}`,
          },
        };
        process.stdout.write(JSON.stringify(errorResponse) + '\n');
      }
      return;
    }

    const result = await response.json();
    process.stdout.write(JSON.stringify(result) + '\n');
  } catch (error) {
    console.error('Error handling request:', error);
  }
}

console.error(`MCP Bridge running. Forwarding to ${API_URL}`);
