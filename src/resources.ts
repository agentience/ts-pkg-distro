import { FastMCP } from "fastmcp";
import * as fs from "fs";
import * as path from "path";

// Base resources information - mapped to filenames with numbers but resources are clean named
export const RESOURCES = {
  orchestrator: {
    filename: "00-Orchestrator.md",
    title: "Setting Up a TypeScript Package for Distribution",
    description: "Main guide with overview of the entire process"
  },
  "project-assessment": {
    filename: "01-Project-Assessment.md",
    title: "TypeScript Package Setup - Project Assessment",
    description: "Assess your current project structure"
  },
  "initial-setup": {
    filename: "02-Initial-Setup.md",
    title: "TypeScript Package Setup - Initial Setup",
    description: "Initial setup for a TypeScript package"
  },
  "typescript-configuration": {
    filename: "03-TypeScript-Configuration.md",
    title: "TypeScript Package Setup - TypeScript Configuration",
    description: "Configure TypeScript for package distribution"
  },
  "package-configuration": {
    filename: "04-Package-Configuration.md",
    title: "TypeScript Package Setup - Package Configuration",
    description: "Package.json configuration for distribution"
  },
  "executable-setup": {
    filename: "05-Executable-Setup.md",
    title: "TypeScript Package Setup - Executable Setup",
    description: "Make your package executable with npx"
  },
  "build-and-test": {
    filename: "06-Build-and-Test.md",
    title: "TypeScript Package Setup - Build and Test",
    description: "Build and test your TypeScript package"
  },
  "publishing-preparation": {
    filename: "07-Publishing-Preparation.md",
    title: "TypeScript Package Setup - Publishing Preparation",
    description: "Prepare your package for publishing"
  },
  "publishing-to-npm": {
    filename: "08-Publishing-to-npm.md",
    title: "TypeScript Package Setup - Publishing to npm",
    description: "Publish your package to npm registry"
  },
  "npm-organizations-guide": {
    filename: "09-npm-Organizations-Guide.md",
    title: "Comprehensive Guide to npm Organizations (Scopes)",
    description: "Learn how to use npm organizations and scopes effectively"
  }
};

/**
 * Function to read markdown content
 */
export function readMarkdownResource(resourceName: string): string {
  try {
    const filePath = path.join(__dirname, "markdown", resourceName);
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`Error reading markdown resource: ${resourceName}`, error);
    return `# Error\n\nUnable to load ${resourceName} resource.`;
  }
}

/**
 * Register all resource URI handlers for the MCP server
 */
export function registerResourceHandlers(server: FastMCP): void {
  // Register each resource
  Object.entries(RESOURCES).forEach(([name, info]) => {
    server.addResource({
      uri: `ts-pkg-distro://resource/${name}`,
      name: info.title,
      mimeType: "text/markdown",
      async load() {
        return {
          text: readMarkdownResource(info.filename)
        };
      }
    });
  });

  // Register the orchestrator as root resource
  server.addResource({
    uri: `ts-pkg-distro://`,
    name: RESOURCES.orchestrator.title,
    mimeType: "text/markdown",
    async load() {
      return {
        text: readMarkdownResource(RESOURCES.orchestrator.filename)
      };
    }
  });

  // Register an index resource
  server.addResource({
    uri: `ts-pkg-distro://resource/index`,
    name: "TypeScript Package Distribution Guides Index",
    mimeType: "text/markdown",
    async load() {
      const resourceList = Object.entries(RESOURCES)
        .map(([name, info]) => `- **[${info.title}](ts-pkg-distro://resource/${name})**: ${info.description}`)
        .join("\n");
        
      return {
        text: `# TypeScript Package Distribution Guides\n\nThe following guides are available in sequence:\n\n${resourceList}`
      };
    }
  });
}
