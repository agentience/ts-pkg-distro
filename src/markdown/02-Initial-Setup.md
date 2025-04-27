# TypeScript Package Setup - Initial Setup

This step will set up the basic structure for your TypeScript package. It will create or verify the essential files and directories needed for a TypeScript npm package.

## Prerequisites

- Node.js and npm installed
- Basic knowledge of TypeScript and npm packages

## Initial Setup Script

```bash
#!/bin/bash

# Load assessment results if they exist
if [ -f ts_package_assessment.txt ]; then
  echo "Loading assessment results..."
else
  echo "⚠️ No assessment results found. Run the Project Assessment step first."
  exit 1
fi

NEEDS_SETUP=false

# Check if package.json exists
if grep -q "package_json=false" ts_package_assessment.txt; then
  echo "❌ package.json doesn't exist, setup needed"
  NEEDS_SETUP=true
fi

# Check if src directory exists
if grep -q "src_directory=false" ts_package_assessment.txt; then
  echo "❌ src directory doesn't exist, setup needed"
  NEEDS_SETUP=true
fi

# Check if we need .gitignore
if grep -q "gitignore=false" ts_package_assessment.txt; then
  echo "❌ .gitignore doesn't exist, setup needed"
  NEEDS_SETUP=true
fi

if [ "$NEEDS_SETUP" = false ]; then
  echo "✅ Basic project structure already exists. You can skip this step."
  echo "If you want to run it anyway, set FORCE_SETUP=true"
  
  # Check if the FORCE_SETUP flag is set
  if [ "${FORCE_SETUP}" = "true" ]; then
    echo "FORCE_SETUP is true, proceeding with setup..."
  else
    echo "Exiting Initial Setup. Set FORCE_SETUP=true to force setup."
    exit 0
  fi
fi

# Create a new directory for your project (skip if using existing directory)
if [ ! -d "$(pwd)" ]; then
  echo "Creating project directory..."
  mkdir -p "$(pwd)"
fi

echo "📁 Setting up project in $(pwd)"

# Initialize a new npm package (skip if package.json exists)
if [ ! -f package.json ]; then
  echo "Creating package.json..."
  npm init -y
  echo "✅ package.json created"
else
  echo "✅ package.json already exists"
fi

# Initialize git repository (skip if .git directory exists)
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
  echo "✅ Git repository initialized"
else
  echo "✅ Git repository already exists"
fi

# Check if TypeScript is installed, if not, install it
if [ ! -d node_modules/typescript ]; then
  echo "Installing TypeScript..."
  npm install --save-dev typescript @types/node
  echo "✅ TypeScript installed"
else
  echo "✅ TypeScript already installed"
fi

# Install development tools if needed
echo "Installing development tools..."
npm install --save-dev rimraf
echo "✅ Development tools installed"

# Optionally install testing tools
read -p "Do you want to install Jest for testing? (y/N) " install_jest
if [[ $install_jest == [Yy]* ]]; then
  npm install --save-dev jest @types/jest ts-jest
  echo "✅ Jest installed"
fi

# Create source directory if it doesn't exist
if [ ! -d src ]; then
  echo "Creating src directory..."
  mkdir src
  echo "✅ src directory created"
else
  echo "✅ src directory already exists"
fi

# Create test directory if it doesn't exist
if [ ! -d tests ] && [[ $install_jest == [Yy]* ]]; then
  echo "Creating tests directory..."
  mkdir tests
  echo "✅ tests directory created"
else
  if [ -d tests ]; then
    echo "✅ tests directory already exists"
  fi
fi

# Create basic files if they don't exist
if [ ! -f src/index.ts ]; then
  echo "Creating src/index.ts..."
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
  echo "✅ src/index.ts created"
else
  echo "✅ src/index.ts already exists"
fi

# Create README.md if it doesn't exist
if [ ! -f README.md ]; then
  echo "Creating README.md..."
  package_name=$(grep -m 1 '"name":' package.json | cut -d '"' -f 4)
  cat > README.md << EOL
# ${package_name}

A TypeScript package for [description].

## Installation

\`\`\`bash
npm install ${package_name}
\`\`\`

## Usage

\`\`\`typescript
import { greet } from '${package_name}';

console.log(greet('World')); // Outputs: Hello, World!
\`\`\`

## API

### greet(name: string): string

Returns a greeting message for the given name.

## License

[Choose a license]
EOL
  echo "✅ README.md created"
else
  echo "✅ README.md already exists"
fi

# Check if .gitignore exists, if not create it
if [ ! -f .gitignore ]; then
  echo "Creating .gitignore..."
  cat > .gitignore << EOL
# Dependencies
node_modules/

# Build output
dist/
lib/

# Test coverage
coverage/

# Environment variables
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor and OS files
.DS_Store
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOL
  echo "✅ .gitignore created"
else
  echo "✅ .gitignore already exists"
  
  # Make sure common entries are in .gitignore
  missing_entries=""
  for entry in "node_modules/" "dist/" "coverage/" ".env" "*.log" ".DS_Store"; do
    if ! grep -q "$entry" .gitignore; then
      missing_entries="$missing_entries$entry\n"
    fi
  done
  
  if [ -n "$missing_entries" ]; then
    echo "Adding missing entries to .gitignore..."
    echo -e "$missing_entries" >> .gitignore
    echo "✅ Updated .gitignore with missing entries"
  else
    echo "✅ .gitignore already contains all common entries"
  fi
fi

# Update the assessment results
if [ -f ts_package_assessment.txt ]; then
  # Update package.json status
  sed -i 's/package_json=false/package_json=true/g' ts_package_assessment.txt
  
  # Update src directory status
  sed -i 's/src_directory=false/src_directory=true/g' ts_package_assessment.txt
  
  # Update entry point status if we created it
  if [ -f src/index.ts ]; then
    sed -i 's/entry_point=false/entry_point=true/g' ts_package_assessment.txt
  fi
  
  # Update gitignore status
  sed -i 's/gitignore=false/gitignore=true/g' ts_package_assessment.txt
  sed -i 's/gitignore_complete=false/gitignore_complete=true/g' ts_package_assessment.txt
  
  # Update readme status
  if [ -f README.md ]; then
    sed -i 's/readme=false/readme=true/g' ts_package_assessment.txt
  fi
  
  echo "✅ Assessment results updated"
fi

echo ""
echo "Initial setup complete! Your project now has the basic structure needed for a TypeScript package."
echo "Next step: TypeScript Configuration"
```

## What This Script Does

1. **Checks if setup is needed** based on the assessment results
2. **Creates package.json** if it doesn't exist
3. **Initializes git repository** if it doesn't exist
4. **Installs TypeScript and development tools**
5. **Creates basic project structure**:
   - src directory
   - tests directory (if Jest is installed)
   - src/index.ts (entry point)
   - README.md
   - .gitignore

## Manual Steps (if needed)

If you prefer to set up your project manually:

1. Create a new directory for your project (if needed)
2. Run `npm init -y` to create package.json
3. Run `git init` to initialize a git repository
4. Install TypeScript: `npm install --save-dev typescript @types/node`
5. Install development tools: `npm install --save-dev rimraf`
6. Create src directory: `mkdir src`
7. Create a basic entry point at src/index.ts
8. Create README.md with basic documentation
9. Create .gitignore with common entries

## Next Steps

After completing the Initial Setup, proceed to:

1. **TypeScript Configuration** - To set up TypeScript compilation options
2. **Package Configuration** - To configure package.json for distribution