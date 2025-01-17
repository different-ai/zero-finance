const fs = require('fs');
const path = require('path');

/**
 * Recursively copy directory contents, resolving symlinks
 */
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isSymbolicLink()) {
      const realPath = fs.realpathSync(srcPath);
      if (fs.statSync(realPath).isDirectory()) {
        copyDirRecursive(realPath, destPath);
      } else {
        fs.copyFileSync(realPath, destPath);
      }
    } else if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Handle @requestnetwork packages
const requestNetworkPath = path.join(__dirname, '../node_modules/@requestnetwork');
const tempPath = path.join(__dirname, '../.temp-build/@requestnetwork');

// Clean up any existing temp directory
if (fs.existsSync(tempPath)) {
  fs.rmSync(tempPath, { recursive: true, force: true });
}

// Copy files, resolving symlinks
copyDirRecursive(requestNetworkPath, tempPath);

// Replace original directory with resolved copy
fs.rmSync(requestNetworkPath, { recursive: true, force: true });
fs.renameSync(tempPath, requestNetworkPath);

console.log('Successfully prepared @requestnetwork packages for build'); 