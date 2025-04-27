# TypeScript Package Setup - Package Configuration

This step will configure your package.json for npm distribution. A properly configured package.json is essential for making your TypeScript package usable by others.

## Prerequisites

- Node.js and npm installed
- Basic project structure set up (see Initial Setup step)
- TypeScript configured (see TypeScript Configuration step)

## Package Configuration Script

```bash
#!/bin/bash

# Load assessment results if they exist
if [ -f ts_package_assessment.txt ]; then
  echo "Loading assessment results..."
else
  echo "⚠️ No assessment results found. Run the Project Assessment step first."
  exit 1
fi

NEEDS_PACKAGE_CONFIG=false

# Check if main field exists
if grep -q "main_field=false" ts_package_assessment.txt; then
  echo "❌ main field doesn't exist in package.json, configuration needed"
  NEEDS_PACKAGE_CONFIG=true
fi

# Check if types field exists
if grep -q "types_field=false" ts_package_assessment.txt; then
  echo "❌ types field doesn't exist in package.json, configuration needed"
  NEEDS_PACKAGE_CONFIG=true
fi

# Check if files field exists
if grep -q "files_field=false" ts_package_assessment.txt; then
  echo "❌ files field doesn't exist in package.json, configuration needed"
  NEEDS_PACKAGE_CONFIG=true
fi

# Check if build script exists
if grep -q "build_script=false" ts_package_assessment.txt; then
  echo "❌ build script doesn't exist in package.json, configuration needed"
  NEEDS_PACKAGE_CONFIG=true
fi

# Check if prepare script exists
if grep -q "prepare_script=false" ts_package_assessment.txt; then
  echo "❌ prepare script doesn't exist in package.json, configuration needed"
  NEEDS_PACKAGE_CONFIG=true
fi

if [ "$NEEDS_PACKAGE_CONFIG" = false ]; then
  echo "✅ package.json is already properly configured for distribution. You can skip this step."
  echo "If you want to run it anyway, set FORCE_PACKAGE_CONFIG=true"
  
  # Check if the FORCE_PACKAGE_CONFIG flag is set
  if [ "${FORCE_PACKAGE_CONFIG}" = "true" ]; then
    echo "FORCE_PACKAGE_CONFIG is true, proceeding with package configuration..."
  else
    echo "Exiting Package Configuration. Set FORCE_PACKAGE_CONFIG=true to force configuration."
    exit 0
  fi
fi

# Check if package.json exists
if [ ! -f package.json ]; then
  echo "Creating package.json..."
  npm init -y
  echo "✅ package.json created"
fi

# Get the current package name from package.json
PACKAGE_NAME=$(grep -m 1 '"name":' package.json | cut -d '"' -f 4)

# Get the output directory from tsconfig.json, defaulting to "dist" if not found
OUT_DIR=$(grep -m 1 '"outDir":' tsconfig.json | sed 's/.*"outDir": *"\(.*\)".*/\1/' | sed 's/\.\///')
if [ -z "$OUT_DIR" ]; then
  OUT_DIR="dist"
fi

echo "Using output directory: $OUT_DIR"

# Create a temporary file with updated package.json
echo "Updating package.json with distribution fields..."

# Function to update or add a field in package.json
# This is a simplified approach - in a real scenario, you'd want to use a JSON parser
update_package_json_field() {
  local field="$1"
  local value="$2"
  local pattern="\"$field\": "
  
  if grep -q "$pattern" package.json; then
    # Field exists, update it
    sed -i "s|$pattern.*|$pattern$value,|" package.json
  else
    # Field doesn't exist, add it after the first {
    sed -i "s/{/{\\n  $pattern$value,/" package.json
  fi
}

# Update main field
update_package_json_field "main" "\"$OUT_DIR/index.js\""

# Update types field
update_package_json_field "types" "\"$OUT_DIR/index.d.ts\""

# Update files field
if ! grep -q '"files":' package.json; then
  sed -i "/\"main\"/a \  \"files\": [\"$OUT_DIR\"]," package.json
fi

# Add or update scripts
if ! grep -q '"scripts":' package.json; then
  sed -i "/\"name\"/a \  \"scripts\": {}," package.json
fi

# Check if rimraf is installed
if [ ! -d node_modules/rimraf ]; then
  echo "Installing rimraf..."
  npm install --save-dev rimraf
fi

# Update scripts
if ! grep -q '"clean":' package.json; then
  sed -i "/\"scripts\":/a \    \"clean\": \"rimraf $OUT_DIR\"," package.json
fi

if ! grep -q '"build":' package.json; then
  sed -i "/\"scripts\":/a \    \"build\": \"npm run clean && tsc\"," package.json
fi

if ! grep -q '"prepare":' package.json; then
  sed -i "/\"scripts\":/a \    \"prepare\": \"npm run build\"," package.json
fi

if ! grep -q '"prepublishOnly":' package.json; then
  if grep -q '"test":' package.json; then
    sed -i "/\"scripts\":/a \    \"prepublishOnly\": \"npm test\"," package.json
  else
    sed -i "/\"scripts\":/a \    \"prepublishOnly\": \"echo \\\"No tests specified\\\"\"," package.json
  fi
fi

echo "✅ package.json updated with distribution fields"

# Display the updated package.json
echo "Updated package.json:"
cat package.json

# Verify the changes
echo "Verifying changes..."
VERIFICATION_PASSED=true

if ! grep -q "\"main\": \"$OUT_DIR/index.js\"" package.json; then
  echo "❌ main field not set correctly"
  VERIFICATION_PASSED=false
fi

if ! grep -q "\"types\": \"$OUT_DIR/index.d.ts\"" package.json; then
  echo "❌ types field not set correctly"
  VERIFICATION_PASSED=false
fi

if ! grep -q "\"files\":" package.json; then
  echo "❌ files field not added"
  VERIFICATION_PASSED=false
fi

if ! grep -q "\"build\":" package.json; then
  echo "❌ build script not added"
  VERIFICATION_PASSED=false
fi

if ! grep -q "\"prepare\":" package.json; then
  echo "❌ prepare script not added"
  VERIFICATION_PASSED=false
fi

if [ "$VERIFICATION_PASSED" = true ]; then
  echo "✅ All changes verified successfully"
else
  echo "⚠️ Some changes could not be verified. Please check package.json manually."
fi

# Ask for package description if not already set
if ! grep -q "\"description\": \"[^\"]\+" package.json; then
  read -p "Enter a description for your package: " package_description
  if [ -n "$package_description" ]; then
    update_package_json_field "description" "\"$package_description\""
  fi
fi

# Ask for keywords
read -p "Do you want to add keywords to your package? (y/N) " add_keywords
if [[ $add_keywords == [Yy]* ]]; then
  read -p "Enter keywords separated by spaces: " keywords_input
  if [ -n "$keywords_input" ]; then
    # Convert space-separated keywords to JSON array
    keywords_json="["
    for keyword in $keywords_input; do
      keywords_json="$keywords_json\"$keyword\", "
    done
    keywords_json="${keywords_json%, }"
    keywords_json="$keywords_json]"
    
    update_package_json_field "keywords" "$keywords_json"
    echo "✅ Keywords added to package.json"
  fi
fi

# Ask for repository
read -p "Do you want to add a repository URL? (y/N) " add_repo
if [[ $add_repo == [Yy]* ]]; then
  read -p "Enter repository URL: " repo_url
  if [ -n "$repo_url" ]; then
    # Check if it's a GitHub URL and format accordingly
    if [[ $repo_url == *"github.com"* ]]; then
      repo_url=${repo_url%.git}
      repo_json="{\"type\": \"git\", \"url\": \"git+$repo_url.git\"}"
    else
      repo_json="{\"type\": \"git\", \"url\": \"$repo_url\"}"
    fi
    
    update_package_json_field "repository" "$repo_json"
    echo "✅ Repository added to package.json"
  fi
fi

# Ask for license if not already set
if ! grep -q "\"license\": \"[^\"]\+" package.json; then
  read -p "Enter a license for your package (e.g., MIT): " license_input
  if [ -n "$license_input" ]; then
    update_package_json_field "license" "\"$license_input\""
    echo "✅ License added to package.json"
  fi
fi

# Update the assessment results
if [ -f ts_package_assessment.txt ]; then
  # Update main field status
  sed -i 's/main_field=false/main_field=true/g' ts_package_assessment.txt
  
  # Update types field status
  sed -i 's/types_field=false/types_field=true/g' ts_package_assessment.txt
  
  # Update files field status
  sed -i 's/files_field=false/files_field=true/g' ts_package_assessment.txt
  
  # Update build script status
  sed -i 's/build_script=false/build_script=true/g' ts_package_assessment.txt
  
  # Update prepare script status
  sed -i 's/prepare_script=false/prepare_script=true/g' ts_package_assessment.txt
  
  echo "✅ Assessment results updated"
fi

echo ""
echo "Package configuration complete!"
echo "Your package.json is now properly configured for npm distribution."
echo "Next step: Executable Setup (if needed) or Build and Test"
```

