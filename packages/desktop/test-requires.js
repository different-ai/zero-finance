// test-requires.js
const packages = [
  'ethers',
  'js-sha3',
  '@requestnetwork/utils',
  '@requestnetwork/request-client.js',
  '@requestnetwork/types',
  '@requestnetwork/epk-signature',
  '@requestnetwork/data-format',
  '@requestnetwork/epk-cipher',
  'crypto-js',
  'viem',
  'wagmi'
];

async function testImports() {
  for (const pkg of packages) {
    try {
      const module = await import(pkg);
      console.log(`OK: ${pkg}`);
    } catch (error) {
      console.error(`FAIL: ${pkg} - ${error.message}`);
    }
  }
}

testImports().catch(error => {
  console.error('Test failed:', error);
}); 