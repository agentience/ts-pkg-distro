# Release Notes for v1.2.2

## Overview

This is a documentation update that corrects references to the package's entry point file. The documentation now correctly refers to 'app.ts' instead of 'cli.ts' as the entry point.

## Key Improvements

### Documentation Corrections
- Updated references from 'cli.ts' to 'app.ts' in documentation files
- Ensured documentation accurately reflects the actual codebase structure
- Affected files: 00-Orchestrator.md, 05-Executable-Setup.md, 06-Build-and-Test.md

## Upgrade Instructions

To upgrade to v1.2.2, run:

```bash
npm install @agentience/ts-pkg-distro@1.2.2
```

Or update your package.json dependency:

```json
"dependencies": {
  "@agentience/ts-pkg-distro": "^1.2.2"
}
```

Then run `npm install`.

# Release Notes for v1.2.1

## Overview

This is a patch release that fixes an issue with the publishing process. It contains the same features and improvements as v1.2.0.

## Key Improvements

### Publishing Process Fix
- Fixed an issue with the automated publishing process
- Bumped version to 1.2.1 to allow for proper npm publishing

## Upgrade Instructions

To upgrade to v1.2.1, run:

```bash
npm install @agentience/ts-pkg-distro@1.2.1
```

Or update your package.json dependency:

```json
"dependencies": {
  "@agentience/ts-pkg-distro": "^1.2.1"
}
```

Then run `npm install`.

# Release Notes for v1.2.0

## Overview

This release includes an enhancement to the package distribution process, ensuring that markdown files from the `src/markdown/` directory are included in the package distribution. This was necessary for the server to correctly provide its resources.

## Key Improvements

### Package Distribution Enhancement
- Added a new script to copy markdown files to the distribution directory
- Modified the build process to include markdown files in the package
- Ensured server resources are correctly available in the published package

## Technical Details

### Changes
- Added a new `copy-markdown` script to package.json
- Updated the build script to include the markdown copying step
- Verified that markdown files are present in the dist directory after build

## Upgrade Instructions

To upgrade to v1.2.0, run:

```bash
npm install @agentience/ts-pkg-distro@1.2.0
```

Or update your package.json dependency:

```json
"dependencies": {
  "@agentience/ts-pkg-distro": "^1.2.0"
}
```

Then run `npm install`.

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
