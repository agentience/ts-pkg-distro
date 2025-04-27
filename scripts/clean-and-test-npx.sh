#!/bin/bash

# Script to clean npm environment of @agentience/ts-pkg-distro and test npx command
# This script performs a complete cleanup of the package from npm environment
# and tests how the npx command works on a fresh system.

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
  echo -e "\n${BLUE}==== $1 ====${NC}\n"
}

# Function to print success messages
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Function to print warning messages
print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to print error messages
print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# Function to print info messages
print_info() {
  echo -e "ℹ $1"
}

# Package names
# Previous releases were published as 'ts-pkg-distro' (without organization prefix)
# because there was no mcp-config.json file in the root directory.
# Future releases will be published as '@agentience/ts-pkg-distro' (with organization prefix)
# because we've added mcp-config.json with npm-org set to "agentience".
PACKAGE_NO_ORG="ts-pkg-distro"
PACKAGE_WITH_ORG="@agentience/ts-pkg-distro"

# Log file
LOG_FILE="npx-test-results.log"

# Start logging
echo "NPX Test Results - $(date)" > "$LOG_FILE"
echo "Packages: $PACKAGE_NO_ORG and $PACKAGE_WITH_ORG" >> "$LOG_FILE"
echo "System: $(uname -a)" >> "$LOG_FILE"
echo "Node version: $(node -v)" >> "$LOG_FILE"
echo "NPM version: $(npm -v)" >> "$LOG_FILE"
echo "----------------------------------------" >> "$LOG_FILE"

# 1. Check if package is currently installed
print_header "Checking Current Installation Status"

# Check global installation
if npm list -g "$PACKAGE_NO_ORG" &> /dev/null; then
  print_warning "Non-prefixed package is globally installed. Will be removed."
  echo "Initial state: Non-prefixed package was globally installed" >> "$LOG_FILE"
else
  print_info "Non-prefixed package is not globally installed."
  echo "Initial state: Non-prefixed package was not globally installed" >> "$LOG_FILE"
fi

if npm list -g "$PACKAGE_WITH_ORG" &> /dev/null; then
  print_warning "Prefixed package is globally installed. Will be removed."
  echo "Initial state: Prefixed package was globally installed" >> "$LOG_FILE"
else
  print_info "Prefixed package is not globally installed."
  echo "Initial state: Prefixed package was not globally installed" >> "$LOG_FILE"
fi

# Check local installation
if npm list "$PACKAGE_NO_ORG" &> /dev/null; then
  print_warning "Non-prefixed package is locally installed. Will be removed."
  echo "Initial state: Non-prefixed package was locally installed" >> "$LOG_FILE"
else
  print_info "Non-prefixed package is not locally installed."
  echo "Initial state: Non-prefixed package was not locally installed" >> "$LOG_FILE"
fi

if npm list "$PACKAGE_WITH_ORG" &> /dev/null; then
  print_warning "Prefixed package is locally installed. Will be removed."
  echo "Initial state: Prefixed package was locally installed" >> "$LOG_FILE"
else
  print_info "Prefixed package is not locally installed."
  echo "Initial state: Prefixed package was not locally installed" >> "$LOG_FILE"
fi

# 2. Remove package from npm cache
print_header "Cleaning NPM Cache"
echo "Cleaning npm cache for both package versions..."
npm cache clean --force "$PACKAGE_NO_ORG" >> "$LOG_FILE" 2>&1
npm cache clean --force "$PACKAGE_WITH_ORG" >> "$LOG_FILE" 2>&1
print_success "NPM cache cleaned"

# 3. Remove global installation
print_header "Removing Global Installation"
echo "Removing global installation of both package versions..."
npm uninstall -g "$PACKAGE_NO_ORG" >> "$LOG_FILE" 2>&1
npm uninstall -g "$PACKAGE_WITH_ORG" >> "$LOG_FILE" 2>&1
print_success "Global installation removed (if it existed)"

# 4. Remove local installation
print_header "Removing Local Installation"
echo "Removing local installation of both package versions..."
npm uninstall "$PACKAGE_NO_ORG" >> "$LOG_FILE" 2>&1
npm uninstall "$PACKAGE_WITH_ORG" >> "$LOG_FILE" 2>&1
print_success "Local installation removed (if it existed)"

# 5. Clear npx cache
print_header "Clearing NPX Cache"
echo "Clearing npx cache..."

