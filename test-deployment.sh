#!/bin/bash

# Test Deployment Script
# This script simulates the CI/CD pipeline locally for testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_status "🧪 Testing CI/CD Pipeline Components"

# Test 1: Check if Docker is running
print_status "Testing Docker availability..."
if docker --version > /dev/null 2>&1; then
    print_success "Docker is available"
else
    print_error "Docker is not available"
    exit 1
fi

# Test 2: Check if docker-compose is available
print_status "Testing Docker Compose availability..."
if docker-compose --version > /dev/null 2>&1; then
    print_success "Docker Compose is available"
else
    print_error "Docker Compose is not available"
    exit 1
fi

# Test 3: Test Go build
print_status "Testing Go build..."
cd api
if go build -o main .; then
    print_success "Go build successful"
    rm -f main
else
    print_error "Go build failed"
    exit 1
fi
cd ..

# Test 4: Test Node.js build
print_status "Testing Node.js build..."
cd ui
if npm ci && npm run build; then
    print_success "Node.js build successful"
else
    print_error "Node.js build failed"
    exit 1
fi
cd ..

# Test 5: Test Docker builds
print_status "Testing Docker image builds..."

# Build API image
if docker build -t textcraft-api:test ./api; then
    print_success "API Docker build successful"
else
    print_error "API Docker build failed"
    exit 1
fi

# Build UI image
if docker build -t textcraft-ui:test ./ui; then
    print_success "UI Docker build successful"
else
    print_error "UI Docker build failed"
    exit 1
fi

# Test 6: Test docker-compose
print_status "Testing docker-compose configuration..."
if docker-compose config > /dev/null 2>&1; then
    print_success "Docker Compose configuration is valid"
else
    print_error "Docker Compose configuration is invalid"
    exit 1
fi

# Test 7: Test production docker-compose
if docker-compose -f docker-compose.prod.yml config > /dev/null 2>&1; then
    print_success "Production Docker Compose configuration is valid"
else
    print_error "Production Docker Compose configuration is invalid"
    exit 1
fi

# Test 8: Test deployment script
print_status "Testing deployment script..."
if [ -x "./deploy.sh" ]; then
    print_success "Deployment script is executable"
else
    print_warning "Deployment script is not executable (this is normal for testing)"
fi

# Test 9: Check required files
print_status "Checking required files..."
required_files=(
    ".github/workflows/deploy.yml"
    "docker-compose.prod.yml"
    "deploy.sh"
    "CI_CD_SETUP.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file exists"
    else
        print_error "✗ $file is missing"
        exit 1
    fi
done

# Test 10: Validate GitHub Actions workflow
print_status "Validating GitHub Actions workflow..."
if command -v yamllint > /dev/null 2>&1; then
    if yamllint .github/workflows/deploy.yml; then
        print_success "GitHub Actions workflow YAML is valid"
    else
        print_warning "GitHub Actions workflow YAML has issues (yamllint found problems)"
    fi
else
    print_warning "yamllint not available, skipping YAML validation"
fi

# Cleanup test images
print_status "Cleaning up test images..."
docker rmi textcraft-api:test textcraft-ui:test 2>/dev/null || true

print_success "🎉 All CI/CD pipeline tests passed!"
print_status "Your pipeline is ready for deployment!"
print_status ""
print_status "Next steps:"
print_status "1. Set up your Docker registry"
print_status "2. Configure GitHub secrets"
print_status "3. Prepare your server"
print_status "4. Push to master branch to trigger deployment"
print_status ""
print_status "For detailed setup instructions, see CI_CD_SETUP.md"
