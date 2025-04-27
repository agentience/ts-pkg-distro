# TypeScript Package Setup - Publishing to npm

This final step will publish your TypeScript package to npm, making it available for others to install and use.

## Prerequisites

- Node.js and npm installed
- npm account created and logged in
- TypeScript package built, tested, and prepared for publishing (see previous steps)

## Publishing to npm Script

```bash
#!/bin/bash

# Load assessment results if they exist
if [ -f ts_package_assessment.txt ]; then
  echo "Loading assessment results..."
else
  echo "⚠️ No assessment results found. Run the Project Assessment step first."
  exit 1
fi

# Check if logged in to npm
if ! npm whoami >/dev/null 2>&1; then
  echo "❌ Not logged in to npm. Please log in first."
  echo "Run: npm login"
  exit 1
else
  echo "✅ Logged in to npm as $(npm whoami)"
fi

# Get package name from package.json
PACKAGE_NAME=$(grep -m 1 '"name":' package.json | cut -d '"' -f 4)

# Get current version
CURRENT_VERSION=$(grep -m 1 '"version":' package.json | cut -d '"' -f 4)

echo "Package name: $PACKAGE_NAME"
echo "Version: $CURRENT_VERSION"

# Check if it's a scoped package (starts with @)
IS_SCOPED=false
if [[ $PACKAGE_NAME == @* ]]; then
  IS_SCOPED=true
  echo "📦 Package $PACKAGE_NAME is a scoped package"
fi

# Final Checklist
echo "📋 Final Checklist Before Publishing:"

# Check README
if [ ! -f README.md ]; then
  echo "❌ README.md doesn't exist"
else
  if [ $(wc -l < README.md) -lt 10 ]; then
    echo "⚠️ README.md might need more detailed documentation"
  else
    echo "✅ README.md exists"
  fi
fi

# Check LICENSE
if [ ! -f LICENSE ]; then
  echo "⚠️ LICENSE file doesn't exist"
else
  echo "✅ LICENSE file exists"
fi

# Check tests
if grep -q "\"test\":" package.json; then
  read -p "Do you want to run tests before publishing? (Y/n) " run_tests
  if [[ $run_tests != [Nn]* ]]; then
    echo "🧪 Running tests..."
    npm test
    
    if [ $? -ne 0 ]; then
      echo "❌ Tests failed. Fix the issues before publishing."
      exit 1
    fi
  fi
else
  echo "⚠️ No test script found in package.json"
fi

# Check package size
echo "📦 Checking package size..."
npm pack --dry-run

# Verify TypeScript declarations
if [ -d dist ] && find dist -name "*.d.ts" | grep -q .; then
  echo "✅ TypeScript declarations (.d.ts files) are generated"
else
  echo "❌ No TypeScript declarations found. Check your tsconfig.json"
  exit 1
fi

echo ""
echo "📝 Manual checklist:"
echo "- [ ] Verify your package works when installed locally"
echo "- [ ] If executable, test with npx"
echo "- [ ] Check if TypeScript declarations work properly for consumers"
echo "- [ ] Ensure documentation is clear and complete"
echo "- [ ] Verify all necessary files are included in the package"

# Ask if user wants to publish now
read -p "Do you want to publish the package now? (y/N) " publish_now
if [[ $publish_now == [Yy]* ]]; then
  echo "📦 Publishing package $PACKAGE_NAME..."
  
  if [ "$IS_SCOPED" = true ]; then
    npm publish --access public
  else
    npm publish
  fi
  
  if [ $? -eq 0 ]; then
    echo "✅ Package published successfully!"
    echo "View your package at: https://www.npmjs.com/package/$PACKAGE_NAME"
    
    # Generate installation instructions
    echo "Installation instructions:"
    echo "npm install $PACKAGE_NAME"
    
    # Generate badge for README (optional)
    read -p "Do you want to add an npm version badge to your README? (y/N) " add_badge
    if [[ $add_badge == [Yy]* ]]; then
      echo "Adding npm version badge to README.md..."
      
      # Escape special characters in package name for the badge URL
      ESCAPED_NAME=$(echo "$PACKAGE_NAME" | sed 's/@/%40/g' | sed 's/\//%2F/g')
      
      # Add badge to README if not already present
      if ! grep -q "npm version" README.md; then
        sed -i "1s/^/[![npm version](https:\/\/img.shields.io\/npm\/v\/$ESCAPED_NAME.svg)](https:\/\/www.npmjs.com\/package\/$PACKAGE_NAME)\n\n/" README.md
        echo "✅ Added npm version badge to README.md"
      else
        echo "⚠️ README.md already contains a badge"
      fi
    fi
    
    # Suggest setting up CI/CD
    read -p "Do you want to set up CI/CD for automated publishing? (y/N) " setup_cicd
    if [[ $setup_cicd == [Yy]* ]]; then
      if [ -d .github/workflows ]; then
        echo "GitHub Workflows directory already exists."
      else
        mkdir -p .github/workflows
      fi
      
      cat > .github/workflows/publish.yml << EOL
name: Node.js Package

on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16.x'
          registry-url: 'https://registry.npmjs.org/'
      - run: npm ci
      - run: npm test
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: \${{secrets.NPM_TOKEN}}
EOL
      
      echo "✅ Created GitHub Actions workflow for automated publishing"
      echo "You'll need to:"
      echo "1. Push this to a GitHub repository"
      echo "2. Generate an npm token: npm token create"
      echo "3. Add the token as a secret in your GitHub repository settings with the name NPM_TOKEN"
      echo "4. Create a new release in GitHub to trigger the workflow"
    fi
  else
    echo "❌ Publishing failed. Check the error message for details."
  fi
else
  echo "Package not published. You can publish it later with npm publish."
fi

echo ""
echo "🎉 Congratulations on setting up your TypeScript package for distribution!"
echo ""
echo "Next steps:"
echo "1. Share your package with the community"
echo "2. Add more features and publish updates"
echo "3. Consider contributing to open source"
echo ""
echo "When you want to update your package in the future:"
echo "1. Make your code changes"
echo "2. Run tests: npm test"
echo "3. Update the version: npm version patch|minor|major"
echo "4. Publish the updated package: npm publish"
```

