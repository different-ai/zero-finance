#!/bin/bash

# Script to fix align-router.ts to use context user instead of getUser()

FILE="/Users/benjaminshafii/git/zerofinance/packages/web/src/server/routers/align-router.ts"

# Backup the original file
cp "$FILE" "$FILE.backup"

# Fix getCustomerStatus (line 103-104)
sed -i '' '103s/.*/    const userId = ctx.user.id;/' "$FILE"
sed -i '' '104s/if (!userFromPrivy?.id)/if (!userId)/' "$FILE"
sed -i '' '113s/eq(users.privyDid, userFromPrivy.id)/eq(users.privyDid, userId)/' "$FILE"
sed -i '' '126s/fetchAndUpdateKycStatus(user.alignCustomerId, userFromPrivy.id)/fetchAndUpdateKycStatus(user.alignCustomerId, userId)/' "$FILE"
sed -i '' '143s/userId: userFromPrivy.id,/userId: userId,/' "$FILE"

echo "Fixed getCustomerStatus procedure"
echo "Note: There are 12+ more procedures that need the same fix"
echo "For now, only getCustomerStatus will work with CLI auth"
