const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run the MCP server with different stdio configurations
async function simulateRooCapture() {
  return new Promise((resolve, reject) => {
    console.log('=== Simulating Roo MCP Server Output Capture ===\n');
    
    // Set up environment variables
    const env = { ...process.env, FASTMCP_LOG_LEVEL: 'DEBUG' };
    
    // Run the linked package with npx, but with different stdio configurations
    const child = spawn('npx', [
      '@agentience/ts-pkg-distro',
      '--config',
      '../mcp-configs/ts-pkg-distro.json'
    ], {
      env,
      stdio: ['ignore', 'pipe', 'pipe'] // Ignore stdin, pipe stdout and stderr
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

// Function to run the MCP server with stdio set to 'inherit'
async function simulateRooInherit() {
  return new Promise((resolve, reject) => {
    console.log('\n=== Simulating Roo MCP Server with stdio: inherit ===\n');
    
    // Set up environment variables
    const env = { ...process.env, FASTMCP_LOG_LEVEL: 'DEBUG' };
    
    // Run the linked package with npx, but with stdio set to 'inherit'
    const child = spawn('npx', [
      '@agentience/ts-pkg-distro',
      '--config',
      '../mcp-configs/ts-pkg-distro.json'
    ], {
      env,
      stdio: 'inherit' // Use parent's stdio
    });
    
    // The server will keep running, so we'll kill it after a short timeout
    setTimeout(() => {
      child.kill();
      resolve({});
    }, 5000); // Give it more time to start up
  });
}

// Function to run the MCP server with stdio set to 'pipe' for all
async function simulateRooPipe() {
  return new Promise((resolve, reject) => {
    console.log('\n=== Simulating Roo MCP Server with stdio: pipe ===\n');
    
    // Set up environment variables
    const env = { ...process.env, FASTMCP_LOG_LEVEL: 'DEBUG' };
    
    // Run the linked package with npx, but with stdio set to 'pipe' for all
    const child = spawn('npx', [
      '@agentience/ts-pkg-distro',
      '--config',
      '../mcp-configs/ts-pkg-distro.json'
    ], {
      env,
      stdio: ['pipe', 'pipe', 'pipe'] // Pipe stdin, stdout, and stderr
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
    // Simulate Roo MCP server output capture
    await simulateRooCapture();
    
    // Simulate Roo MCP server with stdio set to 'inherit'
    await simulateRooInherit();
    
    // Simulate Roo MCP server with stdio set to 'pipe' for all
    const pipeResult = await simulateRooPipe();
    
    // Conclusion
    console.log('\n=== Conclusion ===');
    console.log('We\'ve tested different stdio configurations to see how they affect the visibility of console.log output');
    console.log('The issue might be related to how Roo is capturing or displaying the output');
    console.log('Possible solutions:');
    console.log('1. Modify the Roo MCP server configuration to use a different stdio configuration');
    console.log('2. Use a different logging mechanism that works with Roo\'s output capture');
    console.log('3. Add a handler for the --verbose flag in app.ts to enable additional logging');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests();