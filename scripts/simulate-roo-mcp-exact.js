const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run the exact npx command that works from the command line
async function simulateRooMCP() {
  return new Promise((resolve, reject) => {
    console.log('=== Simulating Roo MCP Server Execution (Exact Command) ===\n');
    
    // Set up environment variables similar to Roo
    const env = { ...process.env, FASTMCP_LOG_LEVEL: 'DEBUG' };
    
    // Run the exact npx command that works from the command line
    // Using shell: true to ensure it runs exactly as it would in the terminal
    const child = spawn('npx -y @agentience/ts-pkg-distro --config ../mcp-configs/ts-pkg-distro.json --verbose', {
      env,
      shell: true, // Important: use shell to run the command exactly as in terminal
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

// Function to run the MCP server directly with Node.js for comparison
async function runDirectly() {
  return new Promise((resolve, reject) => {
    console.log('\n=== Running MCP Server Directly with Node.js ===\n');
    
    // Set up environment variables
    const env = { ...process.env, FASTMCP_LOG_LEVEL: 'DEBUG' };
    
    // Run the app directly with Node.js
    const child = spawn('node', [
      'dist/app.js',
      '--config',
      '../mcp-configs/ts-pkg-distro.json',
      '--verbose'
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

// Main function to run the tests
async function runTests() {
  try {
    // Simulate Roo MCP server execution
    const rooResult = await simulateRooMCP();
    
    // Run directly with Node.js for comparison
    const directResult = await runDirectly();
    
    // Compare results
    console.log('\n=== Results Comparison ===');
    console.log(`Roo MCP: ${rooResult.output.includes('Using npm organization') ? 'Shows npm-org logs' : 'No npm-org logs'}`);
    console.log(`Direct: ${directResult.output.includes('Using npm organization') ? 'Shows npm-org logs' : 'No npm-org logs'}`);
    
    // Conclusion
    console.log('\n=== Conclusion ===');
    if (directResult.output.includes('Using npm organization') && !rooResult.output.includes('Using npm organization')) {
      console.log('Console.log output is visible when running directly with Node.js, but not when running with npx');
      console.log('This suggests that the issue is related to how npx runs the package');
      console.log('Possible solutions:');
      console.log('1. Modify the FastMCP server to ensure console.log output is visible when running with npx');
      console.log('2. Use a different logging mechanism that works with both Node.js and npx');
      console.log('3. Add environment variable FASTMCP_LOG_LEVEL=DEBUG to the MCP server configuration');
    } else if (!directResult.output.includes('Using npm organization') && !rooResult.output.includes('Using npm organization')) {
      console.log('Console.log output is not visible in either case');
      console.log('This suggests that the issue is with the configuration or environment');
    } else if (directResult.output.includes('Using npm organization') && rooResult.output.includes('Using npm organization')) {
      console.log('Console.log output is visible in both cases');
      console.log('This suggests that the issue is not with npx, but with how Roo handles the output');
      console.log('Possible solutions:');
      console.log('1. Check how Roo is capturing and displaying output from MCP servers');
      console.log('2. Investigate if Roo is redirecting stdout/stderr to a different location');
    } else {
      console.log('Unexpected results. Further investigation is needed.');
    }
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests();