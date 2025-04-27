# Comprehensive Analysis of Roo MCP Server Launch Issues

## Executive Summary

We've identified and analyzed two key issues affecting MCP servers launched from Roo:

1. **Log Output Stream Issue**: Important logs sent to `stderr` are not visible in Roo, which appears to only capture and display `stdout`.

2. **NPX Execution Issue**: When executing MCP servers with npx, a "command not found" error occurs, but only when running from within the package's own directory.

We've implemented temporary workarounds in our package by switching important logs from `console.error` to `console.log`, but the core issues need to be addressed in Roo itself for a robust solution.

## Detailed Findings

### 1. Log Output Stream Issue

#### Problem Description
When launching an MCP server from Roo, important logs sent to `stderr` are not visible to the user. This includes critical information such as npm organization settings, server startup messages, and configuration details.

#### Evidence
- Our package intentionally used `console.error` for important logs to ensure visibility in terminal environments:
  ```typescript
  // Original code in app.ts
  if (config['npm-org']) {
    console.error(`Using npm organization: ${config['npm-org']}`);
  }
  ```

- Testing with our simulation scripts confirmed that these logs are correctly sent to stderr and visible when running directly in a terminal, but not when simulating Roo's execution method.

#### Root Cause
Roo appears to be capturing and displaying only `stdout` from MCP servers, ignoring `stderr`. This is likely due to how Roo's process spawning code is implemented.

### 2. NPX Execution Issue

#### Problem Description
When attempting to run the MCP server with npx in our test scripts, we encounter a `sh: ts-pkg-distro: command not found` error. However, the command works correctly when:
- Run directly in the user's terminal
- Run from a directory other than the package's own directory
- Started through Roo in another project

#### Evidence
- Testing with `simulate-roo-mcp.js` consistently produces the "command not found" error
- Testing with `test-npx-direct.js` with `shell: true` works correctly
- The user confirmed that the command works when run from another directory

#### Root Cause
The issue is related to how npx resolves packages when in the same directory as the package itself. When in the package's directory, npx gets confused about whether to use the local version or fetch from the registry, resulting in the "command not found" error.

## Implemented Workarounds

### 1. Switching to stdout for Important Logs

We've modified our package to use `console.log` instead of `console.error` for important informational logs:

```typescript
// Updated code in app.ts
if (config['npm-org']) {
  console.log(`Using npm organization: ${config['npm-org']}`);
}
```

This ensures that important logs are visible when the server is launched from Roo, which appears to only capture stdout.

### 2. No Workaround for NPX Execution Issue

We haven't implemented a workaround for the NPX execution issue since it only occurs when running from within the package's own directory, which is not a common use case for end users.

## Recommendations for Roo Team

### 1. Capture and Display Both stdout and stderr

**Priority: High**

Roo should capture and display both stdout and stderr from MCP servers to ensure all important logs are visible to users.

#### Implementation Recommendation:
```javascript
const child = spawn('npx', [
  '-y',
  '@agentience/ts-pkg-distro',
  '--config',
  'path/to/config.json'
], {
  shell: true, // Use shell: true to match how the user would run the command
  stdio: ['pipe', 'pipe', 'pipe'] // Capture stdout and stderr
});

// Capture and display both stdout and stderr
child.stdout.on('data', (data) => {
  console.log(data.toString());
});

child.stderr.on('data', (data) => {
  console.log(data.toString()); // Display stderr as well
});
```

### 2. Use shell: true When Executing NPX Commands

**Priority: Medium**

When executing npx commands in Roo, use `shell: true` to match how the user would run the command in their terminal and avoid the "command not found" error.

#### Implementation Recommendation:
```javascript
// Option 1: Use shell: true with array arguments
const child = spawn('npx', [
  '-y',
  '@agentience/ts-pkg-distro',
  '--config',
  'path/to/config.json'
], {
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe']
});

// Option 2: Use shell: true with command string
const child = spawn('npx -y @agentience/ts-pkg-distro --config path/to/config.json', {
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe']
});
```

### 3. Avoid Running MCP Servers from Their Own Directory

**Priority: Medium**

When Roo needs to run an MCP server that's in the current workspace, it should:
1. Either use a full path to the package
2. Or temporarily change to a different directory before executing the npx command

