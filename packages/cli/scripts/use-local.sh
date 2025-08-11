#!/bin/bash

# Script to configure CLI for local development

echo "🔧 Configuring Zero Finance CLI for local development..."

# Set local URLs
node src/index.js auth config --api-url http://localhost:3000/api/trpc --web-url http://localhost:3000

echo ""
echo "✅ CLI configured for local development!"
echo ""
echo "Make sure the web app is running:"
echo "  cd ../web && npm run dev"
echo ""
echo "Then authenticate:"
echo "  npm start auth login"
