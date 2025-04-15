#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configure source and destination
const BANK_SRC = path.resolve(__dirname, '../../bank/src');
const WEB_SRC = path.resolve(__dirname, '../src');

// Function to copy files with notification
function copyFile(source, destination) {
  // Create directory if it doesn't exist
  const destDir = path.dirname(destination);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(source, destination);
  console.log(`Copied: ${source} -> ${destination}`);
}

// Function to migrate a component directory
function migrateComponentDir(componentDir) {
  const sourcePath = path.join(BANK_SRC, 'components', componentDir);
  const destPath = path.join(WEB_SRC, 'components', componentDir);
  
  // Check if the source directory exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source directory does not exist: ${sourcePath}`);
    return;
  }
  
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }
  
  // Copy all files in the directory
  const files = fs.readdirSync(sourcePath);
  for (const file of files) {
    const sourceFile = path.join(sourcePath, file);
    const destFile = path.join(destPath, file);
    
    // If it's a directory, recurse
    if (fs.statSync(sourceFile).isDirectory()) {
      console.log(`Creating subdirectory: ${destFile}`);
      if (!fs.existsSync(destFile)) {
        fs.mkdirSync(destFile, { recursive: true });
      }
      
      const subfiles = fs.readdirSync(sourceFile);
      for (const subfile of subfiles) {
        const sourceSubfile = path.join(sourceFile, subfile);
        const destSubfile = path.join(destFile, subfile);
        
        if (fs.statSync(sourceSubfile).isFile()) {
          copyFile(sourceSubfile, destSubfile);
        }
      }
    } else {
      copyFile(sourceFile, destFile);
    }
  }
  
  console.log(`\nSuccessfully migrated component directory: ${componentDir}`);
}

// Function to migrate a hook
function migrateHook(hookName) {
  const sourceFile = path.join(BANK_SRC, 'hooks', `${hookName}.ts`);
  const destFile = path.join(WEB_SRC, 'hooks', `${hookName}.ts`);
  
  // Check if the source file exists
  if (!fs.existsSync(sourceFile)) {
    console.error(`Source file does not exist: ${sourceFile}`);
    return;
  }
  
  // Create destination directory if it doesn't exist
  const destDir = path.dirname(destFile);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  copyFile(sourceFile, destFile);
  console.log(`\nSuccessfully migrated hook: ${hookName}`);
}

// Function to migrate an action
function migrateAction(actionName) {
  const sourceFile = path.join(BANK_SRC, 'actions', `${actionName}.ts`);
  const destFile = path.join(WEB_SRC, 'actions', `${actionName}.ts`);
  
  // Check if the source file exists
  if (!fs.existsSync(sourceFile)) {
    console.error(`Source file does not exist: ${sourceFile}`);
    return;
  }
  
  // Create destination directory if it doesn't exist
  const destDir = path.dirname(destFile);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  copyFile(sourceFile, destFile);
  console.log(`\nSuccessfully migrated action: ${actionName}`);
}

// Check for command-line arguments
const [, , migrationType, itemName] = process.argv;

if (!migrationType || !itemName) {
  console.log(`
Usage: 
  node migrate-from-bank.js component <directory-name>  # Migrate a component directory
  node migrate-from-bank.js hook <hook-name>            # Migrate a hook file
  node migrate-from-bank.js action <action-name>        # Migrate an action file
  
Examples:
  node migrate-from-bank.js component dashboard         # Migrates all files in src/components/dashboard
  node migrate-from-bank.js hook use-user-safes         # Migrates src/hooks/use-user-safes.ts
  node migrate-from-bank.js action get-user-funding-sources  # Migrates src/actions/get-user-funding-sources.ts
  `);
  process.exit(1);
}

// Perform the requested migration
switch (migrationType) {
  case 'component':
    migrateComponentDir(itemName);
    break;
  case 'hook':
    migrateHook(itemName);
    break;
  case 'action':
    migrateAction(itemName);
    break;
  default:
    console.error(`Unknown migration type: ${migrationType}`);
    process.exit(1);
}

// Make the script executable
if (process.platform !== 'win32') {
  try {
    execSync(`chmod +x ${__filename}`);
  } catch (error) {
    console.warn(`Could not make script executable: ${error.message}`);
  }
} 