#### Implementation Recommendation:
```javascript
// Option 1: Use full path to the package
const child = spawn('npx', [
  path.resolve(process.cwd(), 'node_modules/.bin/ts-pkg-distro'),
  '--config',
  'path/to/config.json'
], {
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe']
});

// Option 2: Change directory before executing
const originalDir = process.cwd();
process.chdir('/tmp'); // Change to a temporary directory
const child = spawn('npx', [
  '-y',
  '@agentience/ts-pkg-distro',
  '--config',
  path.resolve(originalDir, 'path/to/config.json')
], {
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe']
});
process.chdir(originalDir); // Change back to original directory
```

### 4. Add Logging to Show How Roo is Executing the MCP Server

**Priority: Low**

Add logging to show the exact command Roo is using to execute the MCP server, which would help with debugging issues.

#### Implementation Recommendation:
```javascript
const command = 'npx -y @agentience/ts-pkg-distro --config path/to/config.json';
console.log(`Executing MCP server with command: ${command}`);
const child = spawn(command, {
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe']
});
```

## Test Cases to Verify Fixes

### Test Case 1: Capturing stderr Output

```javascript
// Test that Roo captures and displays stderr output
const { spawn } = require('child_process');

// Create a simple script that logs to stderr
const fs = require('fs');
fs.writeFileSync('test-stderr.js', `
  console.error('This is a test message to stderr');
  console.log('This is a test message to stdout');
`);

// Execute the script and capture both stdout and stderr
const child = spawn('node', ['test-stderr.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Both stdout and stderr should be captured and displayed
child.stdout.on('data', (data) => {
  console.log(`[STDOUT] ${data.toString().trim()}`);
});

child.stderr.on('data', (data) => {
  console.log(`[STDERR] ${data.toString().trim()}`);
});

// Expected output:
// [STDOUT] This is a test message to stdout
// [STDERR] This is a test message to stderr
```

### Test Case 2: Running NPX Commands with shell: true

```javascript
// Test that npx commands work correctly with shell: true
const { spawn } = require('child_process');

// Execute an npx command with shell: true
const child = spawn('npx -y cowsay "Hello, World!"', {
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe']
});

// Capture and display both stdout and stderr
child.stdout.on('data', (data) => {
  console.log(`[STDOUT] ${data.toString().trim()}`);
});

child.stderr.on('data', (data) => {
  console.log(`[STDERR] ${data.toString().trim()}`);
});

// Expected output: A cow saying "Hello, World!"
```

### Test Case 3: Running MCP Server from Different Directory

```javascript
// Test that MCP server runs correctly from a different directory
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Change to a temporary directory
const tempDir = os.tmpdir();
process.chdir(tempDir);

// Execute the MCP server from the temporary directory
const child = spawn('npx', [
  '-y',
  '@agentience/ts-pkg-distro',
  '--config',
  path.resolve(__dirname, 'path/to/config.json'),
  '--verbose'
], {
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe']
});

// Capture and display both stdout and stderr
child.stdout.on('data', (data) => {
  console.log(`[STDOUT] ${data.toString().trim()}`);
});

child.stderr.on('data', (data) => {
  console.log(`[STDERR] ${data.toString().trim()}`);
});

// Expected output: MCP server starts successfully with verbose logs
```

## Long-term Recommendations

### 1. Implement a Unified Logging Mechanism in Roo

Develop a standardized logging system in Roo that:
- Captures and displays both stdout and stderr
- Provides clear visual distinction between different types of logs
- Allows filtering of logs by severity or source
- Supports log persistence for debugging

### 2. Standardize MCP Server Execution

Create a standardized method for executing MCP servers that:
- Works consistently across different environments
- Handles package resolution correctly
- Provides clear error messages when things go wrong
- Supports both local and remote MCP servers

### 3. Document Best Practices for MCP Server Developers

Provide clear guidelines for MCP server developers on:
- How to structure logging (stdout vs. stderr)
- How to handle configuration
- How to ensure compatibility with Roo
- How to test MCP servers with Roo

## Conclusion

The issues we've identified are primarily related to how Roo captures output and executes npx commands. By implementing the recommended changes, Roo can provide a more robust and user-friendly experience for MCP server developers and users.

Our temporary workaround of switching to stdout for important logs addresses the immediate issue, but the long-term solution requires changes to Roo itself to properly handle both stdout and stderr, and to execute npx commands correctly.

The most critical recommendation is to ensure Roo captures and displays both stdout and stderr from MCP servers, as this will ensure all important logs are visible to users regardless of which stream they're sent to.