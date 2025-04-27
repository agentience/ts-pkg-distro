#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { createServer, startServer, ServerConfig } from './index';

/**
 * Configuration interface
 */
interface PackageConfig {
  server?: {
    name?: string;
  };
  transport?: {
    type?: string;
    options?: any;
  };
  'npm-org'?: string; // Optional organization namespace for npm publishing
  verbose?: boolean; // Enable verbose logging
}

/**
 * Environment variable prefix for configuration
 */
const ENV_PREFIX = 'TS_PKG_DISTRO_';

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
      // Use console.error for important logs to ensure they're visible in npx
      console.error(`Loaded configuration from ${filePath}`);
      
      if (config.server) {
        console.error(`Using server configuration: ${JSON.stringify(config.server)}`);
      }
      
      if (config['npm-org']) {
        console.error(`Using npm organization: ${config['npm-org']}`);
      }
      
      if (config.verbose) {
        console.error('Verbose logging enabled');
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
 * Parse command line arguments
 */
function parseCommandLineArgs() {
  const args = process.argv.slice(2);
  const parsedArgs: Record<string, string> = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    // Handle --key=value format
    if (arg.startsWith('--') && arg.includes('=')) {
      const [key, value] = arg.substring(2).split('=', 2);
      parsedArgs[key] = value;
    }
    // Handle --key value format
    else if (arg.startsWith('--') && i + 1 < args.length && !args[i + 1].startsWith('--')) {
      const key = arg.substring(2);
      parsedArgs[key] = args[i + 1];
      i++; // Skip the next argument as it's the value
    }
    // Handle --flag format (boolean flags)
    else if (arg.startsWith('--')) {
      const key = arg.substring(2);
      parsedArgs[key] = 'true';
    }
  }
  
  return parsedArgs;
}

/**
 * Get configuration from environment variables
 */
function getEnvConfig() {
  const envConfig: Record<string, any> = {};
  
  // Process environment variables with the prefix
  Object.keys(process.env).forEach(key => {
    if (key.startsWith(ENV_PREFIX)) {
      // Convert environment variable name to config key
      // e.g., TS_PKG_DISTRO_SERVER_NAME -> server.name
      const configKey = key.substring(ENV_PREFIX.length)
                           .toLowerCase();
      
      // Handle nested properties
      if (configKey.includes('_')) {
        const parts = configKey.split('_');
        const section = parts[0];
        const property = parts.slice(1).join('_');
        
        if (!envConfig[section]) {
          envConfig[section] = {};
        }
        
        envConfig[section][property] = process.env[key];
      } else {
        envConfig[configKey] = process.env[key];
      }
    }
  });
  
  return envConfig;
}

/**
 * Apply command line arguments to configuration
 */
function applyCommandLineArgs(config: PackageConfig, args: Record<string, string>) {
  // Server configuration
  if (args['server-name']) {
    if (!config.server) config.server = {};
    config.server.name = args['server-name'];
  }
  
  // Transport configuration
  if (args['transport-type']) {
    if (!config.transport) config.transport = {};
    config.transport.type = args['transport-type'];
  }
  
  // Transport options (port, host)
  if (args['transport-port']) {
    if (!config.transport) config.transport = {};
    if (!config.transport.options) config.transport.options = {};
    config.transport.options.port = parseInt(args['transport-port'], 10);
  }
  
  if (args['transport-host']) {
    if (!config.transport) config.transport = {};
    if (!config.transport.options) config.transport.options = {};
    config.transport.options.host = args['transport-host'];
  }
  
  // npm organization
  if (args['npm-org']) {
    config['npm-org'] = args['npm-org'];
  }
  
  // Verbose logging
  if (args['verbose'] === 'true') {
    config.verbose = true;
  }
  
  return config;
}

/**
 * Apply environment variables to configuration
 */
function applyEnvConfig(config: PackageConfig, envConfig: Record<string, any>) {
  // Apply server configuration
  if (envConfig.server) {
    if (!config.server) config.server = {};
    if (envConfig.server.name) config.server.name = envConfig.server.name;
  }
  
  // Apply transport configuration
  if (envConfig.transport) {
    if (!config.transport) config.transport = {};
    if (envConfig.transport.type) config.transport.type = envConfig.transport.type;
    
    // Apply transport options
    if (envConfig.transport.options) {
      if (!config.transport.options) config.transport.options = {};
      Object.assign(config.transport.options, envConfig.transport.options);
    }
  }
  
  // Apply npm organization
  if (envConfig.npm_org) {
    config['npm-org'] = envConfig.npm_org;
  }
  
  // Apply verbose setting
  if (envConfig.verbose === 'true') {
    config.verbose = true;
  }
  
  return config;
}

/**
 * Main CLI function
 */
function main() {
  const args = process.argv.slice(2);
  let configPath: string | undefined;
  let verbose = false;
  
  // Parse command line arguments
  const parsedArgs = parseCommandLineArgs();
  
  // Get environment configuration
  const envConfig = getEnvConfig();
  
  // Check for --config flag
  if (parsedArgs.config) {
    configPath = parsedArgs.config;
  }
  
  // Check for --verbose flag or environment variable
  if (parsedArgs.verbose === 'true' || process.env.TS_PKG_DISTRO_VERBOSE === 'true') {
    verbose = true;
    // Set environment variable for child processes
    process.env.TS_PKG_DISTRO_VERBOSE = 'true';
    // Set FastMCP log level for better visibility
    process.env.FASTMCP_LOG_LEVEL = 'DEBUG';
  }
  
  // Load configuration from file
  let config = loadConfig(configPath);
  
  // Apply environment variables to configuration
  config = applyEnvConfig(config, envConfig);
  
  // Apply command line arguments to configuration (highest priority)
  config = applyCommandLineArgs(config, parsedArgs);
  
  // Override verbose setting if specified in command line or environment
  if (verbose) {
    config.verbose = true;
  }
  
  // Create server configuration object
  const serverConfig: ServerConfig = {
    name: config.server?.name,
    transportType: config.transport?.type || "stdio",
    transportOptions: config.transport?.options,
  };

  // Start the server with the configuration
  const serverInstance = startServer(serverConfig);
  
  // If verbose is enabled, log additional information
  if (config.verbose) {
    // Use console.error for important logs to ensure they're visible in npx
    console.error(`Server started with name: ${(serverInstance as any)._serverName}`);
    console.error(`Server version: ${(serverInstance as any)._serverVersion}`);
    console.error(`Transport type: ${config.transport?.type || "stdio"}`);
    if (config['npm-org']) {
      console.error(`npm organization: ${config['npm-org']}`);
    }
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}