#!/bin/bash

# Script to configure CLI for production

echo "🔧 Configuring Zero Finance CLI for production..."

# Reset to production URLs
node src/index.js auth config --reset

echo ""
echo "✅ CLI configured for production!"
echo ""
echo "Authenticate with:"
echo "  npm start auth login"
