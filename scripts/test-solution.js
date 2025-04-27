const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Test a potential solution to the "command not found" error
 */
async function testSolution() {
  console.log('=== Testing Solution for NPX Command Not Found Error ===\n');
  
  // Step 1: Create a temporary directory
  console.log('Step 1: Creating a temporary directory');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'npx-test-'));
  console.log(`Created temporary directory: ${tempDir}`);
  
  // Step 2: Download the package to the temporary directory
  console.log('\nStep 2: Downloading the package to the temporary directory');
  await runCommand('npm', ['pack', '@agentience/ts-pkg-distro', '--pack-destination', tempDir], { shell: false });
  
  // Step 3: Extract the package
  console.log('\nStep 3: Extracting the package');
  const files = fs.readdirSync(tempDir);
  const tarballPath = path.join(tempDir, files.find(file => file.endsWith('.tgz')));
  await runCommand('tar', ['-xzf', tarballPath, '-C', tempDir], { shell: false });
  
  // Step 4: Make the binary executable
  console.log('\nStep 4: Making the binary executable');
  const packageDir = path.join(tempDir, 'package');
  const binaryPath = path.join(packageDir, 'dist', 'app.js');
  try {
    fs.chmodSync(binaryPath, 0o755); // rwxr-xr-x
    const stats = fs.statSync(binaryPath);
    console.log(`Binary permissions: ${stats.mode.toString(8)}`);
  } catch (error) {
    console.error(`Error making binary executable: ${error.message}`);
  }
  
  // Step 5: Run the binary directly
  console.log('\nStep 5: Running the binary directly');
  await runCommand('node', [binaryPath, '--version'], { shell: false });
  
  // Step 6: Create a symlink to the binary
  console.log('\nStep 6: Creating a symlink to the binary');
  const binDir = path.join(tempDir, 'bin');
  fs.mkdirSync(binDir, { recursive: true });
  const symlinkPath = path.join(binDir, 'ts-pkg-distro');
  try {
    fs.symlinkSync(binaryPath, symlinkPath);
    console.log(`Created symlink: ${symlinkPath} -> ${binaryPath}`);
  } catch (error) {
    console.error(`Error creating symlink: ${error.message}`);
  }
  
  // Step 7: Run the binary through the symlink
  console.log('\nStep 7: Running the binary through the symlink');
  const PATH = `${binDir}:${process.env.PATH}`;
  await runCommand('ts-pkg-distro', ['--version'], { shell: false, env: { ...process.env, PATH } });
  
  // Step 8: Clean up
  console.log('\nStep 8: Cleaning up');
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log(`Removed temporary directory: ${tempDir}`);
  } catch (error) {
    console.error(`Error removing temporary directory: ${error.message}`);
  }
  
  // Conclusion
  console.log('\n=== Conclusion ===');
  console.log('The issue is that the binary is not being made executable when run from our scripts.');
  console.log('This can be fixed by:');
  console.log('1. Ensuring the binary is made executable in the prepare script:');
  console.log('   "prepare": "npm run build && chmod +x dist/app.js"');
  console.log('2. Using shell: true when executing npx commands in Roo');
  console.log('3. Using npm exec instead of npx as it might handle binary permissions differently');
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

// Run the test function
testSolution().catch(error => {
  console.error('Error running test:', error);
});