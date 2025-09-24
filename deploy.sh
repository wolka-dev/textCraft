#!/bin/bash

# TextCraft Deployment Script
# Usage: ./deploy.sh [environment]

set -e

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

# Default values
ENVIRONMENT=${1:-production}
REGISTRY_URL=${REGISTRY_URL:-"your-registry.com"}
IMAGE_TAG=${IMAGE_TAG:-"latest"}
APP_DIR="/opt/textcraft"

# Validate required environment variables
if [ -z "$GROQ_API_KEY" ]; then
    print_error "GROQ_API_KEY environment variable is required"
    exit 1
fi

if [ -z "$REGISTRY_URL" ] || [ "$REGISTRY_URL" = "your-registry.com" ]; then
    print_error "REGISTRY_URL environment variable must be set"
    exit 1
fi

print_status "Starting deployment for environment: $ENVIRONMENT"
print_status "Registry: $REGISTRY_URL"
print_status "Image tag: $IMAGE_TAG"

# Create application directory
print_status "Creating application directory..."
mkdir -p $APP_DIR
cd $APP_DIR

# Create .env file for docker-compose
print_status "Creating environment file..."
cat > .env << EOF
REGISTRY_URL=$REGISTRY_URL
GROQ_API_KEY=$GROQ_API_KEY
IMAGE_TAG=$IMAGE_TAG
EOF

# Pull latest images
print_status "Pulling latest images..."
docker pull $REGISTRY_URL/textcraft-api:$IMAGE_TAG
docker pull $REGISTRY_URL/textcraft-ui:$IMAGE_TAG

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Start new containers
print_status "Starting new containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 15

# Health check
print_status "Performing health checks..."

# Check API health
if curl -f http://localhost:8081/health > /dev/null 2>&1; then
    print_success "API is healthy"
else
    print_error "API health check failed"
    docker-compose -f docker-compose.prod.yml logs api
    exit 1
fi

# Check UI health
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    print_success "UI is healthy"
else
    print_error "UI health check failed"
    docker-compose -f docker-compose.prod.yml logs ui
    exit 1
fi

# Clean up old images
print_status "Cleaning up old images..."
docker image prune -f

# Show running containers
print_status "Running containers:"
docker-compose -f docker-compose.prod.yml ps

print_success "Deployment completed successfully!"
print_status "Application URLs:"
print_status "  API: http://$(hostname -I | awk '{print $1}'):8081"
print_status "  UI: http://$(hostname -I | awk '{print $1}'):3001"
print_status "  Health Check: http://$(hostname -I | awk '{print $1}'):8081/health"
