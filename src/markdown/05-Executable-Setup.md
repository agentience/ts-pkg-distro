# TypeScript Package Setup - Executable Setup (Optional)

This optional step will configure your TypeScript package to be executable with `npx`. This is useful if your package provides a command-line interface (CLI).

## Prerequisites

- Node.js and npm installed
- Basic project structure set up (see Initial Setup step)
- TypeScript configured (see TypeScript Configuration step)
- Package configured (see Package Configuration step)

## Executable Setup Script

```bash
#!/bin/bash

# Load assessment results if they exist
if [ -f ts_package_assessment.txt ]; then
  echo "Loading assessment results..."
else
  echo "⚠️ No assessment results found. Run the Project Assessment step first."
  exit 1
fi

# Check if already executable
if grep -q "bin_field=true" ts_package_assessment.txt; then
  echo "✅ Package is already configured as executable."
  echo "If you want to run this step anyway, set FORCE_EXECUTABLE=true"
  
  # Check if the FORCE_EXECUTABLE flag is set
  if [ "${FORCE_EXECUTABLE}" = "true" ]; then
    echo "FORCE_EXECUTABLE is true, proceeding with executable setup..."
  else
    echo "Exiting Executable Setup. Set FORCE_EXECUTABLE=true to force setup."
    exit 0
  fi
fi

# Get package name to use as the default command name
PACKAGE_NAME=$(grep -m 1 '"name":' package.json | cut -d '"' -f 4)
# Remove scope if present (e.g., @scope/name -> name)
COMMAND_NAME=$(echo "$PACKAGE_NAME" | sed 's/^@[^/]*\///')

# Ask for command name
read -p "Enter the command name for your CLI (default: $COMMAND_NAME): " custom_command
if [ -n "$custom_command" ]; then
  COMMAND_NAME="$custom_command"
fi

echo "Setting up executable package with command name: $COMMAND_NAME"

# Get the output directory from tsconfig.json, defaulting to "dist" if not found
OUT_DIR=$(grep -m 1 '"outDir":' tsconfig.json | sed 's/.*"outDir": *"\(.*\)".*/\1/' | sed 's/\.\///')
if [ -z "$OUT_DIR" ]; then
  OUT_DIR="dist"
fi

# Check if a CLI file already exists
if [ -f src/app.ts ]; then
  echo "✅ CLI entry point src/app.ts already exists"
  read -p "Do you want to replace the existing CLI file? (y/N) " replace_cli
  if [[ $replace_cli == [Yy]* ]]; then
    # Create the CLI file
    cat > src/app.ts << EOL
#!/usr/bin/env node

import { greet } from './index';

/**
 * Main CLI function
 */
function main() {
  const args = process.argv.slice(2);
  const name = args[0] || 'User';
  console.log(greet(name));
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}
EOL
    echo "✅ Updated CLI entry point at src/app.ts"
  fi
else
  # Create the CLI file
  echo "Creating CLI entry point at src/app.ts..."
  cat > src/app.ts << EOL
#!/usr/bin/env node

import { greet } from './index';

/**
 * Main CLI function
 */
function main() {
  const args = process.argv.slice(2);
  const name = args[0] || 'User';
  console.log(greet(name));
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}
EOL
  echo "✅ Created CLI entry point at src/app.ts"
fi

# Check if tsconfig.json includes all src files
if ! grep -q "\"src/\*\*/\*\"" tsconfig.json && ! grep -q "\"src/\*\.\*\"" tsconfig.json; then
  echo "⚠️ Updating tsconfig.json to include all src files..."
  # Check if include field exists
  if grep -q "\"include\":" tsconfig.json; then
    # Check if src is in the include array
    if ! grep -q "\"src" tsconfig.json; then
      # Add src to include array
      sed -i 's/"include": \[/"include": \["src\/\*\*\/\*",/g' tsconfig.json
    fi
  else
    # Add include field
    sed -i '/"compilerOptions": {/a \  "include": ["src/**/*"],\n  "exclude": ["node_modules", "**/*.test.ts", "dist"]' tsconfig.json
  fi
  echo "✅ Updated tsconfig.json to include all src files"
else
  echo "✅ tsconfig.json already includes src files"
fi

# Add bin field to package.json
echo "Updating package.json with bin field..."
# Check if bin field exists
if grep -q "\"bin\":" package.json; then
  # Update existing bin field
  sed -i -E "s/\"bin\": \{[^}]*\}/\"bin\": {\n    \"$COMMAND_NAME\": \".\/dist\/app.js\"\n  }/g" package.json
else
  # Add new bin field after main
  sed -i "/\"main\":/a \  \"bin\": {\n    \"$COMMAND_NAME\": \".\/dist\/app.js\"\n  }," package.json
fi

# Update prepare script to make the CLI file executable
if grep -q "\"prepare\":" package.json; then
  # Check if chmod command is already in prepare script
  if ! grep -q "chmod +x" package.json; then
    # Replace prepare script
    sed -i "s/\"prepare\": \"[^\"]*\"/\"prepare\": \"npm run build \&\& chmod +x .\/dist\/app.js\"/g" package.json
  fi
else
  # Add prepare script
  sed -i "/\"scripts\":/a \    \"prepare\": \"npm run build \&\& chmod +x .\/dist\/app.js\"," package.json
fi

echo "✅ Updated package.json with bin field and prepare script"

# Update the assessment results
if [ -f ts_package_assessment.txt ]; then
  # Update bin field status
  sed -i 's/bin_field=false/bin_field=true/g' ts_package_assessment.txt
  echo "✅ Assessment results updated"
fi

echo ""
echo "Executable setup complete!"
echo "Your package can now be run with 'npx $COMMAND_NAME'"
echo "After publishing, users can install it globally with 'npm install -g $PACKAGE_NAME'"
echo "Next step: Build and Test"
```

## What This Script Does

1. **Creates a CLI Entry Point**: Creates a file at `src/app.ts` with a shebang line (`#!/usr/bin/env node`) and basic CLI functionality
2. **Updates tsconfig.json**: Ensures it includes all source files
3. **Updates package.json**: Adds a `bin` field that maps the command name to the compiled CLI file
4. **Updates prepare script**: Adds a command to make the CLI file executable (`chmod +x`)

## Manual Setup (if needed)

If you prefer to set up your executable package manually:

1. Create a CLI file at `src/app.ts` with a shebang line and your CLI functionality
2. Make sure your `tsconfig.json` includes the CLI file in its compilation
3. Add a `bin` field to your `package.json`:
   ```json
   "bin": {
     "your-command-name": "./dist/app.js"
   }
   ```
4. Update the prepare script to make the CLI file executable:
   ```json
   "prepare": "npm run build && chmod +x ./dist/app.js"
   ```

## Example CLI Implementation

For a more advanced CLI implementation, you might want to use a library like `commander` or `yargs`:

```bash
# Install a CLI library
npm install commander
npm install --save-dev @types/node
```

Then update your `src/app.ts`:

```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import { greet } from './index';

const program = new Command();

program
  .name('your-command-name')
  .description('CLI for your package')
  .version('1.0.0');

program
  .argument('[name]', 'Name to greet', 'User')
  .action((name) => {
    console.log(greet(name));
  });

program.parse();
```

## Next Steps

After completing the Executable Setup, proceed to:

1. **Build and Test** - To build your package and test its executable functionality