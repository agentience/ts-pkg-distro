const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run the MCP server with the linked package
async function simulateRooMCP() {
  return new Promise((resolve, reject) => {
    console.log('=== Simulating Roo MCP Server Execution (Linked Package) ===\n');
    
    // Set up environment variables similar to Roo
    const env = { ...process.env, FASTMCP_LOG_LEVEL: 'DEBUG' };
    
    // Run the linked package with npx
    const child = spawn('npx', [
      '@agentience/ts-pkg-distro',
      '--config',
      '../mcp-configs/ts-pkg-distro.json'
    ], {
      env,
      stdio: ['pipe', 'pipe', 'pipe'] // Explicitly set stdio to capture output
    });
    
    let output = '';
    let errorOutput = '';
    
    child.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(`[STDOUT] ${text.trim()}`);
    });
    
    child.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.log(`[STDERR] ${text.trim()}`);
    });
    
    // The server will keep running, so we'll kill it after a short timeout
    setTimeout(() => {
      child.kill();
      resolve({ output, errorOutput });
    }, 5000); // Give it more time to start up
  });
}

// Main function to run the test
async function runTest() {
  try {
    // Simulate Roo MCP server execution
    const result = await simulateRooMCP();
    
    // Check if npm-org logs are visible
    console.log('\n=== Results ===');
    console.log(`Shows npm-org logs: ${result.output.includes('Using npm organization')}`);
    
    // Conclusion
    console.log('\n=== Conclusion ===');
    if (result.output.includes('Using npm organization')) {
      console.log('Console.log output is visible when running with npx after linking the package');
      console.log('This suggests that the issue is related to how Roo installs or links the package');
      console.log('Possible solutions:');
      console.log('1. Ensure the package is properly linked or installed when running through Roo');
      console.log('2. Modify the Roo MCP server configuration to include npm link or similar');
    } else {
      console.log('Console.log output is not visible even after linking the package');
      console.log('This suggests that the issue is with how npx or Roo handles the output');
    }
  } catch (error) {
    console.error('Error running test:', error);
  }
}

// Run the test
runTest();