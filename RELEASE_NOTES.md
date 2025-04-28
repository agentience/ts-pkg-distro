# Release Notes for v1.1.4

## Overview

This release includes a documentation-only change, focusing on reorganizing the README.md file for improved clarity and usability.

## Key Improvements

### Documentation Reorganization
- Restructured README.md for better readability
- Improved organization of sections and content
- Enhanced clarity of installation and usage instructions

## Technical Details

### Changes
- Documentation-only changes (no code modifications)
- README.md reorganization for better user experience

## Upgrade Instructions

To upgrade to v1.1.4, run:

```bash
npm install @agentience/ts-pkg-distro@1.1.4
```

Or update your package.json dependency:

```json
"dependencies": {
  "@agentience/ts-pkg-distro": "^1.1.4"
}
```

Then run `npm install`.

# Release Notes for v1.1.3

## Overview

This release includes several enhancements to the ts-pkg-distro package, focusing on server configuration improvements, GitHub workflow enhancements, project organization, Roo integration fixes, logging improvements, and comprehensive documentation.

## Key Improvements

### Server Configuration Improvements
- Added support for configuration via mcp-config.json file
- Enhanced environment variable support for configuration
- Improved command-line argument parsing
- Added verbose logging option

### GitHub Workflow Enhancements
- Added GitHub workflow for automated testing and publishing
- Improved release process documentation
- Enhanced version management

### Project Organization
- Restructured project files for better maintainability
- Added documentation directory
- Improved script organization

### Roo Integration Fixes
- Fixed issues with MCP server logs not being visible in Roo
- Identified and documented NPX execution issues
- Provided workarounds and recommendations for Roo integration

### Logging Improvements
- Switched important logs from stderr to stdout for better visibility in Roo
- Added more detailed logging for server startup and configuration
- Improved error handling and reporting

### Comprehensive Documentation
- Added detailed findings and recommendations for Roo integration
- Enhanced markdown guides for package usage
- Improved npm organization documentation

## Technical Details

### Fixed Issues
- MCP server logs not visible in Roo due to stderr not being captured
- NPX execution issues when running from within the package's directory
- Configuration loading inconsistencies

### New Features
- Configuration file support (mcp-config.json)
- Verbose logging mode
- Enhanced npm organization support

## Upgrade Instructions

To upgrade to v1.1.3, run:

```bash
npm install @agentience/ts-pkg-distro@1.1.3
```

Or update your package.json dependency:

```json
"dependencies": {
  "@agentience/ts-pkg-distro": "^1.1.3"
}
```

Then run `npm install`.
