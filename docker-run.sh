#!/bin/bash

# TextCraft Docker Runner Script
# Usage: ./docker-run.sh [dev|prod|stop|clean]

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

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev     Start in development mode with hot reloading"
    echo "  prod    Start in production mode"
    echo "  stop    Stop all running containers"
    echo "  clean   Stop containers and remove images/volumes"
    echo "  logs    Show logs for all services"
    echo "  status  Show status of all services"
    echo ""
    echo "Examples:"
    echo "  $0 dev     # Start development environment"
    echo "  $0 prod    # Start production environment"
    echo "  $0 stop    # Stop all services"
    echo "  $0 clean   # Clean up everything"
}

# Function to start development environment
start_dev() {
    print_status "Starting TextCraft in development mode..."
    check_docker
    
    docker-compose -f docker-compose.dev.yml up --build -d
    
    print_success "Development environment started!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:8080"
    echo "📊 Health Check: http://localhost:8080/health"
    echo ""
    print_status "Use 'docker-compose -f docker-compose.dev.yml logs -f' to view logs"
}

# Function to start production environment
start_prod() {
    print_status "Starting TextCraft in production mode..."
    check_docker
    
    docker-compose up --build -d
    
    print_success "Production environment started!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:8080"
    echo "📊 Health Check: http://localhost:8080/health"
    echo ""
    print_status "Use 'docker-compose logs -f' to view logs"
}

# Function to stop all services
stop_services() {
    print_status "Stopping all TextCraft services..."
    
    # Stop production services
    docker-compose down 2>/dev/null || true
    
    # Stop development services
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    
    print_success "All services stopped!"
}

# Function to clean up everything
clean_up() {
    print_warning "This will remove all containers, images, and volumes. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up TextCraft..."
        
        # Stop and remove containers
        docker-compose down -v 2>/dev/null || true
        docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
        
        # Remove images
        docker rmi textcraft-api textcraft-ui 2>/dev/null || true
        docker rmi textcraft-api-dev textcraft-ui-dev 2>/dev/null || true
        
        # Clean up unused resources
        docker system prune -f
        
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing logs for all services..."
    
    if docker-compose ps | grep -q "Up"; then
        docker-compose logs -f
    elif docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        print_warning "No services are currently running."
    fi
}

# Function to show status
show_status() {
    print_status "Service Status:"
    echo ""
    
    echo "Production Services:"
    docker-compose ps 2>/dev/null || echo "  No production services running"
    echo ""
    
    echo "Development Services:"
    docker-compose -f docker-compose.dev.yml ps 2>/dev/null || echo "  No development services running"
}

# Main script logic
case "${1:-}" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "stop")
        stop_services
        ;;
    "clean")
        clean_up
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    "")
        print_error "No command specified."
        echo ""
        show_usage
        exit 1
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac
