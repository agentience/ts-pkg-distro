# TypeScript Package Setup - TypeScript Configuration

This step will configure TypeScript for package distribution. A properly configured TypeScript setup is essential for generating declaration files (`.d.ts`) and ensuring your package can be consumed by TypeScript users.

## Prerequisites

- Node.js and npm installed
- Basic project structure set up (see Initial Setup step)

## TypeScript Configuration Script

```bash
#!/bin/bash

# Load assessment results if they exist
if [ -f ts_package_assessment.txt ]; then
  echo "Loading assessment results..."
else
  echo "⚠️ No assessment results found. Run the Project Assessment step first."
  exit 1
fi

NEEDS_TSCONFIG=false

# Check if tsconfig.json exists
if grep -q "tsconfig_json=false" ts_package_assessment.txt; then
  echo "❌ tsconfig.json doesn't exist, configuration needed"
  NEEDS_TSCONFIG=true
fi

# Check if declaration is enabled
if grep -q "declaration_true=false" ts_package_assessment.txt; then
  echo "❌ declaration:true is not set in tsconfig.json, configuration needed"
  NEEDS_TSCONFIG=true
fi

# Check if outDir is configured
if grep -q "outdir_configured=false" ts_package_assessment.txt; then
  echo "❌ outDir is not configured in tsconfig.json, configuration needed"
  NEEDS_TSCONFIG=true
fi

if [ "$NEEDS_TSCONFIG" = false ]; then
  echo "✅ TypeScript is already properly configured. You can skip this step."
  echo "If you want to run it anyway, set FORCE_TSCONFIG=true"
  
  # Check if the FORCE_TSCONFIG flag is set
  if [ "${FORCE_TSCONFIG}" = "true" ]; then
    echo "FORCE_TSCONFIG is true, proceeding with configuration..."
  else
    echo "Exiting TypeScript Configuration. Set FORCE_TSCONFIG=true to force configuration."
    exit 0
  fi
fi

# Check if tsconfig.json exists
if [ -f tsconfig.json ]; then
  echo "tsconfig.json already exists. Creating backup at tsconfig.json.bak"
  cp tsconfig.json tsconfig.json.bak
  
  # Prompt for replacement
  read -p "Do you want to replace the existing tsconfig.json with recommended settings? (y/N) " replace_tsconfig
  if [[ $replace_tsconfig != [Yy]* ]]; then
    echo "Keeping existing tsconfig.json. Please ensure it has the following settings:"
    echo "- \"declaration\": true - Generates .d.ts files for TypeScript consumers"
    echo "- \"outDir\": \"./dist\" - Puts compiled files in a separate directory"
    echo "- Appropriate \"target\" and \"module\" settings for your package's needs"
    
    # Check if we need to update declaration setting
    if grep -q "declaration_true=false" ts_package_assessment.txt; then
      read -p "Add \"declaration\": true to your tsconfig.json? (Y/n) " add_declaration
      if [[ $add_declaration != [Nn]* ]]; then
        # Add declaration: true if not present
        if grep -q "\"declaration\":" tsconfig.json; then
          sed -i 's/"declaration": *false/"declaration": true/g' tsconfig.json
        else
          # Find compilerOptions opening brace
          line_number=$(grep -n "\"compilerOptions\":" tsconfig.json | cut -d ":" -f 1)
          line_number=$((line_number + 1)) # Move to the line after compilerOptions
          
          # Insert declaration: true after the compilerOptions opening brace
          sed -i "${line_number}s/{/{\n    \"declaration\": true,/" tsconfig.json
        fi
        echo "✅ Added declaration: true to tsconfig.json"
      fi
    fi
    
    # Check if we need to add outDir
    if grep -q "outdir_configured=false" ts_package_assessment.txt; then
      read -p "Add \"outDir\": \"./dist\" to your tsconfig.json? (Y/n) " add_outdir
      if [[ $add_outdir != [Nn]* ]]; then
        # Add outDir if not present
        if grep -q "\"outDir\":" tsconfig.json; then
          sed -i 's|"outDir": *"[^"]*"|"outDir": "./dist"|g' tsconfig.json
        else
          # Find compilerOptions opening brace
          line_number=$(grep -n "\"compilerOptions\":" tsconfig.json | cut -d ":" -f 1)
          line_number=$((line_number + 1)) # Move to the line after compilerOptions
          
          # Insert outDir after the compilerOptions opening brace
          sed -i "${line_number}s/{/{\n    \"outDir\": \"./dist\",/" tsconfig.json
        fi
        echo "✅ Added outDir: \"./dist\" to tsconfig.json"
      fi
    fi
  else
    # Create a new tsconfig.json file with recommended settings
    echo "Creating tsconfig.json with recommended settings for npm package distribution..."
    cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts", "dist"]
}
EOL
    echo "✅ Created tsconfig.json with recommended settings for npm package distribution"
  fi
else
  # Create a new tsconfig.json file
  echo "Creating tsconfig.json with recommended settings for npm package distribution..."
  cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts", "dist"]
}
EOL
  echo "✅ Created tsconfig.json with recommended settings for npm package distribution"
fi

# Check if entry point exists
if [ ! -f src/index.ts ]; then
  echo "Creating entry point at src/index.ts..."
  mkdir -p src
  cat > src/index.ts << EOL
/**
 * Main entry point for the package
 */

/**
 * Example function
 */
export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// Default export (optional)
export default {
  greet
};
EOL
  echo "✅ Created entry point at src/index.ts"
else
  echo "✅ Entry point src/index.ts already exists"
fi

# Update the assessment results
if [ -f ts_package_assessment.txt ]; then
  # Update tsconfig.json status
  sed -i 's/tsconfig_json=false/tsconfig_json=true/g' ts_package_assessment.txt
  
  # Update declaration status
  sed -i 's/declaration_true=false/declaration_true=true/g' ts_package_assessment.txt
  
  # Update outDir status
  sed -i 's/outdir_configured=false/outdir_configured=true/g' ts_package_assessment.txt
  
  # Update entry point status if we created it
  if [ -f src/index.ts ]; then
    sed -i 's/entry_point=false/entry_point=true/g' ts_package_assessment.txt
  fi
  
  echo "✅ Assessment results updated"
fi

echo ""
echo "TypeScript configuration complete!"
echo "Your tsconfig.json is now properly configured for package distribution."
echo "Next step: Package Configuration"
```

