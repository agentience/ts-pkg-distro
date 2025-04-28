# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
2025-04-28 11:22:00 - Log of updates made will be appended as footnotes to the end of this file.

*

## Project Goal

* The @agentience/ts-pkg-distro is a FastMCP server that provides resources and tools to guide users through the process of setting up and publishing a TypeScript package to npm. It's designed to work with Roo Code's Boomerang mode and other coding tools to provide step-by-step guidance.

## Key Features

* Provides markdown guides for each step of the TypeScript package distribution process
* Offers MCP resources accessible via URI (ts-pkg-distro://resource/*)
* Provides MCP tools for programmatic access to guides
* Supports configuration via command-line arguments, environment variables, and configuration files
* Integrates with Roo Code's Boomerang mode for interactive guidance
* Supports various transport types (stdio, http, websocket)
* Includes npm organization support for publishing packages under organization scopes

## Overall Architecture

* Built using FastMCP, a TypeScript framework for building MCP servers
* Provides both URI-based resource access and tool-based resource access
* Uses a modular approach with separate markdown files for each step of the process
* Implements a flexible configuration system with priority order (command-line args > environment vars > config file > defaults)
* Includes utility scripts for development, testing, and verification
* Current version: 1.1.4 (documentation-only changes in the latest release)