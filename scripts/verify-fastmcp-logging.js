const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to create a temporary config file
function createTempConfig() {
  const config = {
    server: {
      name: "Test-Package",
      version: "1.0.0"
    },
    transport: {
      type: "stdio",
      options: {}
    },
    "npm-org": "test-org"
  };
  
  const tempConfigPath = path.join(__dirname, 'temp-logging-config.json');
  fs.writeFileSync(tempConfigPath, JSON.stringify(config, null, 2));
  console.log(`Created temporary config file at ${tempConfigPath}`);
  return tempConfigPath;
}

// Function to run the app with different environment variables
async function testWithEnvVar(envVar, value) {
  return new Promise((resolve, reject) => {
    const configPath = createTempConfig();
    const appPath = path.join(__dirname, 'dist', 'app.js');
    
    if (!fs.existsSync(appPath)) {
      reject(new Error('Compiled app.js not found in dist directory'));
      return;
    }
    
    console.log(`\n=== Testing with ${envVar}=${value} ===`);
    
    // Set up environment variables
    const env = { ...process.env };
    if (value !== null) {
      env[envVar] = value;
    }
    
    // Run the app with the config file and environment variable
    const child = spawn('node', [appPath, '--config', configPath], {
      env,
      timeout: 5000
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
    
    // The app will keep running, so we'll kill it after a short timeout
    setTimeout(() => {
      child.kill();
      
      // Clean up
      try {
        fs.unlinkSync(configPath);
      } catch (error) {
        console.error('Error cleaning up temporary config file:', error);
      }
      
      resolve({ output, errorOutput });
    }, 1000);
  });
}

// Main function to test different logging configurations
async function testFastMCPLogging() {
  console.log('=== Testing FastMCP Logging Configuration ===\n');
  
  try {
    // Test with no FASTMCP_LOG_LEVEL (default behavior)
    const result1 = await testWithEnvVar('FASTMCP_LOG_LEVEL', null);
    
    // Test with FASTMCP_LOG_LEVEL=DEBUG
    const result2 = await testWithEnvVar('FASTMCP_LOG_LEVEL', 'DEBUG');
    
    // Test with FASTMCP_LOG_LEVEL=INFO
    const result3 = await testWithEnvVar('FASTMCP_LOG_LEVEL', 'INFO');
    
    // Test with FASTMCP_LOG_LEVEL=ERROR
    const result4 = await testWithEnvVar('FASTMCP_LOG_LEVEL', 'ERROR');
    
    // Compare results
    console.log('\n=== Results Summary ===');
    console.log(`Default: ${result1.output.includes('Using npm organization') ? 'Shows npm-org logs' : 'No npm-org logs'}`);
    console.log(`DEBUG: ${result2.output.includes('Using npm organization') ? 'Shows npm-org logs' : 'No npm-org logs'}`);
    console.log(`INFO: ${result3.output.includes('Using npm organization') ? 'Shows npm-org logs' : 'No npm-org logs'}`);
    console.log(`ERROR: ${result4.output.includes('Using npm organization') ? 'Shows npm-org logs' : 'No npm-org logs'}`);
    
    // Conclusion
    console.log('\n=== Conclusion ===');
    if (!result4.output.includes('Using npm organization') && 
        (result1.output.includes('Using npm organization') || 
         result2.output.includes('Using npm organization') || 
         result3.output.includes('Using npm organization'))) {
      console.log('FASTMCP_LOG_LEVEL=ERROR suppresses console.log output');
      console.log('This is likely why console.log output is not visible when running through Roo MCP server configuration');
      console.log('Solution: Add FASTMCP_LOG_LEVEL=INFO or DEBUG to the MCP server configuration');
    } else {
      console.log('FASTMCP_LOG_LEVEL does not appear to affect console.log visibility');
      console.log('Further investigation is needed to determine why console.log output is not visible');
    }
  } catch (error) {
    console.error('Error testing FastMCP logging:', error);
  }
}

// Run the tests
testFastMCPLogging();