#!/bin/bash

# Intelligent LRT Setup Script
# This script automates the complete setup of the Intelligent LRT application

echo "🚆 Intelligent LRT Setup Script"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js v14 or higher."
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Install main project dependencies
install_main_deps() {
    print_status "Installing main project dependencies..."
    if npm install; then
        print_success "Main project dependencies installed successfully"
    else
        print_error "Failed to install main project dependencies"
        exit 1
    fi
}

# Install server dependencies
install_server_deps() {
    print_status "Installing server dependencies..."
    cd server
    if npm install; then
        print_success "Server dependencies installed successfully"
    else
        print_error "Failed to install server dependencies"
        exit 1
    fi
    cd ..
}

# Install database dependencies
install_database_deps() {
    print_status "Installing database dependencies..."
    cd database
    if npm install; then
        print_success "Database dependencies installed successfully"
    else
        print_error "Failed to install database dependencies"
        exit 1
    fi
    cd ..
}

# Test MongoDB connection
test_mongodb() {
    print_status "Testing MongoDB connection..."
    cd database
    if node test-connection.js; then
        print_success "MongoDB connection test successful"
    else
        print_error "MongoDB connection test failed"
        print_warning "Please check your MongoDB Atlas connection and try again"
        exit 1
    fi
    cd ..
}

# Setup database
setup_database() {
    print_status "Setting up database with initial data..."
    cd database
    if node setup-database.js; then
        print_success "Database setup completed successfully"
    else
        print_error "Database setup failed"
        exit 1
    fi
    cd ..
}

# Check if Expo CLI is installed
check_expo() {
    print_status "Checking Expo CLI installation..."
    if command -v expo &> /dev/null; then
        print_success "Expo CLI found"
    else
        print_warning "Expo CLI not found. Installing globally..."
        if npm install -g @expo/cli; then
            print_success "Expo CLI installed successfully"
        else
            print_error "Failed to install Expo CLI"
            print_warning "You can still run the app with 'npx expo start'"
        fi
    fi
}

# Main setup function
main() {
    echo "Starting Intelligent LRT setup..."
    echo ""

    # Check prerequisites
    check_node
    check_npm
    check_expo

    echo ""
    print_status "Installing dependencies..."

    # Install all dependencies
    install_main_deps
    install_server_deps
    install_database_deps

    echo ""
    print_status "Testing database connection..."

    # Test and setup database
    test_mongodb
    setup_database

    echo ""
    print_success "Setup completed successfully!"
    echo ""
    echo "🎉 Intelligent LRT is ready to run!"
    echo ""
    echo "Next steps:"
    echo "1. Start the backend server:"
    echo "   cd server && node server.js"
    echo ""
    echo "2. In a new terminal, start the mobile app:"
    echo "   npx expo start"
    echo ""
    echo "3. Scan the QR code with Expo Go app on your mobile device"
    echo ""
    echo "Sample users created:"
    echo "- Admin: admin@lrt.com (role: admin)"
    echo "- Super Admin: superadmin@lrt.com (role: superAdmin)"
    echo "- Regular User: user@lrt.com (role: user)"
    echo ""
    echo "For detailed instructions, see: database/README.md"
}

# Run main function
main 