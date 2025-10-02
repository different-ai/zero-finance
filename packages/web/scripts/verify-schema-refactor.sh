#!/bin/bash
set -e

echo "🔍 Verifying schema refactor..."

# 1. Run schema tests
echo "📋 Running schema export tests..."
pnpm test src/test/schema-exports.test.ts src/test/schema-imports.test.ts --run

# 2. Check TypeScript compilation
echo "🔧 Running typecheck..."
pnpm typecheck

# 3. Verify all imports resolve
echo "📦 Checking import statements..."
grep -r "from.*db/schema" src --include="*.ts" --include="*.tsx" > /tmp/schema-imports.txt || true
IMPORT_COUNT=$(wc -l < /tmp/schema-imports.txt | tr -d ' ')
echo "Found $IMPORT_COUNT import statements using db/schema"

# 4. Check if schema file exists
echo "📁 Verifying schema files exist..."
if [ ! -f "src/db/schema.ts" ]; then
  echo "❌ Error: src/db/schema.ts not found"
  exit 1
fi

echo "✅ All checks passed!"
