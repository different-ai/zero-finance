import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function GET() {
  const scriptPath = path.join(
    process.cwd(),
    'scripts',
    'install-agent-bank.sh',
  );
  const script = await fs.readFile(scriptPath, 'utf8');

  return new Response(script, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