## Configuration Details

### TypeScript Compiler Options

The recommended settings for a TypeScript package include:

- **target**: `es2018` - Modern JavaScript features with good browser compatibility
- **module**: `commonjs` - Standard module system for Node.js compatibility
- **declaration**: `true` - Generates `.d.ts` files for TypeScript consumers
- **outDir**: `./dist` - Puts compiled files in a separate directory
- **rootDir**: `./src` - Specifies the source directory
- **strict**: `true` - Enables all strict type checking options
- **esModuleInterop**: `true` - Better compatibility with CommonJS modules
- **forceConsistentCasingInFileNames**: `true` - Prevents case sensitivity issues
- **skipLibCheck**: `true` - Skips type checking of declaration files
- **resolveJsonModule**: `true` - Allows importing JSON files

### Entry Point

The script ensures you have a basic entry point at `src/index.ts`. This file should export all the functionality you want to make available to users of your package.

## Manual Configuration (if needed)

If you prefer to configure TypeScript manually:

1. Create a `tsconfig.json` file in your project root
2. Set up the compiler options as described above
3. Configure `include` to include your source files
4. Configure `exclude` to exclude test files and node_modules

## Next Steps

After completing the TypeScript Configuration, proceed to:

1. **Package Configuration** - To configure package.json for distribution
2. **Executable Setup** (optional) - If you want your package to be executable with npx