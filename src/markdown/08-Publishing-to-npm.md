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

### Preferred Method: GitHub Workflows

For projects using Git with a GitHub repository, the recommended approach is to publish through GitHub Actions workflows rather than direct npm publishing. This provides several advantages:

- Automated, consistent publishing process
- No need to handle npm authentication locally
- Version control integration
- Audit trail of all published versions
- Ability to trigger releases through GitHub's UI

If your project has a GitHub repository, follow these steps:

1. Ensure your project has a GitHub workflow file at `.github/workflows/publish.yml`
2. Set up the required npm token as a GitHub secret
3. Create a GitHub release to trigger the workflow

Detailed instructions are provided in the [CI/CD Integration](#cicd-integration) section below.

### Alternative: Manual Publishing

If you prefer or need to publish manually, follow these steps:

#### 1. Final Checks

Before publishing, perform several checks:

- Verify you're logged in to npm
- Check for README.md and LICENSE files
- Run tests if available
- Check package size and TypeScript declarations

#### 2. Publishing

The publishing command depends on whether your package is scoped:

- For regular packages: `npm publish`
- For scoped packages (e.g., @yourscope/package-name): `npm publish --access public`

#### 3. Post-Publishing

After publishing, you can:

- Add an npm version badge to your README
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
4. If using GitHub workflow (recommended):
   - Commit and push your changes
   - Create a new GitHub release to trigger the publishing workflow
5. If publishing manually:
   - Run `npm publish` (or `npm publish --access public` for scoped packages)

## Package Name and Publishing

The package name in your `package.json` file determines how your package will be published to npm. The GitHub Actions workflow will use this name as-is without modifying it.

### How It Works

1. Set your desired package name in `package.json`:
   ```json
   {
     "name": "your-package-name",
     "version": "1.0.0",
     ...
   }
   ```
   
   Or for a scoped package:
   ```json
   {
     "name": "@your-org-name/your-package-name",
     "version": "1.0.0",
     ...
   }
   ```

2. When publishing:
   - If your package name starts with `@` (a scoped package), the `--access public` flag will be automatically applied
   - If your package name doesn't start with `@` (a regular package), it will be published without the `--access public` flag

3. Benefits:
   - Package name in `package.json` is always respected
   - No runtime modifications to your package.json
   - Automatic handling of the `--access public` flag for scoped packages
   - Simplified publishing process for both local and CI/CD environments
   - No dependency on npm-org configuration or NPM_ORG environment variable

## CI/CD Integration

GitHub Actions provides a powerful way to automate the publishing process. Here's how to set it up and use it:

### 1. Setting Up the GitHub Workflow

Create a file at `.github/workflows/publish.yml` with the following content:

```yaml
name: Node.js Package

on:
  release:
    types: [created]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to publish'
        required: true
        default: '1.0.0'

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
      
      # Check if package name is scoped (starts with @)
      - name: Check if package is scoped
        id: package-check
        run: |
          IS_SCOPED=$(node -e "const pkg = require('./package.json'); console.log(pkg.name.startsWith('@') ? 'true' : 'false');")
          echo "IS_SCOPED=$IS_SCOPED" >> $GITHUB_ENV
          echo "Package name from package.json: $(node -e "console.log(require('./package.json').name)")"
      
      # Publish package based on whether it's scoped or not
      - name: Publish package
        run: |
          if [ "$IS_SCOPED" = "true" ]; then
            echo "Publishing scoped package with --access public"
            npm publish --access public
          else
            echo "Publishing regular package"
            npm publish
          fi
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

### 2. Creating an npm Token

Generate an npm token for automated publishing:

```bash
npm login  # If not already logged in
npm token create --read-only=false
```

Copy the generated token.

### 3. Adding the Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste the npm token you created
6. Click "Add secret"

### 4. Publishing Using GitHub Releases

To publish a new version:

1. Update your package version in package.json
2. Commit and push your changes
3. Go to your GitHub repository
4. Navigate to Releases
5. Click "Create a new release"
6. Create a new tag in the format `v1.2.0` (matching your package version)
7. Title: `Release v1.2.0`
8. Description: Add your release notes
9. Click "Publish release"

The GitHub workflow will automatically trigger and publish your package to npm.

### 5. Manual Workflow Trigger

You can also manually trigger the workflow:

1. Go to your GitHub repository
2. Navigate to Actions > Node.js Package
3. Click "Run workflow"
4. Enter the version number
5. Click "Run workflow"

### Benefits of This Approach

This workflow:
- Uses the package name directly from package.json without modification
- Does not require any npm-org configuration
- Does not depend on the NPM_ORG environment variable
- Automatically detects scoped packages and applies the appropriate publishing command
- Provides a consistent, repeatable publishing process
- Creates an audit trail of all published versions

## Conclusion

Congratulations! Your TypeScript package is now published to npm and available for others to use. You've successfully completed all the steps required to set up a TypeScript package for distribution.

Remember to maintain your package by addressing issues, adding new features, and updating dependencies. Keep your documentation up to date and respond to community feedback.

Happy coding!