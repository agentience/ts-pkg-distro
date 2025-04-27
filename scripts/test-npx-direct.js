const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Test if the npx command works directly from the command line
 */
async function testNpxDirect() {
  return new Promise((resolve, reject) => {
    console.log('=== Testing npx command directly ===\n');
    
    // Set up environment variables
    const env = { ...process.env, FASTMCP_LOG_LEVEL: 'DEBUG' };
    
    // Run the exact npx command that should work from the command line
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

/**
 * Test if the package is installed globally
 */
async function checkGlobalInstall() {
  return new Promise((resolve, reject) => {
    console.log('\n=== Checking if package is installed globally ===\n');
    
    // Run npm list -g to check if the package is installed globally
    const child = spawn('npm', ['list', '-g', '@agentience/ts-pkg-distro'], {
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
    
    child.on('close', (code) => {
      resolve({ output, errorOutput, code });
    });
  });
}

/**
 * Test if the package can be executed with npx using the full path
 */
async function testNpxWithPath() {
  return new Promise((resolve, reject) => {
    console.log('\n=== Testing npx with full path ===\n');
    
    // Set up environment variables
    const env = { ...process.env, FASTMCP_LOG_LEVEL: 'DEBUG' };
    
    // Get the path to the node_modules directory
    const nodeModulesPath = path.resolve(__dirname, '../node_modules/.bin/ts-pkg-distro');
    
    // Check if the binary exists
    if (fs.existsSync(nodeModulesPath)) {
      console.log(`Binary found at: ${nodeModulesPath}`);
    } else {
      console.log(`Binary not found at: ${nodeModulesPath}`);
    }
    
    // Run npx with the full path to the package
    const child = spawn('npx', [
      nodeModulesPath,
      '--config',
      '../mcp-configs/ts-pkg-distro.json',
      '--verbose'
    ], {
      env,
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
    // Test if the npx command works directly
    const npxResult = await testNpxDirect();
    
    // Check if the package is installed globally
    const globalResult = await checkGlobalInstall();
    
    // Test if the package can be executed with npx using the full path
    const pathResult = await testNpxWithPath();
    
    // Conclusion
    console.log('\n=== Conclusion ===');
    
    // Check if the npx command worked
    if (npxResult.errorOutput.includes('ts-pkg-distro: command not found')) {
      console.log('The npx command failed with "command not found" error');
      console.log('This suggests that the package is not correctly configured for npx execution');
      console.log('Possible issues:');
      console.log('1. The package is not published to npm');
      console.log('2. The bin field in package.json is not correctly configured');
      console.log('3. The package is not installed globally or in the current project');
    } else if (npxResult.errorOutput.includes('Using npm organization')) {
      console.log('The npx command worked and showed npm organization logs in stderr');
      console.log('This suggests that the issue is with how Roo is capturing and displaying stderr output');
    } else {
      console.log('The npx command had unexpected results. Further investigation is needed.');
    }
    
    // Check if the package is installed globally
    if (globalResult.output.includes('@agentience/ts-pkg-distro')) {
      console.log('\nThe package is installed globally');
    } else {
      console.log('\nThe package is not installed globally');
      console.log('This might be why the npx command is not working');
    }
    
    // Check if the package can be executed with npx using the full path
    if (pathResult.errorOutput.includes('Using npm organization')) {
      console.log('\nThe package can be executed with npx using the full path');
      console.log('This suggests that the issue is with how npx is resolving the package name');
    } else {
      console.log('\nThe package cannot be executed with npx using the full path');
      console.log('This suggests that there might be issues with the package binary');
    }
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests();