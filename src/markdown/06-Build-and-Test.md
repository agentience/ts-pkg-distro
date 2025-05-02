# TypeScript Package Setup - Build and Test

This step will build your TypeScript package and test it locally to ensure it works correctly before publishing.

## Prerequisites

- Node.js and npm installed
- Basic project structure set up (see Initial Setup step)
- TypeScript configured (see TypeScript Configuration step)
- Package configured (see Package Configuration step)
- Executable setup completed (optional, see Executable Setup step)

## Build and Test Script

```bash
#!/bin/bash

# Load assessment results if they exist
if [ -f ts_package_assessment.txt ]; then
  echo "Loading assessment results..."
else
  echo "⚠️ No assessment results found. Run the Project Assessment step first."
  exit 1
fi

# Check if TypeScript is installed
if [ ! -d node_modules/typescript ]; then
  echo "❌ TypeScript is not installed. Installing..."
  npm install --save-dev typescript @types/node
  echo "✅ TypeScript installed"
fi

# Check if package.json exists
if [ ! -f package.json ]; then
  echo "❌ package.json doesn't exist. Run the Package Configuration step first."
  exit 1
fi

# Check if tsconfig.json exists
if [ ! -f tsconfig.json ]; then
  echo "❌ tsconfig.json doesn't exist. Run the TypeScript Configuration step first."
  exit 1
fi

# Get the output directory from tsconfig.json, defaulting to "dist" if not found
OUT_DIR=$(grep -m 1 '"outDir":' tsconfig.json | sed 's/.*"outDir": *"\(.*\)".*/\1/' | sed 's/\.\///')
if [ -z "$OUT_DIR" ]; then
  OUT_DIR="dist"
fi

# Check if build script exists
if ! grep -q "\"build\":" package.json; then
  echo "❌ build script doesn't exist in package.json. Run the Package Configuration step first."
  exit 1
fi

# Check for source files
if [ ! -f src/index.ts ]; then
  echo "❌ No source files found. Create src/index.ts first."
  exit 1
fi

# Clean the output directory if it exists
if [ -d "$OUT_DIR" ]; then
  echo "Cleaning $OUT_DIR directory..."
  rm -rf "$OUT_DIR"
  echo "✅ $OUT_DIR directory cleaned"
fi

# Build the package
echo "🔨 Building your package..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Fix the errors and try again."
  exit 1
fi

# Check if the output directory exists after building
if [ ! -d "$OUT_DIR" ]; then
  echo "❌ Build didn't create $OUT_DIR directory. Check your tsconfig.json and build script."
  exit 1
fi

# Check if the JavaScript files were generated
if [ ! -f "$OUT_DIR/index.js" ]; then
  echo "❌ Build didn't generate JavaScript files. Check your TypeScript configuration."
  exit 1
fi

# Check if declaration files were generated
if [ ! -f "$OUT_DIR/index.d.ts" ]; then
  echo "❌ Build didn't generate declaration files. Make sure 'declaration: true' is set in tsconfig.json."
  exit 1
fi

echo "✅ Build completed successfully"

# Get package name
PACKAGE_NAME=$(grep -m 1 '"name":' package.json | cut -d '"' -f 4)

# Link the package locally
echo "🔗 Linking your package locally for testing..."
npm link

if [ $? -ne 0 ]; then
  echo "❌ Failed to link package. You might need to run this command with sudo."
  echo "Try: sudo npm link"
else
  echo "✅ Package linked locally"
  echo "You can now use it in other projects with: npm link $PACKAGE_NAME"
fi

# Check if the package is executable
if grep -q "bin_field=true" ts_package_assessment.txt || grep -q "\"bin\":" package.json; then
  # Get the command name
  COMMAND_NAME=$(grep -A 2 '"bin":' package.json | grep -o '"[^"]*": "' | head -1 | cut -d'"' -f2)
  
  if [ -n "$COMMAND_NAME" ]; then
    echo "📦 Testing executable package..."
    
    # Check if app.js is executable
    if [ -f "$OUT_DIR/app.js" ]; then
      if [ ! -x "$OUT_DIR/app.js" ]; then
        echo "Making $OUT_DIR/app.js executable..."
        chmod +x "$OUT_DIR/app.js"
      fi
      
      echo "You can test your CLI with: npx $COMMAND_NAME [arguments]"
      
      # Try running the CLI
      read -p "Do you want to test the CLI now? (y/N) " test_cli
      if [[ $test_cli == [Yy]* ]]; then
        echo "Running: npx $COMMAND_NAME"
        npx $COMMAND_NAME
      fi
    else
      echo "❌ $OUT_DIR/app.js doesn't exist. Make sure your CLI entry point compiles correctly."
    fi
  fi
fi

# Create a test directory for testing the package as a dependency
echo "🧪 Setting up test environment..."
TEST_DIR="$(pwd)/../test-${PACKAGE_NAME}"

read -p "Do you want to create a test project to test your package? (Y/n) " create_test
if [[ $create_test != [Nn]* ]]; then
  mkdir -p "$TEST_DIR"
  cd "$TEST_DIR"
  
  # Initialize a new test project
  echo "Initializing test project..."
  npm init -y > /dev/null
  
  # Check if the package is TypeScript
  read -p "Do you want to test with TypeScript? (Y/n) " use_typescript
  if [[ $use_typescript != [Nn]* ]]; then
    # Install TypeScript in the test project
    npm install --save-dev typescript @types/node > /dev/null
    
    # Create a basic tsconfig.json
    cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  }
}
EOL
    
    # Link the package
    npm link "$PACKAGE_NAME"
    
    # Create a test file
    cat > index.ts << EOL
import { greet } from '$PACKAGE_NAME';

console.log(greet('test user'));
EOL
    
    # Add a build script
    sed -i 's/"test": "echo \\"Error: no test specified\\" && exit 1"/"build": "tsc", "test": "node dist\/index.js"/g' package.json
    
    # Build and run the test
    echo "Building and running test..."
    npm run build
    npm test
  else
    # Link the package
    npm link "$PACKAGE_NAME"
    
    # Create a test file
    cat > index.js << EOL
const myPackage = require('$PACKAGE_NAME');

console.log(myPackage.greet('test user'));
EOL
    
    # Add a test script
    sed -i 's/"test": "echo \\"Error: no test specified\\" && exit 1"/"test": "node index.js"/g' package.json
    
    # Run the test
    echo "Running test..."
    npm test
  fi
  
  echo "✅ Test completed"
  echo "Test project created at $TEST_DIR"
  
  # Return to the original directory
  cd -
fi

echo ""
echo "Build and test completed!"
echo "Your package is built and ready for testing."
echo "Next step: Publishing Preparation"
```

