#!/bin/bash

# Zero Finance CLI Runner
# This script runs the CLI with proper environment setup

echo "🚀 Starting Zero Finance CLI..."
echo ""
echo "Note: Some advanced features (auth, kyc, transfers) require API connection"
echo "      and may not work in test mode."
echo ""

# Set NODE_OPTIONS to suppress experimental warnings
export NODE_OPTIONS="--no-warnings"

# Run the test CLI which doesn't have TRPC dependencies
cd "$(dirname "$0")"

if [ -f "test-cli.js" ]; then
    node test-cli.js "$@"
else
    echo "Error: test-cli.js not found. Please ensure it exists."
    exit 1
fi
