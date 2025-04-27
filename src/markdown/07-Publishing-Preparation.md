# TypeScript Package Setup - Publishing Preparation

This step will prepare your TypeScript package for publishing to npm. Publishing makes your package available for others to install and use.

## Prerequisites

- Node.js and npm installed
- npm account created (if you don't have one, you'll create it during this step)
- TypeScript package built and tested (see Build and Test step)

## Publishing Preparation Script

```bash
#!/bin/bash

# Load assessment results if they exist
if [ -f ts_package_assessment.txt ]; then
  echo "Loading assessment results..."
else
  echo "⚠️ No assessment results found. Run the Project Assessment step first."
  exit 1
fi

# Run pre-publishing checks
echo "🔍 Pre-publishing checks:"

# Check if package.json exists
if [ ! -f package.json ]; then
  echo "❌ package.json not found!"
  exit 1
fi

# Get the output directory from tsconfig.json, defaulting to "dist" if not found
OUT_DIR=$(grep -m 1 '"outDir":' tsconfig.json | sed 's/.*"outDir": *"\(.*\)".*/\1/' | sed 's/\.\///')
if [ -z "$OUT_DIR" ]; then
  OUT_DIR="dist"
fi

# Check for critical fields in package.json
missing_fields=""
for field in "name" "version" "main" "files"; do
  if ! grep -q "\"$field\"" package.json; then
    missing_fields="$missing_fields $field"
  fi
done

if [ -n "$missing_fields" ]; then
  echo "❌ Missing required fields in package.json:$missing_fields"
  echo "Run the Package Configuration step to fix this."
  exit 1
else
  echo "✅ package.json contains required fields"
fi

# Check if the dist directory exists
if [ ! -d "$OUT_DIR" ]; then
  echo "❌ $OUT_DIR directory not found! Run the build script first."
  exit 1
else
  echo "✅ $OUT_DIR directory exists"
fi

# Check for README
if [ ! -f README.md ]; then
  echo "⚠️ README.md not found! You should create documentation before publishing."
else
  echo "✅ README.md exists"
  
  # Check README content
  if [ $(wc -l < README.md) -lt 10 ]; then
    echo "⚠️ README.md is very short. Consider adding more documentation."
  fi
fi

# Check for LICENSE
if [ ! -f LICENSE ]; then
  echo "⚠️ LICENSE file not found! Consider adding a license before publishing."
else
  echo "✅ LICENSE file exists"
fi

# Check for TypeScript declarations
if ! find "$OUT_DIR" -name "*.d.ts" | grep -q .; then
  echo "❌ No TypeScript declaration files (.d.ts) found in $OUT_DIR."
  echo "Check your tsconfig.json to ensure 'declaration' is set to true."
  exit 1
else
  echo "✅ TypeScript declarations (.d.ts files) are generated"
fi

# Check if logged in to npm
if npm whoami >/dev/null 2>&1; then
  echo "✅ Logged in to npm as $(npm whoami)"
else
  echo "❌ Not logged in to npm."
  echo "You need to create an npm account or log in before publishing."
  
  # Ask if user wants to create an account or log in
  read -p "Do you want to create an npm account or log in now? (y/N) " npm_login
  if [[ $npm_login == [Yy]* ]]; then
    echo "Creating npm account or logging in..."
    npm login
    
    if [ $? -eq 0 ]; then
      echo "✅ Successfully logged in to npm as $(npm whoami)"
    else
      echo "❌ Failed to log in to npm. Visit https://www.npmjs.com/signup to create an account."
      exit 1
    fi
  else
    echo "You'll need to log in to npm before publishing."
    echo "Use 'npm login' to log in when you're ready."
    echo "Create an account at https://www.npmjs.com/signup if needed."
  fi
fi

# Prepare Documentation
if [ ! -f README.md ]; then
  echo "Creating README.md..."
  
  # Get package details
  PACKAGE_NAME=$(grep -m 1 '"name":' package.json | cut -d '"' -f 4)
  PACKAGE_DESC=$(grep -m 1 '"description":' package.json | cut -d '"' -f 4)
  
  # Create basic README template
  cat > README.md << EOL
# $PACKAGE_NAME

$PACKAGE_DESC

## Installation

\`\`\`bash
npm install $PACKAGE_NAME
\`\`\`

## Usage

\`\`\`typescript
import { greet } from '$PACKAGE_NAME';

console.log(greet('World')); // Outputs: Hello, World!
\`\`\`

## API

### greet(name: string): string

Returns a greeting message for the given name.

## License

[Choose a license]
EOL
  
  echo "✅ Created basic README.md template"
  echo "⚠️ Please edit README.md to include detailed documentation before publishing."
else
  echo "✅ README.md exists"
fi

# Check if package is executable
IS_EXECUTABLE=false
EXECUTABLE_NAME=""
if grep -q '"bin":' package.json; then
  IS_EXECUTABLE=true
  EXECUTABLE_NAME=$(grep -A 2 '"bin":' package.json | grep -o '"[^"]*": "' | head -1 | cut -d'"' -f2)
  
  # Check if README includes CLI documentation
  if ! grep -q "npx" README.md && ! grep -q "CLI" README.md && ! grep -q "command" README.md; then
    echo "⚠️ Your package is executable but README.md doesn't mention CLI usage."
    echo "Consider adding CLI documentation to README.md."
    
    # Ask if user wants to add CLI documentation
    read -p "Do you want to add basic CLI documentation to README.md? (y/N) " add_cli_docs
    if [[ $add_cli_docs == [Yy]* ]]; then
      echo "Adding CLI documentation to README.md..."
      
      # Add CLI section to README
      cat >> README.md << EOL

## CLI Usage

This package provides a command-line interface. You can use it with npx:

\`\`\`bash
npx $EXECUTABLE_NAME [arguments]
\`\`\`

Or install globally:

\`\`\`bash
npm install -g $PACKAGE_NAME
$EXECUTABLE_NAME [arguments]
\`\`\`
EOL
      
      echo "✅ Added CLI documentation to README.md"
    fi
  fi
fi

# Add License if needed
if [ ! -f LICENSE ]; then
  echo "No LICENSE file found."
  echo "Adding a license is recommended before publishing."
  
  # Ask if user wants to add a license
  read -p "Do you want to add a license now? (MIT/ISC/none) [MIT]: " license_type
  license_type=${license_type:-MIT}
  
  if [[ $license_type == [Nn]one ]]; then
    echo "Skipping license creation."
  else
    echo "Creating $license_type license..."
    
    # Get current year and author from package.json or git
    YEAR=$(date +"%Y")
    AUTHOR=$(grep -m 1 '"author":' package.json | cut -d '"' -f 4)
    if [ -z "$AUTHOR" ]; then
      AUTHOR=$(git config user.name)
    fi
    if [ -z "$AUTHOR" ]; then
      read -p "Enter your name for the license: " AUTHOR
    fi
    
    if [ "$license_type" = "MIT" ]; then
      cat > LICENSE << EOL
MIT License

Copyright (c) $YEAR $AUTHOR

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOL
    elif [ "$license_type" = "ISC" ]; then
      cat > LICENSE << EOL
ISC License

Copyright (c) $YEAR $AUTHOR

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
EOL
    fi
    
    echo "✅ Created $license_type license"
    
    # Update license in package.json
    sed -i "s/\"license\": \".*\"/\"license\": \"$license_type\"/" package.json
    echo "✅ Updated license in package.json"
  fi
fi

# Version Management
CURRENT_VERSION=$(grep -m 1 '"version":' package.json | cut -d '"' -f 4)
echo "Current package version: $CURRENT_VERSION"

# Ask if user wants to update version
read -p "Do you want to update the version before publishing? (y/N) " update_version
if [[ $update_version == [Yy]* ]]; then
  echo "Available version update types:"
  echo "1. patch - for backwards-compatible bug fixes (1.0.0 -> 1.0.1)"
  echo "2. minor - for new features in a backwards-compatible manner (1.0.0 -> 1.1.0)"
  echo "3. major - for incompatible API changes (1.0.0 -> 2.0.0)"
  
  read -p "Choose a version update type (patch/minor/major) [patch]: " version_type
  version_type=${version_type:-patch}
  
  if [[ "$version_type" != "patch" && "$version_type" != "minor" && "$version_type" != "major" ]]; then
    echo "Invalid version type. Using 'patch' as default."
    version_type="patch"
  fi
  
  echo "Updating version using npm version $version_type..."
  npm version $version_type
  
  if [ $? -eq 0 ]; then
    NEW_VERSION=$(grep -m 1 '"version":' package.json | cut -d '"' -f 4)
    echo "✅ Version updated from $CURRENT_VERSION to $NEW_VERSION"
  else
    echo "❌ Failed to update version"
  fi
fi

# Get package name from package.json
PACKAGE_NAME=$(grep -m 1 '"name":' package.json | cut -d '"' -f 4)

# Check if it's a scoped package (starts with @)
IS_SCOPED=false
if [[ $PACKAGE_NAME == @* ]]; then
  IS_SCOPED=true
  echo "📦 Package $PACKAGE_NAME is a scoped package"
fi

# Display publishing command
if [ "$IS_SCOPED" = true ]; then
  echo "To publish your scoped package, use:"
  echo "npm publish --access public"
else
  echo "To publish your package, use:"
  echo "npm publish"
fi

echo ""
echo "Publishing preparation complete!"
echo "Your package is now ready to be published to npm."
echo "Next step: Publishing to npm"
```

## What This Script Does

1. **Verifies Package Readiness**: Checks for required files and fields
2. **Creates or Logs in to npm Account**: Ensures you're logged in to npm
3. **Prepares Documentation**: Creates or updates README.md with essential information
4. **Adds License**: Creates a LICENSE file if needed
5. **Updates Version**: Optionally updates the package version

## Manual Preparation (if needed)

If you prefer to prepare your package manually:

1. **Verify package.json**: Make sure it has all the required fields
2. **Create or update README.md**: Add detailed documentation
3. **Add a LICENSE file**: Choose an appropriate license
4. **Log in to npm**: Run `npm login`
5. **Update version**: Run `npm version patch|minor|major`

## Pre-Publishing Checklist

Before proceeding to publishing, ensure you have:

- [ ] All required fields in package.json
- [ ] Built the package with TypeScript declarations
- [ ] Clear and complete documentation in README.md
- [ ] Appropriate license in LICENSE file and package.json
- [ ] Logged in to npm
- [ ] Appropriate version number

## Next Steps

After completing the Publishing Preparation, proceed to:

1. **Publishing to npm** - To publish your package to npm