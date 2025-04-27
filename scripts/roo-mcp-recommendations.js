/**
 * This script provides recommendations for fixing the issue with npm organization logs
 * not being visible when the MCP server is launched from Roo.
 */

// Import required modules
const fs = require('fs');
const path = require('path');

// Define the paths to the source files
const appTsPath = path.join(__dirname, '../src/app.ts');
const indexTsPath = path.join(__dirname, '../src/index.ts');

// Function to read a file and return its content
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Function to analyze the app.ts file
function analyzeAppTs(content) {
  console.log('=== Analyzing app.ts ===');
  
  // Check if console.error is used for npm organization logs
  const usesConsoleError = content.includes('console.error(`Using npm organization:');
  console.log(`Uses console.error for npm organization logs: ${usesConsoleError ? 'Yes' : 'No'}`);
  
  // Check if console.log is used for npm organization logs
  const usesConsoleLog = content.includes('console.log(`Using npm organization:');
  console.log(`Uses console.log for npm organization logs: ${usesConsoleLog ? 'Yes' : 'No'}`);
  
  // Check if the verbose flag is handled
  const handlesVerboseFlag = content.includes('if (config.verbose)') || content.includes('if (parsedArgs.verbose');
  console.log(`Handles verbose flag: ${handlesVerboseFlag ? 'Yes' : 'No'}`);
  
  return {
    usesConsoleError,
    usesConsoleLog,
    handlesVerboseFlag
  };
}

// Function to analyze the index.ts file
function analyzeIndexTs(content) {
  console.log('\n=== Analyzing index.ts ===');
  
  // Check if console.error is used for server startup logs
  const usesConsoleError = content.includes('console.error(`${serverName} MCP server');
  console.log(`Uses console.error for server startup logs: ${usesConsoleError ? 'Yes' : 'No'}`);
  
  // Check if console.log is used for server startup logs
  const usesConsoleLog = content.includes('console.log(`${serverName} MCP server');
  console.log(`Uses console.log for server startup logs: ${usesConsoleLog ? 'Yes' : 'No'}`);
  
  return {
    usesConsoleError,
    usesConsoleLog
  };
}

// Function to provide recommendations
function provideRecommendations(appTsAnalysis, indexTsAnalysis) {
  console.log('\n=== Recommendations ===');
  
  // Recommendation 1: Modify the package to use console.log instead of console.error
  if (appTsAnalysis.usesConsoleError || indexTsAnalysis.usesConsoleError) {
    console.log('\n1. Modify the package to use console.log instead of console.error');
    console.log('   - This will ensure that important logs are visible in stdout, which Roo might be capturing');
    console.log('   - Files to modify:');
    if (appTsAnalysis.usesConsoleError) {
      console.log('     - src/app.ts: Change console.error to console.log for npm organization logs');
    }
    if (indexTsAnalysis.usesConsoleError) {
      console.log('     - src/index.ts: Change console.error to console.log for server startup logs');
    }
  }
  
  // Recommendation 2: Add a unified logging mechanism
  console.log('\n2. Add a unified logging mechanism');
  console.log('   - Create a logger module that can be configured to output to stdout or stderr');
  console.log('   - Use this logger throughout the codebase instead of console.log or console.error');
  console.log('   - Example implementation:');
  console.log(`
// logger.ts
export function createLogger(options = { useStderr: false }) {
  return {
    log: (message) => {
      if (options.useStderr) {
        console.error(message);
      } else {
        console.log(message);
      }
    },
    error: (message) => {
      console.error(message);
    }
  };
}

// Usage in app.ts
import { createLogger } from './logger';
const logger = createLogger({ useStderr: false });
logger.log(\`Using npm organization: \${config['npm-org']}\`);
`);
  
  // Recommendation 3: Modify Roo to capture stderr
  console.log('\n3. Modify Roo to capture and display stderr output');
  console.log('   - Ensure Roo is capturing both stdout and stderr from MCP servers');
  console.log('   - Consider merging stderr and stdout streams for display purposes');
  console.log('   - Add logging to show how Roo is executing the MCP server');
  
  // Recommendation 4: Add a configuration option
  console.log('\n4. Add a configuration option to control log output');
  console.log('   - Add a "logToStdout" option in the configuration');
  console.log('   - Use this option to determine whether to use console.log or console.error');
  console.log('   - Example implementation:');
  console.log(`
// In app.ts
interface PackageConfig {
  // ... existing fields
  logToStdout?: boolean; // Whether to log to stdout instead of stderr
}

// In loadConfig function
if (config['npm-org']) {
  if (config.logToStdout) {
    console.log(\`Using npm organization: \${config['npm-org']}\`);
  } else {
    console.error(\`Using npm organization: \${config['npm-org']}\`);
  }
}
`);
}

// Main function
function main() {
  console.log('=== Roo MCP Server Launch Analysis - Recommendations ===\n');
  
  // Read the source files
  const appTsContent = readFile(appTsPath);
  const indexTsContent = readFile(indexTsPath);
  
  if (!appTsContent || !indexTsContent) {
    console.error('Error reading source files. Cannot provide recommendations.');
    return;
  }
  
  // Analyze the source files
  const appTsAnalysis = analyzeAppTs(appTsContent);
  const indexTsAnalysis = analyzeIndexTs(indexTsContent);
  
  // Provide recommendations
  provideRecommendations(appTsAnalysis, indexTsAnalysis);
  
  console.log('\n=== Summary ===');
  console.log('The issue is likely that Roo is not capturing or displaying stderr output from MCP servers.');
  console.log('The recommendations above provide several approaches to fix this issue, either by:');
  console.log('1. Modifying the package to use stdout instead of stderr');
  console.log('2. Adding a unified logging mechanism that can be configured');
  console.log('3. Modifying Roo to capture and display stderr output');
  console.log('4. Adding a configuration option to control log output');
  console.log('\nImplementing any of these recommendations should resolve the issue.');
}

// Run the main function
main();