## Example package.json

Here's a template of what your package.json should look like after configuration:

```json
{
  "name": "your-package-name",
  "version": "1.0.0",
  "description": "Your package description",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "clean": "rimraf dist",
    "build": "npm run clean && tsc",
    "test": "jest",
    "prepare": "npm run build",
    "prepublishOnly": "npm test"
  },
  "keywords": [
    "typescript",
    "npm",
    "package"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yourusername/your-package-name.git"
  }
}
```

## Configuration Details

### Essential Fields

- **main**: Points to the compiled JavaScript entry point (usually `dist/index.js`)
- **types**: Points to the TypeScript declaration file (usually `dist/index.d.ts`)
- **files**: Specifies which files to include in the published package (usually just `dist`)

### Important Scripts

- **clean**: Removes the output directory to ensure a clean build
- **build**: Compiles TypeScript to JavaScript
- **prepare**: Automatically runs before the package is packed or published
- **prepublishOnly**: Runs before the package is published, often used for tests

### Optional Metadata

- **description**: A short description of your package
- **keywords**: Tags that help users find your package
- **repository**: Link to the source code repository
- **license**: The license under which the package is distributed

## Manual Configuration (if needed)

If you prefer to configure package.json manually:

1. Open package.json in your editor
2. Add/update the fields as described above
3. Add the necessary scripts for building and testing
4. Save the file

## Next Steps

After completing the Package Configuration, proceed to:

1. **Executable Setup** (optional) - If you want your package to be executable with npx
2. **Build and Test** - To build your package and test it locally