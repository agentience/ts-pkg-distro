const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run the MCP server with npx
async function simulateRooMCP() {
  return new Promise((resolve, reject) => {
    console.log('=== Simulating Roo MCP Server Execution ===\n');
    
    // Set up environment variables similar to Roo
    const env = { ...process.env, FASTMCP_LOG_LEVEL: 'DEBUG' };
    
    // Run the package with npx, similar to how Roo does it
    const child = spawn('npx', [
      '-y',
      '@agentience/ts-pkg-distro',
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
    
    // Compare results - check both stdout and stderr
    console.log('\n=== Results Comparison (Checking both stdout and stderr) ===');
    
    // Check for npm organization message in stdout
    console.log(`Roo MCP stdout: ${rooResult.output.includes('Using npm organization') ? 'Shows npm-org logs' : 'No npm-org logs'}`);
    console.log(`Direct stdout: ${directResult.output.includes('Using npm organization') ? 'Shows npm-org logs' : 'No npm-org logs'}`);
    
    // Check for npm organization message in stderr
    console.log(`Roo MCP stderr: ${rooResult.errorOutput.includes('Using npm organization') ? 'Shows npm-org logs' : 'No npm-org logs'}`);
    console.log(`Direct stderr: ${directResult.errorOutput.includes('Using npm organization') ? 'Shows npm-org logs' : 'No npm-org logs'}`);
    
    // Check for npm organization message in either stdout or stderr
    const rooHasNpmOrgLogs = rooResult.output.includes('Using npm organization') || rooResult.errorOutput.includes('Using npm organization');
    const directHasNpmOrgLogs = directResult.output.includes('Using npm organization') || directResult.errorOutput.includes('Using npm organization');
    
    console.log(`Roo MCP (stdout+stderr): ${rooHasNpmOrgLogs ? 'Shows npm-org logs' : 'No npm-org logs'}`);
    console.log(`Direct (stdout+stderr): ${directHasNpmOrgLogs ? 'Shows npm-org logs' : 'No npm-org logs'}`);
    
    // Conclusion
    console.log('\n=== Conclusion ===');
    if (directHasNpmOrgLogs && !rooHasNpmOrgLogs) {
      console.log('npm organization logs are visible when running directly with Node.js, but not when running with npx');
      console.log('This suggests that the issue is related to how npx runs the package');
      console.log('Possible solutions:');
      console.log('1. Add a handler for the --verbose flag in app.ts to enable additional logging');
      console.log('2. Modify the FastMCP server to ensure console.log output is visible when running with npx');
      console.log('3. Use a different logging mechanism that works with both Node.js and npx');
    } else if (!directHasNpmOrgLogs && !rooHasNpmOrgLogs) {
      console.log('npm organization logs are not visible in either case');
      console.log('This suggests that the issue is with the configuration or environment');
    } else if (directHasNpmOrgLogs && rooHasNpmOrgLogs) {
      console.log('npm organization logs are visible in both cases');
      console.log('This suggests that the issue is not with the execution method, but with how Roo handles the output');
    } else {
      console.log('Unexpected results. Further investigation is needed.');
    }
    
    // Additional analysis for stderr vs stdout
    console.log('\n=== Additional Analysis ===');
    if (directResult.errorOutput.includes('Using npm organization') && !directResult.output.includes('Using npm organization')) {
      console.log('npm organization logs are being sent to stderr, not stdout');
      console.log('This is expected based on the code in app.ts, which uses console.error for these messages');
      console.log('Roo may need to capture stderr output to see these messages');
    }
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests();