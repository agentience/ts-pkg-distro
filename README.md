# TS-PKG-Distro Server

[![npm version](https://img.shields.io/npm/v/ts-pkg-distro.svg)](https://www.npmjs.com/package/ts-pkg-distro)

A FastMCP server providing resources for TypeScript package distribution.

## Overview

This MCP server provides access to markdown documents that guide you through the process of setting up and publishing a TypeScript package to npm. Each step of the process is available as a separate resource, with an orchestrator that provides an overview of the entire process.

## Resources

The server provides the following resources:

- `ts-pkg-distro://orchestrator` - Main guide with overview of the entire process
- `ts-pkg-distro://project-assessment` - Assess your current project structure
- `ts-pkg-distro://initial-setup` - Initial setup for a TypeScript package
- `ts-pkg-distro://typescript-configuration` - Configure TypeScript for package distribution
- `ts-pkg-distro://package-configuration` - Package.json configuration for distribution
- `ts-pkg-distro://executable-setup` - Make your package executable with npx
- `ts-pkg-distro://build-and-test` - Build and test your TypeScript package
- `ts-pkg-distro://publishing-preparation` - Prepare your package for publishing
- `ts-pkg-distro://publishing-to-npm` - Publish your package to npm registry
- `ts-pkg-distro://index` - Index of all available resources

## Tools

The server provides tools to access the guides programmatically:

- `get_guide` - Get a specific guide by name
- `get_orchestrator_guide` - Get the main orchestrator guide
- `get_project_assessment_guide` - Get the project assessment guide
- `get_initial_setup_guide` - Get the initial setup guide
- `get_typescript_configuration_guide` - Get the TypeScript configuration guide
- `get_package_configuration_guide` - Get the package configuration guide
- `get_executable_setup_guide` - Get the executable setup guide
- `get_build_and_test_guide` - Get the build and test guide
- `get_publishing_preparation_guide` - Get the publishing preparation guide
- `get_publishing_to_npm_guide` - Get the publishing to npm guide
- `list_guides` - Get a list of all available guides
- `get_next_guide` - Get the next guide in sequence after the current one

## Usage with Roo Code's Boomerang Mode

To use this server with Roo Code's Boomerang Mode, use the following prompt:

```
Follow the instructions found at ts-pkg-distro://orchestrator
```

## Development

To start the server:

1. Install dependencies:
   ```
   npm install
   ```

2. Build the server:
   ```
   npm run build
   ```

3. Start the server:
   ```
   npm start
   ```

For local development with hot reloading:
```
npm run dev
```

## Implementation

This server is built using [FastMCP](https://github.com/punkpeye/fastmcp), a TypeScript framework for building MCP servers. The server provides both URI-based resource access and tool-based resource access.

### Directory Structure

```
ts-pkg-distro-mcp/
├── dist/                # Compiled JavaScript (generated)
├── src/
│   ├── index.ts         # Main server entry point
│   ├── resources.ts     # Resource handler implementation
│   └── markdown/        # Markdown resource files
│       ├── 00-Orchestrator.md
│       ├── 01-Project-Assessment.md
│       ├── 02-Initial-Setup.md
│       ├── 03-TypeScript-Configuration.md
│       ├── 04-Package-Configuration.md
│       ├── 05-Executable-Setup.md
│       ├── 06-Build-and-Test.md
│       ├── 07-Publishing-Preparation.md
│       └── 08-Publishing-to-npm.md
├── package.json
└── tsconfig.json
```

## License

MIT
