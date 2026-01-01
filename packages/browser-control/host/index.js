#!/usr/local/bin/node

/**
 * Native Messaging Host for 0 Finance Agent Bridge
 * Reads/Writes length-prefixed JSON messages from Chrome.
 */

const fs = require('fs');
const http = require('http');
const crypto = require('crypto');

// Log to a file since stdout is used for communication
const LOG_FILE = '/tmp/zerofinance-agent-host.log';
function log(msg) {
  fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${msg}\n`);
}

log('Host started');

// Store pending requests: ID -> HTTP Response Object
const pendingRequests = new Map();

process.stdin.on('readable', () => {
  let chunk;
  while (null !== (chunk = process.stdin.read())) {
    handleInput(chunk);
  }
});

let buffer = Buffer.alloc(0);

function handleInput(data) {
  buffer = Buffer.concat([buffer, data]);

  while (true) {
    if (buffer.length < 4) return; // Need at least length header

    // Read length (4 bytes, little-endian)
    const msgLen = buffer.readUInt32LE(0);

    if (buffer.length < 4 + msgLen) return; // Wait for full message

    // Extract message
    const rawMsg = buffer.slice(4, 4 + msgLen);
    const msgJson = JSON.parse(rawMsg.toString());

    // Remove processed message from buffer
    buffer = buffer.slice(4 + msgLen);

    log('Received from Chrome: ' + JSON.stringify(msgJson));

    // Handle response
    if (msgJson.id && pendingRequests.has(msgJson.id)) {
      const res = pendingRequests.get(msgJson.id);
      pendingRequests.delete(msgJson.id);

      // If we have a result, return it. If error, return that.
      const responsePayload = msgJson.result
        ? { result: msgJson.result }
        : { error: msgJson.error };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(responsePayload));
    }
  }
}

// Function to send message TO Chrome
function sendMessageToChrome(msg) {
  const json = JSON.stringify(msg);
  const len = Buffer.byteLength(json, 'utf8');

  const header = Buffer.alloc(4);
  header.writeUInt32LE(len, 0);

  process.stdout.write(header);
  process.stdout.write(json);
  log('Sent to Chrome: ' + json);
}

// --- Server to receive commands from Opencode ---

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      try {
        const command = JSON.parse(body);

        // Generate ID for this request
        const id = crypto.randomUUID();
        command.id = id;

        // Store pending request
        pendingRequests.set(id, res);

        // Set timeout to clear pending request if Chrome doesn't respond
        setTimeout(() => {
          if (pendingRequests.has(id)) {
            pendingRequests.delete(id);
            res.writeHead(504, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({ error: 'Timeout waiting for browser response' }),
            );
          }
        }, 30000); // 30 second timeout

        // Forward command to Chrome Extension
        sendMessageToChrome(command);
      } catch (e) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(54321, () => {
  log('Local command server listening on port 54321');
});
