const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Function to create a temporary config file
function createTempConfig(npmOrg = null) {
  const config = {
    server: {
      name: "Test-Package",
      version: "1.0.0"
    },
    transport: {
      type: "stdio",
      options: {}
    }
  };
  
  if (npmOrg) {
    config['npm-org'] = npmOrg;
  }
  
  const tempConfigPath = path.join(__dirname, 'temp-app-config.json');
  fs.writeFileSync(tempConfigPath, JSON.stringify(config, null, 2));
  console.log(`Created temporary config file at ${tempConfigPath}`);
  return tempConfigPath;
}

// Function to run the app with a config file and capture output
function runAppWithConfig(configPath) {
  return new Promise((resolve, reject) => {
    const appPath = path.join(__dirname, 'dist', 'app.js');
    
    if (!fs.existsSync(appPath)) {
      reject(new Error('Compiled app.js not found in dist directory'));
      return;
    }
    
    console.log(`Running app with config: ${configPath}`);
    
    // Run the app with the config file
    const child = spawn('node', [appPath, '--config', configPath], {
      timeout: 5000
    });
    
    let output = '';
    let errorOutput = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    // The app will keep running, so we'll kill it after a short timeout
    setTimeout(() => {
      child.kill();
      
      if (errorOutput) {
        console.error('Error output:', errorOutput);
      }
      
      resolve(output);
    }, 1000);
  });
}

// Main function to verify app logging
async function verifyAppLogging() {
  console.log('=== Verifying app.ts Logging of npm-org Configuration ===\n');
  
  try {
    // Test with npm-org specified
    const configPath1 = createTempConfig('test-org');
    console.log('\n=== Test with npm-org specified ===');
    const output1 = await runAppWithConfig(configPath1);
    
    console.log('App output:');
    console.log(output1);
    
    // Check if the output contains the npm-org logging
    const hasNpmOrgLogging = output1.includes('Using npm organization: test-org');
    
    if (hasNpmOrgLogging) {
      console.log('\n✅ app.ts correctly logs the npm-org configuration when present');
    } else {
      console.log('\n❌ app.ts does not log the npm-org configuration when present');
    }
    
    // Test without npm-org specified
    const configPath2 = createTempConfig();
    console.log('\n=== Test without npm-org specified ===');
    const output2 = await runAppWithConfig(configPath2);
    
    console.log('App output:');
    console.log(output2);
    
    // Check if the output does not contain npm-org logging
    const hasNoNpmOrgLogging = !output2.includes('Using npm organization:');
    
    if (hasNoNpmOrgLogging) {
      console.log('\n✅ app.ts correctly does not log npm-org when not present');
    } else {
      console.log('\n❌ app.ts incorrectly logs npm-org when not present');
    }
    
    // Clean up
    fs.unlinkSync(configPath1);
    fs.unlinkSync(configPath2);
    console.log('\nCleaned up temporary config files');
    
    // Overall result
    if (hasNpmOrgLogging && hasNoNpmOrgLogging) {
      console.log('\n✅ Overall verification: app.ts correctly handles the npm-org configuration option');
    } else {
      console.log('\n❌ Overall verification: app.ts does not correctly handle the npm-org configuration option');
    }
  } catch (error) {
    console.error('Error verifying app logging:', error);
  }
}

// Run the verification
verifyAppLogging();