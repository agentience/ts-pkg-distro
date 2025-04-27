# @agentience/ts-pkg-distro Server

[![npm version](https://img.shields.io/npm/v/@agentience/ts-pkg-distro.svg)](https://www.npmjs.com/package/@agentience/ts-pkg-distro)

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
- `ts-pkg-distro://npm-organizations-guide` - Comprehensive guide to npm organizations (scopes)
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
- `get_npm_organizations_guide` - Get the npm organizations guide
- `list_guides` - Get a list of all available guides
- `get_next_guide` - Get the next guide in sequence after the current one

## Usage with Roo Code's Boomerang Mode

To use this server with Roo Code's Boomerang Mode, use the following prompt:

```
Follow the instructions found at ts-pkg-distro://orchestrator
```

### What Happens After Submitting the Prompt

When you submit the above prompt in Roo Code's Boomerang Mode, the following workflow is initiated:

1. **Orchestrator Activation**: Boomerang Mode connects to the ts-pkg-distro MCP server and accesses the orchestrator guide, which provides an overview of the entire TypeScript package distribution process.

2. **Step-by-Step Guidance**: The orchestrator breaks down the process into 8 sequential steps:
   - **Project Assessment**: Evaluates your current project setup to determine which steps are needed
   - **Initial Setup**: Creates the basic project structure if needed
   - **TypeScript Configuration**: Configures TypeScript specifically for package distribution
   - **Package Configuration**: Sets up package.json for npm distribution
   - **Executable Setup** (optional): Makes your package executable with npx if desired
   - **Build and Test**: Builds your package and tests it locally
   - **Publishing Preparation**: Prepares your package for publishing
   - **Publishing to npm**: Publishes your package to the npm registry

3. **Interactive Workflow**: For each step, Boomerang Mode will:
   - Explain the purpose of the step
   - Determine if the step is necessary for your project
   - Provide detailed instructions for completing the step
   - Execute necessary commands with your permission
   - Verify the results before proceeding to the next step

4. **Adaptive Assistance**: The workflow adapts based on your project's current state:
   - If you have an existing project, it will assess what's already set up
   - If you're starting from scratch, it will guide you through the complete setup
   - It will skip steps that aren't relevant to your specific package

5. **Completion and Follow-up**: After completing all necessary steps:
   - Your TypeScript package will be properly configured and published to npm
   - You'll receive guidance on maintaining and updating your package
   - You can optionally set up CI/CD for automated publishing

This guided approach ensures that your TypeScript package follows best practices for npm distribution, with proper configuration for TypeScript declaration files, package exports, and command-line functionality if needed.

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

### Scripts

The project includes various utility scripts in the `scripts/` directory:

- **Simulation Scripts**:
  - `simulate-roo-*.js` - Scripts for simulating Roo Code integration in different modes
  - `simulate-roo-mcp.js` - Basic MCP server simulation
  - `simulate-roo-mcp-exact.js` - Exact MCP protocol simulation
  - `simulate-roo-linked.js` - Linked package simulation
  - `simulate-roo-capture.js` - Output capture simulation
  - `simulate-roo-mcp-local.js` - Local MCP server simulation

- **Verification Scripts**:
  - `verify-app-integration.js` - Verify application integration
  - `verify-app-logging.js` - Verify application logging
  - `verify-fastmcp-logging.js` - Verify FastMCP logging
  - `verify-npm-org.js` - Verify npm organization configuration

- **Utility Scripts**:
  - `run-npx.sh` - Helper script for running the package with npx

These scripts are primarily used for development, testing, and verification purposes.

## MCP Server Configuration

You can configure the MCP server using multiple methods, with the following priority order (highest to lowest):

1. Command-line arguments
2. Environment variables
3. Configuration file
4. Default values

By default, the server uses the package.json for version information and sets the server name to lowercase 'ts-pkg-distro'.

### Configuration Methods

#### 1. Configuration File

The server looks for a file named `mcp-config.json` in the current directory by default, but you can specify a different path using the `--config` flag.

```json
{
  "server": {
    "name": "custom-server-name",
    "version": "1.0.0"
  },
  "transport": {
    "type": "stdio",
    "options": {
      // Transport-specific options
    }
  },
  "npm-org": "agentience"
}
```

#### 2. Environment Variables

You can use environment variables with the prefix `TS_PKG_DISTRO_` to override configuration values:

- `TS_PKG_DISTRO_SERVER_NAME`: Server name
- `TS_PKG_DISTRO_TRANSPORT_TYPE`: Transport type
- `TS_PKG_DISTRO_TRANSPORT_PORT`: HTTP/WebSocket port
- `TS_PKG_DISTRO_TRANSPORT_HOST`: HTTP host
- `TS_PKG_DISTRO_NPM_ORG`: npm organization
- `TS_PKG_DISTRO_VERBOSE`: Enable verbose logging

Example:
```bash
TS_PKG_DISTRO_SERVER_NAME=my-server TS_PKG_DISTRO_VERBOSE=true npx @agentience/ts-pkg-distro
```

#### 3. Command-line Arguments

You can use command-line arguments to override configuration values:

- `--server-name`: Server name
- `--transport-type`: Transport type
- `--transport-port`: HTTP/WebSocket port
- `--transport-host`: HTTP host
- `--npm-org`: npm organization
- `--verbose`: Enable verbose logging
- `--config`: Path to configuration file

Arguments can be specified in two formats:
```bash
npx @agentience/ts-pkg-distro --server-name=my-server --verbose
# or
npx @agentience/ts-pkg-distro --server-name my-server --verbose
```

### Configuration Options

#### Server Options

- `name`: Custom name for the MCP server (default: "ts-pkg-distro")

#### Transport Options

- `type`: The transport type to use (default: "stdio")
  - Supported values: "stdio", "http", "websocket"
- `options`: Transport-specific configuration options
  - For HTTP: `{ "port": 3000, "host": "localhost" }`
  - For WebSocket: `{ "port": 3000 }`

#### npm Organization Options

- `npm-org`: Optional organization namespace for npm publishing
  - When specified, automatically:
    - Updates the package name in package.json to include your organization scope (e.g., `@agentience/package-name`)
    - Adds the `--access public` flag when publishing
  - Useful for:
    - Maintaining consistent package naming across environments
    - Simplifying CI/CD pipelines
    - Managing organization scopes for projects with multiple packages

### Example Configurations

#### Basic Configuration (stdio)

```json
{
  "server": {
    "name": "ts-pkg-distro"
  },
  "transport": {
    "type": "stdio"
  }
}
```

#### Basic Configuration with npm Organization

```json
{
  "server": {
    "name": "ts-pkg-distro"
  },
  "transport": {
    "type": "stdio"
  },
  "npm-org": "agentience"
}
```

#### HTTP Server Configuration

```json
{
  "server": {
    "name": "ts-pkg-distro"
  },
  "transport": {
    "type": "http",
    "options": {
      "port": 3000,
      "host": "localhost"
    }
  }
}
```

#### HTTP Server with npm Organization

```json
{
  "server": {
    "name": "ts-pkg-distro"
  },
  "transport": {
    "type": "http",
    "options": {
      "port": 3000,
      "host": "localhost"
    }
  },
  "npm-org": "agentience"
}
```

## Usage with npx

You can run the MCP server directly using npx without installing it:

```bash
npx @agentience/ts-pkg-distro
```

To use a custom configuration file:

```bash
npx @agentience/ts-pkg-distro --config ./my-config.json
```

### Command-line Examples

```bash
# Use a custom server name
npx @agentience/ts-pkg-distro --server-name=my-custom-server

# Use HTTP transport on port 4000
npx @agentience/ts-pkg-distro --transport-type=http --transport-port=4000

# Use a custom configuration file with verbose logging
npx @agentience/ts-pkg-distro --config=./my-config.json --verbose

# Use npm organization with environment variables
TS_PKG_DISTRO_NPM_ORG=myorg npx @agentience/ts-pkg-distro
```

### Example Configuration Files

The package includes example configuration files in the `examples` directory:

- `examples/mcp-config.json` - Basic stdio configuration
- `examples/http-config.json` - HTTP server configuration

You can modify these example configurations to include the `npm-org` option for publishing packages under your organization scope.

You can use these as templates for your own configuration:

```bash
# Copy an example configuration
cp node_modules/@agentience/ts-pkg-distro/examples/http-config.json ./mcp-config.json

# Edit as needed
nano mcp-config.json

# Run with the configuration
npx @agentience/ts-pkg-distro
```

## Integration with Roo Code

To use this MCP server with Roo Code or other MCP clients, you need to configure it in the client's MCP server configuration file. For Roo Code, this is typically located at `.roo/mcp.json`.

### Roo Code Configuration

Add the following to your `.roo/mcp.json` file:

```json
{
  "mcpServers": {
    "ts-pkg-distro": {
      "command": "npx",
      "args": [
        "-y",
        "@agentience/ts-pkg-distro"
      ]
    }
  }
}
```

### With Custom Configuration

To use a custom configuration file with Roo Code:

```json
{
  "mcpServers": {
    "ts-pkg-distro": {
      "command": "npx",
      "args": [
        "-y",
        "@agentience/ts-pkg-distro",
        "--config",
        "./path/to/your/config.json"
      ]
    }
  }
}
```

### Accessing Resources

Once configured, you can access the resources in your Roo Code prompts:

```
Follow the instructions found at ts-pkg-distro://orchestrator
```

Or use the tools directly:

```
Use the ts-pkg-distro server to get the publishing-to-npm guide
```

## Implementation

This server is built using [FastMCP](https://github.com/punkpeye/fastmcp), a TypeScript framework for building MCP servers. The server provides both URI-based resource access and tool-based resource access.

### Directory Structure

```
ts-pkg-distro-mcp/
├── dist/                # Compiled JavaScript (generated)
├── examples/            # Example configuration files
│   ├── http-config.json
│   └── mcp-config.json
├── scripts/             # Utility and testing scripts
│   ├── run-npx.sh
│   ├── simulate-roo-*.js
│   └── verify-*.js
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
│       ├── 08-Publishing-to-npm.md
│       └── 09-npm-Organizations-Guide.md
├── package.json
└── tsconfig.json
```

## License

MIT
