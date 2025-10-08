/**
 * Script to migrate admin-router to use database-based admin authentication
 */

import * as fs from 'fs';
import * as path from 'path';

const adminRouterPath = path.join(
  __dirname,
  '../src/server/routers/admin-router.ts',
);

let content = fs.readFileSync(adminRouterPath, 'utf-8');

// Remove adminTokenSchema and validateAdminToken references from imports/definitions (already done)

// List of procedures that need updating (those still using adminToken)
const proceduresToUpdate = [
  'getTotalDeposited',
  'getAlignCustomerDirectDetails',
  'deleteUser',
  'overrideKycStatusFromAlign',
  'markKycAsDone',
  'resetAlignData',
  'grantFeature',
  'getUserDetails', // second occurrence
];

// Pattern to find and replace adminToken input parameter
// Match: .input(z.object({ adminToken: adminTokenSchema, ...other }))
// Replace: .input(z.object({ ...other }))
content = content.replace(
  /\.input\(\s*z\.object\(\{\s*adminToken:\s*adminTokenSchema,\s*/g,
  '.input(z.object({ ',
);

// Also handle cases where adminToken is the only parameter
content = content.replace(
  /\.input\(\s*z\.object\(\{\s*adminToken:\s*adminTokenSchema\s*\}\)\s*\)/g,
  '',
);

// Remove validateAdminToken checks
// Pattern: if (!validateAdminToken(input.adminToken)) { throw ... }
content = content.replace(
  /if\s*\(!validateAdminToken\(input\.adminToken\)\)\s*\{\s*throw\s+new\s+TRPCError\(\{\s*code:\s*['"]UNAUTHORIZED['"]\s*,\s*message:\s*['"]Invalid admin token['"]\s*,?\s*\}\);\s*\}/g,
  '',
);

// Add requireAdmin() calls at the start of query/mutation handlers
// Only add where it's missing (not where we already added it)
content = content.replace(
  /(getTotalDeposited:.*?\.query\(async \(\{ input \}\) => \{)/gs,
  '$1\n      await requireAdmin();',
);

content = content.replace(
  /(getAlignCustomerDirectDetails:.*?\.query\(async \(\{ ctx, input \}\) => \{)/gs,
  '$1\n      await requireAdmin();',
);

content = content.replace(
  /(deleteUser:.*?\.mutation\(async \(\{ input \}\) => \{)/gs,
  '$1\n      await requireAdmin();',
);

content = content.replace(
  /(overrideKycStatusFromAlign:.*?\.mutation\(async \(\{ ctx, input \}\) => \{)/gs,
  '$1\n      await requireAdmin();',
);

content = content.replace(
  /(markKycAsDone:.*?\.mutation\(async \(\{ ctx, input \}\) => \{)/gs,
  '$1\n      await requireAdmin();',
);

content = content.replace(
  /(resetAlignData:.*?\.mutation\(async \(\{ ctx, input \}\) => \{)/gs,
  '$1\n      await requireAdmin();',
);

content = content.replace(
  /(grantFeature:.*?\.mutation\(async \(\{ ctx, input \}\) => \{)/gs,
  '$1\n      await requireAdmin();',
);

fs.writeFileSync(adminRouterPath, content, 'utf-8');

console.log('✅ Admin router migration complete');
console.log('Updated procedures to use database-based admin authentication');