## Publishing Process

### 1. Final Checks

Before publishing, the script performs several checks:

- Verifies you're logged in to npm
- Checks for README.md and LICENSE files
- Runs tests if available
- Checks package size and TypeScript declarations

### 2. Publishing

The publishing command depends on whether your package is scoped:

- For regular packages: `npm publish`
- For scoped packages (e.g., @yourscope/package-name): `npm publish --access public`

### 3. Post-Publishing

After publishing, you can:

- Add an npm version badge to your README
- Set up CI/CD for automated publishing
- Share your package with the community

## Manual Publishing (if needed)

If you prefer to publish manually:

1. Make sure you're logged in to npm:
   ```bash
   npm login
   ```

2. Run final checks:
   ```bash
   # Run tests
   npm test
   
   # Check package size
   npm pack --dry-run
   ```

3. Publish the package:
   ```bash
   # For regular packages
   npm publish
   
   # For scoped packages
   npm publish --access public
   ```

## Updating Your Package

When you want to update your package in the future:

1. Make your code changes
2. Run tests: `npm test`
3. Update the version: `npm version patch|minor|major`
4. Publish the updated package: `npm publish`

## Using the npm-org Configuration Option

The package supports an `npm-org` configuration option that determines whether your package is published with an organization namespace or not. This simplifies the publishing process, especially when using CI/CD.

### How It Works

1. Add the `npm-org` option to your `mcp-config.json` file:
   ```json
   {
     "server": {
       "name": "Your-Package-Name",
       "version": "1.0.0"
     },
     "npm-org": "your-org-name"
   }
   ```

2. When publishing:
   - If `npm-org` is specified, the package will be published with the organization namespace (e.g., `@your-org-name/package-name`) and the `--access public` flag will be automatically applied
   - If `npm-org` is not specified, the package will be published without an organization namespace

3. Benefits:
   - Consistent package naming across development and CI/CD environments
   - Automatic handling of the `--access public` flag for scoped packages
   - Simplified configuration management for projects with multiple packages

## CI/CD Integration

The script can set up CI/CD using GitHub Actions for automated publishing. This requires:

1. A GitHub repository for your package
2. An npm token: `npm token create`
3. Adding the token as a secret in your GitHub repository settings with the name `NPM_TOKEN`
4. Creating a new release in GitHub to trigger the workflow

The CI/CD workflow automatically detects the `npm-org` configuration and adjusts the package name and publishing command accordingly:

```yaml
# Determine if we need to use an npm organization
- name: Check for npm organization config
  id: npm-org-check
  run: |
    if [ -f mcp-config.json ]; then
      NPM_ORG=$(node -e "try { const config = require('./mcp-config.json'); console.log(config['npm-org'] || ''); } catch(e) { console.log(''); }")
      echo "NPM_ORG=$NPM_ORG" >> $GITHUB_ENV
      echo "Found npm-org in config: $NPM_ORG"
    fi

# Publish with or without organization namespace
- name: Publish package
  run: |
    if [ -n "$NPM_ORG" ]; then
      # Update package.json name to include organization
      node -e "const fs = require('fs'); const pkg = require('./package.json'); pkg.name = '@${{ env.NPM_ORG }}/' + pkg.name.replace(/^@.*\//, ''); fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));"
      echo "Publishing with organization namespace: @${{ env.NPM_ORG }}"
      npm publish --access public
    else
      # Update package.json name to remove organization if present
      node -e "const fs = require('fs'); const pkg = require('./package.json'); if (pkg.name.startsWith('@')) { pkg.name = pkg.name.replace(/^@.*\//, ''); fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2)); }"
      echo "Publishing without organization namespace"
      npm publish
    fi
```

## Conclusion

Congratulations! Your TypeScript package is now published to npm and available for others to use. You've successfully completed all the steps required to set up a TypeScript package for distribution.

Remember to maintain your package by addressing issues, adding new features, and updating dependencies. Keep your documentation up to date and respond to community feedback.

Happy coding!