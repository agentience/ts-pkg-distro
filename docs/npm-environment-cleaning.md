# NPM Environment Cleaning Guide

This document explains how to clean the npm environment of the `ts-pkg-distro` package and test the npx command on a fresh system.

## Package Name Considerations

The package has been published under two different names:

1. `ts-pkg-distro` (version 1.1.1) - Published without the organization prefix
2. `@agentience/ts-pkg-distro` (version 1.0.4) - Published with the organization prefix

### How Package Names Are Determined

The GitHub workflow that publishes the package determines the package name based on the presence of a `mcp-config.json` file in the root directory:

1. If `mcp-config.json` exists and contains an `npm-org` value:
   - The package is published with the organization prefix: `@{npm-org}/ts-pkg-distro`
   - Example: `@agentience/ts-pkg-distro`

2. If `mcp-config.json` doesn't exist or doesn't contain an `npm-org` value:
   - The package is published without an organization prefix: `ts-pkg-distro`

Previous releases were published as `ts-pkg-distro` (without the organization prefix) because there was no `mcp-config.json` file in the root directory.

We have now added a `mcp-config.json` file to the root directory with the `npm-org` setting set to "agentience", so future releases will be published as `@agentience/ts-pkg-distro`.

### Testing Both Package Names

The scripts in this repository are designed to test both package names to ensure compatibility during the transition period. This is important because:

1. Existing users may be using the non-prefixed version (`ts-pkg-distro`)
2. New users will use the prefixed version (`@agentience/ts-pkg-distro`)
3. We need to ensure both versions work correctly with the `npx` command

## Why Clean the NPM Environment?

When testing how a package works with npx, it's important to simulate a fresh system where the package has never been installed. This helps identify any issues that new users might encounter when using the package for the first time.

Cleaning the npm environment involves:

1. Removing the package from the local npm cache
2. Removing the package from global npm installations
3. Clearing any temporary npx cache
4. Testing the npx command to verify it works correctly

## Using the Clean and Test Script

We've created a script that automates the entire process of cleaning the npm environment and testing the npx command.

### Prerequisites

- Node.js and npm installed
- Bash shell (for macOS and Linux) or Git Bash (for Windows)

### Running the Script

```bash
# Navigate to the project directory
cd /path/to/mcp-ts-pkg-distro

# Run the script
./scripts/clean-and-test-npx.sh
```

### What the Script Does

The script performs the following actions:

1. **Checks Current Installation Status**: Determines if the package is currently installed globally or locally
2. **Cleans NPM Cache**: Removes the package from the npm cache
3. **Removes Global Installation**: Uninstalls the package from global npm installations
4. **Removes Local Installation**: Uninstalls the package from the local project
5. **Clears NPX Cache**: Removes any temporary npx cache for the package
6. **Verifies Clean Environment**: Confirms that the package has been completely removed
7. **Tests NPX Command**: Runs the package using npx to verify it works correctly
8. **Checks NPX Installation**: Examines how npx installed the package
9. **Provides Summary**: Summarizes the actions performed and results

### Script Output

The script provides detailed output in the terminal and also logs all actions and results to a file named `npx-test-results.log`. This log file contains:

- System information (OS, Node.js version, npm version)
- Initial installation status
- Cleanup actions performed
- NPX command output
- Verification results
- Summary of the entire process

## Manual Cleaning Process

If you prefer to clean the npm environment manually, follow these steps:

### 1. Remove from NPM Cache

```bash
# Clean both package versions
npm cache clean --force ts-pkg-distro
npm cache clean --force @agentience/ts-pkg-distro
```

### 2. Remove Global Installation

```bash
# Uninstall both package versions
npm uninstall -g ts-pkg-distro
npm uninstall -g @agentience/ts-pkg-distro
```

### 3. Remove Local Installation

```bash
# Uninstall both package versions
npm uninstall ts-pkg-distro
npm uninstall @agentience/ts-pkg-distro
```

### 4. Clear NPX Cache

The location of the npx cache depends on your operating system:

- **macOS/Linux**: `~/.npm/_npx/`
- **Windows**: `%LOCALAPPDATA%\npm-cache\_npx\`

Remove any directories containing `ts-pkg-distro` or `@agentience/ts-pkg-distro`, or simply clean the entire npm cache:

```bash
npm cache clean --force
```

### 5. Verify Clean Environment

```bash
# Check global installation for both package versions
npm list -g ts-pkg-distro
npm list -g @agentience/ts-pkg-distro

# Check local installation for both package versions
npm list ts-pkg-distro
npm list @agentience/ts-pkg-distro
```

### 6. Test NPX Command

```bash
# Test both package versions
npx -y ts-pkg-distro [options]
npx -y @agentience/ts-pkg-distro [options]
```

## Troubleshooting

### Package Still Found After Cleaning

If the package is still found after cleaning, try:

1. Check for alternative installation locations:
   ```bash
   which ts-pkg-distro
   ```

2. Look for symlinks in global bin directories:
   ```bash
   ls -la $(npm bin -g) | grep ts-pkg-distro
   ```

3. Force a complete npm cache clean:
   ```bash
   npm cache clean --force
   ```

### NPX Command Fails

If the npx command fails after cleaning:

1. Check npm registry access:
   ```bash
   npm ping
   ```

2. Verify package exists on npm:
   ```bash
   npm view ts-pkg-distro
   npm view @agentience/ts-pkg-distro
   ```

3. Check for network issues or proxy settings that might affect npm

## Conclusion

Cleaning the npm environment is an important step in testing how packages work with npx. The provided script automates this process, making it easy to verify that the package works correctly on a fresh system.

For any issues encountered during the cleaning process or when using the npx command, refer to the troubleshooting section or check the detailed log file generated by the script.