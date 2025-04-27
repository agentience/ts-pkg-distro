const { spawn } = require('child_process');

/**
 * Simulate how Roo might execute the MCP server
 */
async function simulateRooExecution() {
  return new Promise((resolve, reject) => {
    console.log('=== Simulating Roo Execution ===\n');
    
    // Set up environment variables similar to Roo
    const env = { ...process.env, FASTMCP_LOG_LEVEL: 'DEBUG' };
    
    // Run the npx command
    const child = spawn('npx', [
      '-y',
      '@agentience/ts-pkg-distro',
      '--config',
      '../mcp-configs/ts-pkg-distro.json',
      '--verbose'
    ], {
      env,
      stdio: ['pipe', 'pipe', 'pipe'] // Standard stdio configuration
    });
    
    let output = '';
    let errorOutput = '';
    
    // Capture stdout
    child.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(`[STDOUT] ${text.trim()}`);
    });
    
    // Capture stderr
    child.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.log(`[STDERR] ${text.trim()}`);
    });
    
    // Handle process exit
    child.on('error', (error) => {
      console.error(`Error executing command: ${error.message}`);
      resolve({ output, errorOutput, error: error.message });
    });
    
    // The server will keep running, so we'll kill it after a short timeout
    setTimeout(() => {
      child.kill();
      resolve({ output, errorOutput });
    }, 5000); // Give it more time to start up
  });
}

/**
 * Try running the command with different approaches
 */
async function tryDifferentApproaches() {
  return new Promise((resolve, reject) => {
    console.log('\n=== Trying Different Approaches ===\n');
    
    // Set up environment variables
    const env = { ...process.env, FASTMCP_LOG_LEVEL: 'DEBUG' };
    
    // Run the command with shell: true
    const child = spawn('npx -y @agentience/ts-pkg-distro --config ../mcp-configs/ts-pkg-distro.json --verbose', {
      env,
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe']
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

/**
 * Main function to run the tests
 */
async function runTests() {
  try {
    // Simulate Roo execution
    const rooResult = await simulateRooExecution();
    
    // Try different approaches
    const differentResult = await tryDifferentApproaches();
    
    // Conclusion
    console.log('\n=== Conclusion ===');
    
    // Check if the npm organization message is in stderr
    const rooHasNpmOrgLogs = rooResult.errorOutput.includes('Using npm organization');
    const differentHasNpmOrgLogs = differentResult.errorOutput.includes('Using npm organization');
    
    console.log(`Roo simulation: ${rooHasNpmOrgLogs ? 'Shows npm-org logs in stderr' : 'No npm-org logs in stderr'}`);
    console.log(`Different approach: ${differentHasNpmOrgLogs ? 'Shows npm-org logs in stderr' : 'No npm-org logs in stderr'}`);
    
    if (!rooHasNpmOrgLogs && !differentHasNpmOrgLogs) {
      console.log('\nNeither approach shows npm-org logs in stderr');
      console.log('This suggests that the issue might be with how the script is capturing stderr output');
      console.log('Possible solutions:');
      console.log('1. Ensure Roo is capturing and displaying stderr output from MCP servers');
      console.log('2. Modify the package to use console.log instead of console.error for important messages');
    } else if (!rooHasNpmOrgLogs && differentHasNpmOrgLogs) {
      console.log('\nThe different approach shows npm-org logs in stderr, but the Roo simulation does not');
      console.log('This suggests that the issue might be with how Roo is executing the command');
      console.log('Possible solutions:');
      console.log('1. Ensure Roo is using shell: true when executing the command');
      console.log('2. Check if Roo is correctly passing the environment variables');
    } else if (rooHasNpmOrgLogs && differentHasNpmOrgLogs) {
      console.log('\nBoth approaches show npm-org logs in stderr');
      console.log('This suggests that the issue is with how Roo is handling the stderr output');
      console.log('Possible solutions:');
      console.log('1. Ensure Roo is displaying stderr output from MCP servers');
      console.log('2. Check if Roo is redirecting stderr to a different location');
    }
    
    // Additional analysis
    console.log('\n=== Additional Analysis ===');
    console.log('Since the command works in the user\'s terminal but fails in our test scripts,');
    console.log('the issue might be with how the command is being executed in the scripts or how Roo is handling it.');
    console.log('Possible differences:');
    console.log('1. Environment variables: The user\'s terminal might have different environment variables');
    console.log('2. Shell configuration: The user\'s terminal might have different shell configuration');
    console.log('3. Working directory: The user might be running the command from a different directory');
    console.log('4. Node.js version: The user might be using a different version of Node.js');
    console.log('5. Package installation: The user might have the package installed globally or locally');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests();