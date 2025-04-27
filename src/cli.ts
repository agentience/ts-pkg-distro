#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { z } from "zod";
import { RESOURCES, readMarkdownResource, registerResourceHandlers } from "./resources";
import * as fs from 'fs';
import * as path from 'path';

// Create and export the server instance
export const server = new FastMCP({
  name: "TS-PKG-Distro",
  version: "1.0.2",
});

/**
 * Load configuration from a JSON file if it exists
 */
function loadConfig(configPath?: string): any {
  // Default config path is mcp-config.json in the current directory
  const filePath = configPath || path.join(process.cwd(), 'mcp-config.json');
  
  if (fs.existsSync(filePath)) {
    try {
      const configData = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.error(`Error loading configuration from ${filePath}:`, error);
    }
  }
  
  return {};
}

/**
 * Configure the server with the provided configuration
 */
function configureServer(server: FastMCP, config: any) {
  // Apply server configuration
  if (config.server) {
    // We can't directly set name and version as they're readonly properties
    // But we can apply other configuration options if needed
    console.log(`Using server configuration: ${JSON.stringify(config.server)}`);
  }
  
  return server;
}

/**
 * Main CLI function
 */
export function main() {
  const args = process.argv.slice(2);
  let configPath: string | undefined;
  
  // Check for --config flag
  const configIndex = args.indexOf('--config');
  if (configIndex !== -1 && args.length > configIndex + 1) {
    configPath = args[configIndex + 1];
  }
  
  // Load configuration
  const config = loadConfig(configPath);
  
  // Configure the server
  configureServer(server, config);

  // Register resource URI handlers
  registerResourceHandlers(server);

  // Register tools for accessing individual guides
  Object.entries(RESOURCES).forEach(([name, info]) => {
    server.addTool({
      name: `get_${name.replace(/-/g, "_")}_guide`,
      description: `Get the ${name.replace(/-/g, " ")} guide content`,
      parameters: z.object({}),
      execute: async () => {
        return readMarkdownResource(info.filename);
      },
    });
  });

  // Register a generic guide tool
  server.addTool({
    name: "get_guide",
    description: "Get a specific guide by name",
    parameters: z.object({
      guide: z.enum([
        "orchestrator",
        "project-assessment",
        "initial-setup",
        "typescript-configuration",
        "package-configuration",
        "executable-setup",
        "build-and-test",
        "publishing-preparation",
        "publishing-to-npm",
        "npm-organizations-guide"
      ] as const).describe("The name of the guide to retrieve")
    }),
    execute: async (args) => {
      // Add type assertion to fix the indexing error
      const resourceInfo = RESOURCES[args.guide as keyof typeof RESOURCES];
      return readMarkdownResource(resourceInfo.filename);
    },
  });

  // Add an index tool
  server.addTool({
    name: "list_guides",
    description: "List all available guides",
    parameters: z.object({}),
    execute: async () => {
      const guideList = Object.entries(RESOURCES)
        .map(([name, info]) => `- **${info.title}**: ts-pkg-distro://${name}`)
        .join("\n");
        
      return `# TypeScript Package Distribution Guides\n\nThe following guides are available in sequence:\n\n${guideList}\n\nUse the \`get_guide\` tool with the guide parameter to access a specific guide.`;
    },
  });

  // Add a next guide tool
  server.addTool({
    name: "get_next_guide",
    description: "Get the next guide in sequence after the current one",
    parameters: z.object({
      current_guide: z.enum([
        "orchestrator",
        "project-assessment",
        "initial-setup",
        "typescript-configuration",
        "package-configuration",
        "executable-setup",
        "build-and-test",
        "publishing-preparation",
        "publishing-to-npm"
      ] as const).describe("The name of the current guide")
    }),
    execute: async (args) => {
      // Define the guide sequence
      const guideSequence = [
        "orchestrator",
        "project-assessment",
        "initial-setup",
        "typescript-configuration",
        "package-configuration",
        "executable-setup",
        "build-and-test",
        "publishing-preparation",
        "publishing-to-npm",
        "npm-organizations-guide"
      ];
      
      // Find the current guide index
      const currentIndex = guideSequence.indexOf(args.current_guide);
      if (currentIndex === -1 || currentIndex === guideSequence.length - 1) {
        return "No next guide available. You've reached the end of the sequence.";
      }
      
      // Get the next guide
      const nextGuideName = guideSequence[currentIndex + 1];
      // Add type assertion to fix the indexing error
      const nextGuide = RESOURCES[nextGuideName as keyof typeof RESOURCES];
      
      return `# Next Guide: ${nextGuide.title}\n\nAccess at: ts-pkg-distro://${nextGuideName}\n\n${readMarkdownResource(nextGuide.filename)}`;
    },
  });

  // Start the server with transport configuration from the config file
  server.start({
    transportType: config.transport?.type || "stdio",
    ...config.transport?.options,
  });

  console.log("TypePack Distro MCP server running...");
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}