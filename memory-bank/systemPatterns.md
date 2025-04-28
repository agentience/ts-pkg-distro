# System Patterns

This file documents recurring patterns and standards used in the project.
It is optional, but recommended to be updated as the project evolves.
2025-04-28 11:23:20 - Log of updates made.

*

## Coding Patterns

* Resource registration pattern: Each markdown guide is registered as a resource with a URI and a load function
* Tool registration pattern: Tools are registered with name, description, parameters schema, and execute function
* Configuration loading pattern: Configuration is loaded from multiple sources with a priority order
* Error handling pattern: Try-catch blocks with fallback to default values and error logging

## Architectural Patterns

* MCP server architecture: Server provides resources and tools for client access
* Resource-based architecture: Content is organized as resources accessible via URIs
* Tool-based architecture: Functionality is exposed as tools with defined parameters and execution logic
* Configuration hierarchy: Command-line args > environment vars > config file > defaults
* Transport abstraction: Server can use different transport types (stdio, http, websocket)

## Testing Patterns

* Simulation scripts: Scripts for simulating Roo Code integration in different modes
* Verification scripts: Scripts for verifying application integration, logging, and configuration
* Manual testing: Instructions for testing the package locally before publishing