## What This Script Does

1. **Builds the Package**: Runs the build script to compile TypeScript to JavaScript
2. **Verifies the Build**: Checks if the output files were generated correctly
3. **Links the Package Locally**: Makes the package available locally for testing
4. **Tests Executable Functionality** (if applicable): Verifies that the CLI works
5. **Creates a Test Project**: Sets up a separate project to test the package as a dependency

## Manual Build and Test (if needed)

If you prefer to build and test manually:

1. **Build the package**:
   ```bash
   npm run build
   ```

2. **Link the package locally**:
   ```bash
   npm link
   ```

3. **Create a test project**:
   ```bash
   mkdir ../test-project
   cd ../test-project
   npm init -y
   npm link your-package-name
   ```

4. **Create a test file**:
   ```javascript
   // index.js
   const myPackage = require('your-package-name');
   console.log(myPackage.greet('test user'));
   ```

5. **Run the test**:
   ```bash
   node index.js
   ```

6. **Test executable functionality** (if applicable):
   ```bash
   npx your-command-name
   ```

## Troubleshooting

- **Build failed**: Check your TypeScript code for errors and fix them
- **No declaration files**: Make sure `declaration: true` is set in tsconfig.json
- **Package not found**: Make sure the package is properly linked with `npm link`
- **CLI not working**: Make sure the CLI file is properly set up and executable

## Next Steps

After completing the Build and Test, proceed to:

1. **Publishing Preparation** - To prepare your package for publishing to npm