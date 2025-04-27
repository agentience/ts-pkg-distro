import { FastMCP } from "fastmcp";
import { z } from "zod";
import { RESOURCES, readMarkdownResource, registerResourceHandlers } from "./resources";

// Create the FastMCP server with name and version
export const server = new FastMCP({
  name: "TS-PKG-Distro",
  version: "1.0.2",
});

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

// Export a function to start the server
export function startServer(options?: any) {
  server.start({
    transportType: "stdio",
    ...options
  });
  
  console.log("TS-PKG-Distro MCP server running...");
}

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

// Export the server and startServer function for use in app.ts
