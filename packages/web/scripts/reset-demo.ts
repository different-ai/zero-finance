import * as dotenv from 'dotenv';
import path from 'path';

// Load the specific env file BEFORE importing db
dotenv.config({
  path: path.resolve(process.cwd(), '.env.development.local.bak'),
});

// Now import db
import { db } from '../src/db';
import { offrampTransfers } from '../src/db/schema';
import { like, or } from 'drizzle-orm';

async function main() {
  console.log('🧹 Resetting Demo Data...');

  const result = await db
    .delete(offrampTransfers)
    .where(
      or(
        like(offrampTransfers.alignTransferId, 'mock_%'),
        like(offrampTransfers.agentProposalMessage, '%Proposed via MCP agent%'),
      ),
    )
    .returning();

  console.log(`✅ Deleted ${result.length} mock transfers.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
