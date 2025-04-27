const { spawn } = require('child_process');

/**
 * Debug the "command not found" error by running different variations of the command
 */
async function debugNpxError() {
  console.log('=== Debugging NPX Command Not Found Error ===\n');
  
  // Test 1: Run npx with arguments as an array (no shell)
  console.log('Test 1: Running npx with arguments as an array (no shell)');
  await runCommand('npx', ['-y', '@agentience/ts-pkg-distro', '--version'], { shell: false });
  
  // Test 2: Run npx with arguments as a string (with shell)
  console.log('\nTest 2: Running npx with arguments as a string (with shell)');
  await runCommand('npx -y @agentience/ts-pkg-distro --version', [], { shell: true });
  
  // Test 3: Run node directly on the package's main file
  console.log('\nTest 3: Running node directly on the package\'s main file');
  await runCommand('node', ['./dist/app.js', '--version'], { shell: false });
  
  // Test 4: Check if the package is installed globally
  console.log('\nTest 4: Checking if the package is installed globally');
  await runCommand('npm', ['list', '-g', '@agentience/ts-pkg-distro'], { shell: false });
  
  // Test 5: Check PATH environment variable
  console.log('\nTest 5: Checking PATH environment variable');
  await runCommand('echo', ['$PATH'], { shell: true });
  
  // Test 6: Try running the command with the user's shell
  console.log('\nTest 6: Try running the command with the user\'s shell');
  await runCommand(process.env.SHELL || 'bash', ['-c', 'npx -y @agentience/ts-pkg-distro --version'], { shell: false });
  
  // Test 7: Check if ts-pkg-distro is in PATH
  console.log('\nTest 7: Check if ts-pkg-distro is in PATH');
  await runCommand('which', ['ts-pkg-distro'], { shell: false });
  
  // Test 8: Try running npx with verbose output
  console.log('\nTest 8: Try running npx with verbose output');
  await runCommand('npx', ['--loglevel', 'info', '-y', '@agentience/ts-pkg-distro', '--version'], { shell: false });
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
debugNpxError().catch(error => {
  console.error('Error running debug:', error);
});