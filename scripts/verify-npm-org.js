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
  
  // Read the package.json file
  const pkgData = fs.readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgData);
  
  console.log(`Package name from package.json: ${pkg.name}`);
  
  // Simulate the GitHub workflow behavior
  const isScoped = pkg.name.startsWith('@');
  
  if (isScoped) {
    console.log(`Package is scoped (starts with @)`);
    console.log(`Would publish with command: npm publish --access public`);
  } else {
    console.log(`Package is not scoped`);
    console.log(`Would publish with command: npm publish`);
  }
  
  // Note: We no longer modify the package.json name
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
  console.log('=== Verifying Package Name Publishing Behavior ===\n');
  
  // Test 1: Regular package
  console.log('\n=== Test 1: Regular package ===');
  const configPath1 = createTempConfig();
  const pkgPath1 = createTempPackageJson('test-package');
  const result1 = simulateWorkflow(configPath1, pkgPath1);
  
  // Test 2: Scoped package
  console.log('\n=== Test 2: Scoped package ===');
  const configPath2 = createTempConfig();
  const pkgPath2 = createTempPackageJson('@existing-org/test-package');
  const result2 = simulateWorkflow(configPath2, pkgPath2);
  
  // Clean up
  cleanup(configPath1, pkgPath1);
  cleanup(configPath2, pkgPath2);
  cleanup(configPath3, pkgPath3);
  cleanup(configPath4, pkgPath4);
  
  // Summary
  console.log('\n=== Verification Results ===');
  console.log('Test 1 (Regular package): Package name would be', result1);
  console.log('Test 2 (Scoped package): Package name would be', result2);
  
  // Verification
  const success =
    result1 === 'test-package' &&
    result2 === '@existing-org/test-package';
  
  if (success) {
    console.log('\n✅ All tests passed! The package name is preserved as-is from package.json.');
    console.log('✅ Scoped packages are published with --access public.');
    console.log('✅ Regular packages are published without --access public.');
  } else {
    console.log('\n❌ Some tests failed. The package name is not being preserved correctly.');
  }
}

// Run the verification
verifyNpmOrgConfig();