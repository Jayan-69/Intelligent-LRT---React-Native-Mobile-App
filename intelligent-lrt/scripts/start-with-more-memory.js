// This script starts Expo with more memory allocated to Node.js
// Useful for large projects that experience out-of-memory errors

const { spawn } = require('child_process');
const os = require('os');

// Calculate a good memory limit based on system memory
// Use at least 4GB or half of system memory, whichever is greater
const systemMemoryGB = os.totalmem() / (1024 * 1024 * 1024);
const memoryLimit = Math.max(4, Math.floor(systemMemoryGB / 2));

console.log(`Starting Expo with increased memory limit: ${memoryLimit}GB`);

// Use npx to run expo in a cross-platform way
const isWindows = process.platform === 'win32';

// Start Expo with increased memory
const expo = spawn(
  isWindows ? 'npx.cmd' : 'npx',
  [
    // Allocate more memory
    `--node-options=--max-old-space-size=${memoryLimit * 1024}`,
    // Run the Expo CLI
    'expo',
    // Pass all arguments to Expo
    ...process.argv.slice(2)
  ],
  {
    stdio: 'inherit',
    shell: true
  }
);

expo.on('close', (code) => {
  process.exit(code);
});
