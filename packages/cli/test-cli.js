#!/usr/bin/env node

/**
 * Test script for Zero Finance CLI
 * Run this to test all CLI features
 */

import { spawn } from 'child_process';
import chalk from 'chalk';

console.log(chalk.bold.cyan('\n🧪 Zero Finance CLI Test Suite\n'));

const tests = [
  {
    name: 'Help Command',
    command: ['--help'],
    expectedOutput: 'Zero Finance CLI',
    timeout: 3000
  },
  {
    name: 'Version Command',
    command: ['--version'],
    expectedOutput: '1.0.0',
    timeout: 3000
  },
  {
    name: 'Auth Status (Not Logged In)',
    command: ['auth', 'status'],
    expectedOutput: 'Not authenticated',
    timeout: 3000,
    useMock: true
  },
  {
    name: 'Balance Command (No Company)',
    command: ['balance'],
    input: '\n',
    expectedOutput: 'No company selected',
    timeout: 5000
  },
  {
    name: 'Company Command',
    command: ['company'],
    input: '5\n', // Select Back
    expectedOutput: 'Company Management',
    timeout: 5000
  }
];

async function runTest(test) {
  return new Promise((resolve) => {
    console.log(chalk.cyan(`Testing: ${test.name}`));
    
    const cliFile = test.useMock ? 'test-cli-full.js' : 'src/index.js';
    const child = spawn('node', [cliFile, ...test.command], {
      cwd: process.cwd()
    });
    
    let output = '';
    let error = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    if (test.input) {
      setTimeout(() => {
        child.stdin.write(test.input);
        child.stdin.end();
      }, 500);
    }
    
    const timeout = setTimeout(() => {
      child.kill();
      const success = output.includes(test.expectedOutput) || error.includes(test.expectedOutput);
      
      if (success) {
        console.log(chalk.green(`  ✓ ${test.name} passed`));
      } else {
        console.log(chalk.red(`  ✗ ${test.name} failed`));
        if (process.env.DEBUG) {
          console.log(chalk.dim(`    Expected: "${test.expectedOutput}"`));
          console.log(chalk.dim(`    Got: "${output.substring(0, 100)}..."`));
        }
      }
      
      resolve(success);
    }, test.timeout || 5000);
    
    child.on('close', () => {
      clearTimeout(timeout);
      const success = output.includes(test.expectedOutput) || error.includes(test.expectedOutput);
      
      if (success) {
        console.log(chalk.green(`  ✓ ${test.name} passed`));
      } else {
        console.log(chalk.red(`  ✗ ${test.name} failed`));
        if (process.env.DEBUG) {
          console.log(chalk.dim(`    Expected: "${test.expectedOutput}"`));
          console.log(chalk.dim(`    Got: "${output.substring(0, 100)}..."`));
        }
      }
      
      resolve(success);
    });
  });
}

async function runAllTests() {
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await runTest(test);
    if (result) passed++;
    else failed++;
  }
  
  console.log(chalk.bold('\n📊 Test Results:'));
  console.log(chalk.green(`  ✓ Passed: ${passed}`));
  if (failed > 0) {
    console.log(chalk.red(`  ✗ Failed: ${failed}`));
  }
  
  console.log('\n' + chalk.bold('📝 Manual Testing Instructions:'));
  console.log('\n1. Test Interactive Mode:');
  console.log('   ' + chalk.dim('node src/index.js'));
  console.log('   - Navigate menus with arrow keys');
  console.log('   - Create a company');
  console.log('   - Check balance');
  console.log('   - Make a payment');
  
  console.log('\n2. Test Mock Auth Flow:');
  console.log('   ' + chalk.dim('node test-cli-full.js auth login'));
  console.log('   - Enter any email and password');
  console.log('   ' + chalk.dim('node test-cli-full.js auth status'));
  console.log('   - Should show authenticated');
  console.log('   ' + chalk.dim('node test-cli-full.js auth logout'));
  
  console.log('\n3. Test Company Creation:');
  console.log('   ' + chalk.dim('node test-cli-full.js company'));
  console.log('   - Select "Create New Company"');
  console.log('   - Enter company details');
  console.log('   - View company list');
  
  console.log('\n4. Test Payment Flow:');
  console.log('   ' + chalk.dim('node test-cli-full.js pay john@example.com 1000'));
  console.log('   - Should show payment confirmation');
  
  if (failed === 0) {
    console.log(chalk.bold.green('\n🎉 All automated tests passed!'));
  } else {
    console.log(chalk.bold.yellow('\n⚠️  Some tests failed. Check the output above.'));
    process.exit(1);
  }
}

runAllTests().catch(console.error);