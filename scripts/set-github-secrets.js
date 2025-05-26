#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// GitHub configuration
const REPO_OWNER = 'different-ai';
const REPO_NAME = 'hyprsqrl';

// Function to parse .env file
function parseEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    
    content.split('\n').forEach(line => {
      // Skip empty lines and comments
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      
      // Parse KEY=VALUE pairs
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        env[key] = value;
      }
    });
    
    return env;
  } catch (error) {
    console.error(`❌ Error reading env file: ${error.message}`);
    process.exit(1);
  }
}

// Get env file path from command line argument or use default
const envFilePath = process.argv[2] || path.join(__dirname, '..', 'packages', 'web', '.env.local');

console.log(`🚀 GitHub Secrets Setup for ${REPO_OWNER}/${REPO_NAME}`);
console.log(`📁 Reading environment variables from: ${envFilePath}`);

// Check if env file exists
if (!fs.existsSync(envFilePath)) {
  console.error(`❌ Environment file not found: ${envFilePath}`);
  console.log(`💡 Usage: node scripts/set-github-secrets.js [path-to-env-file]`);
  console.log(`💡 Default path: packages/web/.env.local`);
  process.exit(1);
}

// Parse environment variables from file
const secrets = parseEnvFile(envFilePath);

// Filter out variables that shouldn't be secrets (like local development URLs)
const excludePatterns = [
  /^NODE_ENV$/,
  /^PORT$/,
  /^HOST$/,
  /localhost/i,
  /127\.0\.0\.1/,
  /^PWD$/,
  /^PATH$/,
  /^USER$/,
  /^HOME$/
];

const filteredSecrets = {};
for (const [key, value] of Object.entries(secrets)) {
  const shouldExclude = excludePatterns.some(pattern => 
    pattern.test(key) || pattern.test(value)
  );
  
  if (!shouldExclude && value) {
    filteredSecrets[key] = value;
  }
}

console.log(`📝 Found ${Object.keys(secrets).length} environment variables`);
console.log(`🔐 Setting ${Object.keys(filteredSecrets).length} as GitHub secrets...\n`);

// Function to check if GitHub CLI is installed
function checkGitHubCLI() {
  try {
    execSync('gh --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to set a single secret
function setSecret(name, value) {
  try {
    const command = `gh secret set ${name} --body "${value}" --repo ${REPO_OWNER}/${REPO_NAME}`;
    execSync(command, { stdio: 'pipe' });
    console.log(`✅ ${name}`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error.message}`);
    return false;
  }
}

// Main execution
async function main() {
  // Check if GitHub CLI is installed
  if (!checkGitHubCLI()) {
    console.log('❌ GitHub CLI (gh) is not installed or not in PATH');
    console.log('📥 Install it with: brew install gh');
    console.log('🔑 Then authenticate with: gh auth login');
    process.exit(1);
  }

  // Check if user is authenticated
  try {
    execSync('gh auth status', { stdio: 'pipe' });
  } catch (error) {
    console.log('❌ Not authenticated with GitHub CLI');
    console.log('🔑 Please run: gh auth login');
    process.exit(1);
  }

  console.log('✅ GitHub CLI is installed and authenticated\n');

  let successCount = 0;
  let failCount = 0;

  // Set each secret
  for (const [name, value] of Object.entries(filteredSecrets)) {
    if (setSecret(name, value)) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`✅ Successfully set: ${successCount} secrets`);
  console.log(`❌ Failed to set: ${failCount} secrets`);

  if (successCount > 0) {
    console.log(`\n🎉 Secrets have been set from ${envFilePath}!`);
    console.log(`🔗 View them at: https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/secrets/actions`);
  }

  if (failCount > 0) {
    console.log(`\n⚠️  Some secrets failed to set. Please check the errors above.`);
  }
}

main().catch(console.error); 