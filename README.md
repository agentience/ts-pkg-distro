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

## MCP Server Configuration

You can configure the MCP server using a JSON configuration file. By default, the server looks for a file named `mcp-config.json` in the current directory, but you can specify a different path using the `--config` flag.

### Configuration Options

The configuration file supports the following options:

```json
{
  "server": {
    "name": "Custom Server Name",
    "version": "1.0.0"
  },
  "transport": {
    "type": "stdio",
    "options": {
      // Transport-specific options
    }
  }
}
```

#### Server Options

- `name`: Custom name for the MCP server
- `version`: Custom version for the MCP server

#### Transport Options

- `type`: The transport type to use (default: "stdio")
  - Supported values: "stdio", "http", "websocket"
- `options`: Transport-specific configuration options
  - For HTTP: `{ "port": 3000, "host": "localhost" }`
  - For WebSocket: `{ "port": 3000 }`

### Example Configurations

#### Basic Configuration (stdio)

```json
{
  "server": {
    "name": "TS-PKG-Distro",
    "version": "1.0.2"
  },
  "transport": {
    "type": "stdio"
  }
}
```

#### HTTP Server Configuration

```json
{
  "server": {
    "name": "TS-PKG-Distro",
    "version": "1.0.2"
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

## Usage with npx

You can run the MCP server directly using npx without installing it:

```bash
npx @agentience/ts-pkg-distro
```

To use a custom configuration file:

```bash
npx @agentience/ts-pkg-distro --config ./my-config.json
```

### Example Configuration Files

The package includes example configuration files in the `examples` directory:

- `examples/mcp-config.json` - Basic stdio configuration
- `examples/http-config.json` - HTTP server configuration

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
