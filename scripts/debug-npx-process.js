const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Debug the npx process to understand why it can't find the ts-pkg-distro command
 */
async function debugNpxProcess() {
  console.log('=== Debugging NPX Process ===\n');
  
  // Test 1: Check if the binary is executable
  console.log('Test 1: Check if the binary is executable');
  const appJsPath = path.join(__dirname, '../dist/app.js');
  try {
    const stats = fs.statSync(appJsPath);
    const isExecutable = !!(stats.mode & fs.constants.S_IXUSR);
    console.log(`Binary exists: ${fs.existsSync(appJsPath)}`);
    console.log(`Binary is executable: ${isExecutable}`);
    console.log(`Binary permissions: ${stats.mode.toString(8)}`);
    
    // Check if the file has a shebang
    const content = fs.readFileSync(appJsPath, 'utf8').slice(0, 100);
    console.log(`Binary starts with: ${content.split('\n')[0]}`);
  } catch (error) {
    console.error(`Error checking binary: ${error.message}`);
  }
  
  // Test 2: Run npx with --no-install flag to see if it's a PATH issue
  console.log('\nTest 2: Run npx with --no-install flag');
  await runCommand('npx', ['--no-install', '@agentience/ts-pkg-distro', '--version'], { shell: false });
  
  // Test 3: Check what happens when npx runs a package
  console.log('\nTest 3: Check what happens when npx runs a package');
  await runCommand('npx', ['--loglevel', 'info', '-y', '@agentience/ts-pkg-distro', '--version'], { shell: false });
  
  // Test 4: Try running the package with npm exec
  console.log('\nTest 4: Try running the package with npm exec');
  await runCommand('npm', ['exec', '--yes', '@agentience/ts-pkg-distro', '--', '--version'], { shell: false });
  
  // Test 5: Check if the package is published correctly
  console.log('\nTest 5: Check if the package is published correctly');
  await runCommand('npm', ['view', '@agentience/ts-pkg-distro'], { shell: false });
  
  // Test 6: Check what's in the node_modules/.bin directory
  console.log('\nTest 6: Check what\'s in the node_modules/.bin directory');
  const binPath = path.join(__dirname, '../node_modules/.bin');
  try {
    if (fs.existsSync(binPath)) {
      const files = fs.readdirSync(binPath);
      console.log(`Files in ${binPath}:`);
      files.forEach(file => console.log(`- ${file}`));
    } else {
      console.log(`${binPath} does not exist`);
    }
  } catch (error) {
    console.error(`Error checking bin directory: ${error.message}`);
  }
}

/**
 * Run a command and return the output
 */
async function runCommand(command, args, options) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      ...options,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      console.log(`[STDOUT] ${text.trim()}`);
    });
    
    child.stderr.on('data', (data) => {
      const text = data.toString();
      stderr += text;
      console.log(`[STDERR] ${text.trim()}`);
    });
    
    child.on('error', (error) => {
      console.error(`[ERROR] ${error.message}`);
      resolve({ stdout, stderr, error: error.message });
    });
    
    child.on('close', (code) => {
      console.log(`Command exited with code ${code}`);
      resolve({ stdout, stderr, code });
    });
  });
}

// Run the debug function
debugNpxProcess().catch(error => {
  console.error('Error running debug:', error);
});