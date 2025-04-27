#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { server, startServer } from './index';

/**
 * Configuration interface
 */
interface PackageConfig {
  server?: {
    name?: string;
    version?: string;
  };
  transport?: {
    type?: string;
    options?: any;
  };
  'npm-org'?: string; // Optional organization namespace for npm publishing
}

/**
 * Load configuration from a JSON file if it exists
 */
function loadConfig(configPath?: string): PackageConfig {
  // Default config path is mcp-config.json in the current directory
  const filePath = configPath || path.join(process.cwd(), 'mcp-config.json');
  
  if (fs.existsSync(filePath)) {
    try {
      const configData = fs.readFileSync(filePath, 'utf8');
      const config = JSON.parse(configData) as PackageConfig;
      console.log(`Loaded configuration from ${filePath}`);
      
      if (config.server) {
        console.log(`Using server configuration: ${JSON.stringify(config.server)}`);
      }
      
      if (config['npm-org']) {
        console.log(`Using npm organization: ${config['npm-org']}`);
      }
      
      return config;
    } catch (error) {
      console.error(`Error loading configuration from ${filePath}:`, error);
    }
  } else {
    console.log(`No configuration file found at ${filePath}, using defaults`);
  }
  
  return {};
}

/**
 * Main CLI function
 */
function main() {
  const args = process.argv.slice(2);
  let configPath: string | undefined;
  
  // Check for --config flag
  const configIndex = args.indexOf('--config');
  if (configIndex !== -1 && args.length > configIndex + 1) {
    configPath = args[configIndex + 1];
  }
  
  // Load configuration
  const config = loadConfig(configPath);
  
  // Start the server with transport configuration from the config file
  startServer({
    transportType: config.transport?.type || "stdio",
    ...config.transport?.options,
  });
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}