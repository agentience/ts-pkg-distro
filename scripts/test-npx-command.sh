#!/bin/bash

# Script to test the npx command for @agentience/ts-pkg-distro
# This script runs the npx command with a 10-second timeout

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

# Test both package names
# Previous releases were published as 'ts-pkg-distro' (without organization prefix)
# because there was no mcp-config.json file in the root directory.
# Future releases will be published as '@agentience/ts-pkg-distro' (with organization prefix)
# because we've added mcp-config.json with npm-org set to "agentience".

# Function to test a specific package
test_package() {
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
    
    # Run in background with timeout
    print_info "Running with 10-second timeout..."
    (npx -y "$PACKAGE" --config "$CONFIG_PATH" --verbose > >(tee -a "$LOG_FILE") 2>&1) &
    NPX_PID=$!
    
    # Wait for 10 seconds then kill if still running
    sleep 10
    if kill -0 $NPX_PID 2>/dev/null; then
      kill $NPX_PID
      print_warning "NPX command was terminated after 10 seconds"
      echo "NPX command was terminated after 10 seconds" >> "$LOG_FILE"
    else
      print_success "NPX command completed within timeout"
      echo "NPX command completed within timeout" >> "$LOG_FILE"
    fi
  else
    print_warning "Config file not found at $CONFIG_PATH. Testing without config."
    echo "Config file not found. Testing without config." >> "$LOG_FILE"
    
    # Run npx command without config
    echo "Running: npx -y $PACKAGE --verbose"
    echo "Command: npx -y $PACKAGE --verbose" >> "$LOG_FILE"
    
    # Run in background with timeout
    print_info "Running with 10-second timeout..."
    (npx -y "$PACKAGE" --verbose > >(tee -a "$LOG_FILE") 2>&1) &
    NPX_PID=$!
    
    # Wait for 10 seconds then kill if still running
    sleep 10
    if kill -0 $NPX_PID 2>/dev/null; then
      kill $NPX_PID
      print_warning "NPX command was terminated after 10 seconds"
      echo "NPX command was terminated after 10 seconds" >> "$LOG_FILE"
    else
      print_success "NPX command completed within timeout"
      echo "NPX command completed within timeout" >> "$LOG_FILE"
    fi
  fi
  
  # Check if package was installed by npx
  print_header "Checking NPX Installation for $PACKAGE_DESC"
  
  # Check if npx installed the package in the global or local node_modules
  if npm list -g "$PACKAGE" &> /dev/null; then
    print_info "NPX installed the package globally."
    echo "NPX installed the package globally" >> "$LOG_FILE"
  else
    print_info "NPX did not install the package globally."
    echo "NPX did not install the package globally" >> "$LOG_FILE"
  fi
  
  # Check for temporary npx installation
  NPX_TEMP_DIR=$(npm config get cache)/_npx
  if [ -d "$NPX_TEMP_DIR" ]; then
    if find "$NPX_TEMP_DIR" -name "*$PACKAGE*" -type d 2>/dev/null | grep -q .; then
      print_info "NPX created a temporary installation."
      echo "NPX created a temporary installation" >> "$LOG_FILE"
      
      # List the temporary installation directories
      temp_dirs=$(find "$NPX_TEMP_DIR" -name "*$PACKAGE*" -type d 2>/dev/null)
      echo "Temporary installation directories:" >> "$LOG_FILE"
      echo "$temp_dirs" >> "$LOG_FILE"
      print_info "Temporary installation directories: $temp_dirs"
    else
      print_info "No temporary NPX installation found."
      echo "No temporary NPX installation found" >> "$LOG_FILE"
    fi
  else
    print_warning "NPX temporary directory not found at $NPX_TEMP_DIR"
    echo "NPX temporary directory not found at $NPX_TEMP_DIR" >> "$LOG_FILE"
  fi
}

# Log file
LOG_FILE="npx-command-test.log"

# Start logging
echo "NPX Command Test - $(date)" > "$LOG_FILE"
echo "Package: $PACKAGE" >> "$LOG_FILE"
echo "System: $(uname -a)" >> "$LOG_FILE"
echo "Node version: $(node -v)" >> "$LOG_FILE"
echo "NPM version: $(npm -v)" >> "$LOG_FILE"
echo "----------------------------------------" >> "$LOG_FILE"

# Test both package versions
test_package "ts-pkg-distro" "Current Version (1.1.1, no org prefix)"
test_package "@agentience/ts-pkg-distro" "Previous Version (1.0.4, with org prefix)"

# Summary
print_header "Summary"
echo "----------------------------------------" >> "$LOG_FILE"
echo "SUMMARY:" >> "$LOG_FILE"

print_info "NPX test completed. See $LOG_FILE for detailed results."
echo "NPX test completed at $(date)" >> "$LOG_FILE"

print_success "Test completed!"