# On macOS, npx cache is in ~/.npm/_npx
if [[ "$(uname)" == "Darwin" ]]; then
  rm -rf ~/.npm/_npx/*"$PACKAGE_NO_ORG"* >> "$LOG_FILE" 2>&1
  rm -rf ~/.npm/_npx/*"$PACKAGE_WITH_ORG"* >> "$LOG_FILE" 2>&1
  print_success "NPX cache cleared on macOS"
# On Linux, npx cache is also in ~/.npm/_npx
elif [[ "$(uname)" == "Linux" ]]; then
  rm -rf ~/.npm/_npx/*"$PACKAGE_NO_ORG"* >> "$LOG_FILE" 2>&1
  rm -rf ~/.npm/_npx/*"$PACKAGE_WITH_ORG"* >> "$LOG_FILE" 2>&1
  print_success "NPX cache cleared on Linux"
# On Windows, npx cache is in %LOCALAPPDATA%\npm-cache\_npx
elif [[ "$(uname)" == *"MINGW"* ]] || [[ "$(uname)" == *"MSYS"* ]]; then
  rm -rf "$(cygpath "$LOCALAPPDATA")/npm-cache/_npx/*$PACKAGE_NO_ORG*" >> "$LOG_FILE" 2>&1
  rm -rf "$(cygpath "$LOCALAPPDATA")/npm-cache/_npx/*$PACKAGE_WITH_ORG*" >> "$LOG_FILE" 2>&1
  print_success "NPX cache cleared on Windows"
else
  print_warning "Unknown OS, could not clear npx cache specifically. Cleaning entire npm cache instead."
  npm cache clean --force >> "$LOG_FILE" 2>&1
fi

# 6. Verify clean environment
print_header "Verifying Clean Environment"

# Check global installation again
if npm list -g "$PACKAGE_NO_ORG" &> /dev/null || npm list -g "$PACKAGE_WITH_ORG" &> /dev/null; then
  print_error "Package is still globally installed. Cleanup failed."
  echo "Verification failed: Package is still globally installed" >> "$LOG_FILE"
else
  print_success "Package is not globally installed. Cleanup successful."
  echo "Verification passed: Package is not globally installed" >> "$LOG_FILE"
fi

# Check local installation again
if npm list "$PACKAGE_NO_ORG" &> /dev/null || npm list "$PACKAGE_WITH_ORG" &> /dev/null; then
  print_error "Package is still locally installed. Cleanup failed."
  echo "Verification failed: Package is still locally installed" >> "$LOG_FILE"
else
  print_success "Package is not locally installed. Cleanup successful."
  echo "Verification passed: Package is not locally installed" >> "$LOG_FILE"
fi

# 7. Test npx command
print_header "Testing NPX Command"
echo "Testing npx command to run both package versions..."
echo "----------------------------------------" >> "$LOG_FILE"
echo "NPX TEST OUTPUT:" >> "$LOG_FILE"

# Function to test a specific package
test_npx_command() {
  local PACKAGE=$1
  local PACKAGE_DESC=$2
  
  print_header "Testing NPX Command With $PACKAGE_DESC"
  
  # Check if config file exists
  SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
  CONFIG_PATH="$SCRIPT_DIR/../examples/mcp-config.json"
  
  if [ -f "$CONFIG_PATH" ]; then
    print_info "Found config file at $CONFIG_PATH"
    echo "Using config file: $CONFIG_PATH" >> "$LOG_FILE"
    
    # Run npx command with config
    echo "Running: npx -y $PACKAGE --config $CONFIG_PATH --verbose"
    echo "Command: npx -y $PACKAGE --config $CONFIG_PATH --verbose" >> "$LOG_FILE"
    
    # Run the command
    print_info "Running npx command (this may take a moment)..."
    npx_output=$(npx -y "$PACKAGE" --config "$CONFIG_PATH" --verbose 2>&1)
    npx_exit_code=$?
    
    # Log the output
    echo "$npx_output" >> "$LOG_FILE"
    
    # Check if npx command was successful
    if [ $npx_exit_code -eq 0 ]; then
      print_success "NPX command executed successfully (exit code: $npx_exit_code)"
      echo "NPX command executed successfully (exit code: $npx_exit_code)" >> "$LOG_FILE"
    else
      print_error "NPX command failed (exit code: $npx_exit_code)"
      echo "NPX command failed (exit code: $npx_exit_code)" >> "$LOG_FILE"
      echo "Error output: $npx_output"
    fi
  else
    print_warning "Config file not found at $CONFIG_PATH. Running without config."
    echo "Config file not found. Running without config." >> "$LOG_FILE"
    
    # Run npx command without config
    echo "Running: npx -y $PACKAGE --verbose"
    echo "Command: npx -y $PACKAGE --verbose" >> "$LOG_FILE"
    
    # Run the command
    print_info "Running npx command (this may take a moment)..."
    npx_output=$(npx -y "$PACKAGE" --verbose 2>&1)
    npx_exit_code=$?
    
    # Log the output
    echo "$npx_output" >> "$LOG_FILE"
    
    # Check if npx command was successful
    if [ $npx_exit_code -eq 0 ]; then
      print_success "NPX command executed successfully (exit code: $npx_exit_code)"
      echo "NPX command executed successfully (exit code: $npx_exit_code)" >> "$LOG_FILE"
    else
      print_error "NPX command failed (exit code: $npx_exit_code)"
      echo "NPX command failed (exit code: $npx_exit_code)" >> "$LOG_FILE"
      echo "Error output: $npx_output"
    fi
  fi
}

# Test both package versions
test_npx_command "$PACKAGE_NO_ORG" "Current Version (1.1.1, no org prefix)"
test_npx_command "$PACKAGE_WITH_ORG" "Previous Version (1.0.4, with org prefix)"

# 8. Check if package was installed by npx
print_header "Checking NPX Installation"

# Check if npx installed the packages in the global or local node_modules
# Check if npx installed the packages in the global or local node_modules

if npm list -g "$PACKAGE_NO_ORG" &> /dev/null; then
  print_info "NPX installed the non-prefixed package globally."
  echo "NPX installed the non-prefixed package globally" >> "$LOG_FILE"
else
  print_info "NPX did not install the non-prefixed package globally."
  echo "NPX did not install the non-prefixed package globally" >> "$LOG_FILE"
fi

if npm list -g "$PACKAGE_WITH_ORG" &> /dev/null; then
  print_info "NPX installed the prefixed package globally."
  echo "NPX installed the prefixed package globally" >> "$LOG_FILE"
else
  print_info "NPX did not install the prefixed package globally."
  echo "NPX did not install the prefixed package globally" >> "$LOG_FILE"
fi

# Check for temporary npx installation
NPX_TEMP_DIR=$(npm config get cache)/_npx
if [ -d "$NPX_TEMP_DIR" ]; then
  # Check for non-prefixed package
  if find "$NPX_TEMP_DIR" -name "*$PACKAGE_NO_ORG*" -type d 2>/dev/null | grep -q .; then
    print_info "NPX created a temporary installation for the non-prefixed package."
    echo "NPX created a temporary installation for the non-prefixed package" >> "$LOG_FILE"
    
    # List the temporary installation directories
    temp_dirs=$(find "$NPX_TEMP_DIR" -name "*$PACKAGE_NO_ORG*" -type d 2>/dev/null)
    echo "Temporary installation directories for non-prefixed package:" >> "$LOG_FILE"
    echo "$temp_dirs" >> "$LOG_FILE"
  else
    print_info "No temporary NPX installation found for the non-prefixed package."
    echo "No temporary NPX installation found for the non-prefixed package" >> "$LOG_FILE"
  fi
  
  # Check for prefixed package
  if find "$NPX_TEMP_DIR" -name "*$PACKAGE_WITH_ORG*" -type d 2>/dev/null | grep -q .; then
    print_info "NPX created a temporary installation for the prefixed package."
    echo "NPX created a temporary installation for the prefixed package" >> "$LOG_FILE"
    
    # List the temporary installation directories
    temp_dirs=$(find "$NPX_TEMP_DIR" -name "*$PACKAGE_WITH_ORG*" -type d 2>/dev/null)
    echo "Temporary installation directories for prefixed package:" >> "$LOG_FILE"
    echo "$temp_dirs" >> "$LOG_FILE"
  else
    print_info "No temporary NPX installation found for the prefixed package."
    echo "No temporary NPX installation found for the prefixed package" >> "$LOG_FILE"
  fi
else
  print_warning "NPX temporary directory not found at $NPX_TEMP_DIR"
  echo "NPX temporary directory not found at $NPX_TEMP_DIR" >> "$LOG_FILE"
fi

# 9. Summary
print_header "Summary"
echo "----------------------------------------" >> "$LOG_FILE"
echo "SUMMARY:" >> "$LOG_FILE"

print_info "NPM environment cleaning completed."
echo "NPM environment cleaning completed" >> "$LOG_FILE"

print_info "NPX test completed. See $LOG_FILE for detailed results."
echo "NPX test completed at $(date)" >> "$LOG_FILE"

print_info "The script performed the following actions:"
echo "1. Removed the package from local npm cache" >> "$LOG_FILE"
echo "2. Removed the package from global npm installation" >> "$LOG_FILE"
echo "3. Cleared temporary npx cache" >> "$LOG_FILE"
echo "4. Tested the npx command" >> "$LOG_FILE"
echo "5. Documented the process and results in $LOG_FILE" >> "$LOG_FILE"

print_success "All tasks completed!"