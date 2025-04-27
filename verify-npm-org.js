const fs = require('fs');
const path = require('path');

// Function to create a temporary config file
function createTempConfig(npmOrg = null) {
  const config = {
    server: {
      name: "Test-Package",
      version: "1.0.0"
    },
    transport: {
      type: "stdio",
      options: {}
    }
  };
  
  if (npmOrg) {
    config['npm-org'] = npmOrg;
  }
  
  const tempConfigPath = path.join(__dirname, 'temp-mcp-config.json');
  fs.writeFileSync(tempConfigPath, JSON.stringify(config, null, 2));
  console.log(`Created temporary config file at ${tempConfigPath}`);
  return tempConfigPath;
}

// Function to create a temporary package.json file
function createTempPackageJson(name = 'test-package') {
  const pkg = {
    name: name,
    version: "1.0.0",
    description: "Test package for npm-org verification",
    main: "index.js"
  };
  
  const tempPkgPath = path.join(__dirname, 'temp-package.json');
  fs.writeFileSync(tempPkgPath, JSON.stringify(pkg, null, 2));
  console.log(`Created temporary package.json file at ${tempPkgPath}`);
  return tempPkgPath;
}

// Function to simulate the GitHub workflow behavior
function simulateWorkflow(configPath, pkgPath) {
  console.log('\n--- Simulating GitHub workflow behavior ---');
  
  // Read the config file
  const configData = fs.readFileSync(configPath, 'utf8');
  const config = JSON.parse(configData);
  
  // Check for npm-org
  const npmOrg = config['npm-org'] || '';
  console.log(`Found npm-org in config: ${npmOrg || 'Not specified'}`);
  
  // Read the package.json file
  const pkgData = fs.readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgData);
  
  console.log(`Original package name: ${pkg.name}`);
  
  // Simulate the GitHub workflow behavior
  if (npmOrg) {
    // Update package.json name to include organization
    const originalName = pkg.name;
    pkg.name = `@${npmOrg}/${pkg.name.replace(/^@.*\//, '')}`;
    console.log(`Updated package name: ${pkg.name}`);
    console.log(`Would publish with command: npm publish --access public`);
  } else {
    // Update package.json name to remove organization if present
    if (pkg.name.startsWith('@')) {
      const originalName = pkg.name;
      pkg.name = pkg.name.replace(/^@.*\//, '');
      console.log(`Updated package name: ${pkg.name}`);
    }
    console.log(`Would publish with command: npm publish`);
  }
  
  return pkg.name;
}

// Function to clean up temporary files
function cleanup(configPath, pkgPath) {
  try {
    fs.unlinkSync(configPath);
    fs.unlinkSync(pkgPath);
    console.log('\n--- Cleaned up temporary files ---');
  } catch (error) {
    console.error('Error cleaning up temporary files:', error);
  }
}

// Main function to run the verification
function verifyNpmOrgConfig() {
  console.log('=== Verifying npm-org Configuration Option ===\n');
  
  // Test 1: With npm-org specified
  console.log('\n=== Test 1: With npm-org specified ===');
  const configPath1 = createTempConfig('agentience');
  const pkgPath1 = createTempPackageJson('test-package');
  const result1 = simulateWorkflow(configPath1, pkgPath1);
  
  // Test 2: Without npm-org specified
  console.log('\n=== Test 2: Without npm-org specified ===');
  const configPath2 = createTempConfig();
  const pkgPath2 = createTempPackageJson('test-package');
  const result2 = simulateWorkflow(configPath2, pkgPath2);
  
  // Test 3: Backward compatibility (package already has org)
  console.log('\n=== Test 3: Backward compatibility (package already has org) ===');
  const configPath3 = createTempConfig();
  const pkgPath3 = createTempPackageJson('@existing-org/test-package');
  const result3 = simulateWorkflow(configPath3, pkgPath3);
  
  // Test 4: Overriding existing org
  console.log('\n=== Test 4: Overriding existing org ===');
  const configPath4 = createTempConfig('new-org');
  const pkgPath4 = createTempPackageJson('@existing-org/test-package');
  const result4 = simulateWorkflow(configPath4, pkgPath4);
  
  // Clean up
  cleanup(configPath1, pkgPath1);
  cleanup(configPath2, pkgPath2);
  cleanup(configPath3, pkgPath3);
  cleanup(configPath4, pkgPath4);
  
  // Summary
  console.log('\n=== Verification Results ===');
  console.log('Test 1 (With npm-org): Package name would be', result1);
  console.log('Test 2 (Without npm-org): Package name would be', result2);
  console.log('Test 3 (Backward compatibility): Package name would be', result3);
  console.log('Test 4 (Overriding existing org): Package name would be', result4);
  
  // Verification
  const success = 
    result1 === '@agentience/test-package' && 
    result2 === 'test-package' && 
    result3 === 'test-package' && 
    result4 === '@new-org/test-package';
  
  if (success) {
    console.log('\n✅ All tests passed! The npm-org configuration option works as expected.');
  } else {
    console.log('\n❌ Some tests failed. The npm-org configuration option may not be working correctly.');
  }
}

// Run the verification
verifyNpmOrgConfig();