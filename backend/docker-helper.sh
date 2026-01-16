#!/bin/bash

# Alpine Ecommerce Backend - Docker Helper Script
# Usage: ./docker-helper.sh [command]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if .env file exists
check_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found!"
        print_info "Please create .env file with required environment variables"
        print_info "See ENV_VARIABLES.md for reference"
        exit 1
    fi
}

# Build production image
build_prod() {
    print_header "Building Production Docker Image"
    docker build -t alpine-backend:latest .
    print_success "Production image built successfully"
}

# Build development image
build_dev() {
    print_header "Building Development Docker Image"
    docker build -f Dockerfile.dev -t alpine-backend:dev .
    print_success "Development image built successfully"
}

# Start production
start_prod() {
    print_header "Starting Production Environment"
    check_env
    docker-compose up -d
    print_success "Production environment started"
    print_info "API available at: http://localhost:8081/api/v1/docs"
    print_info "View logs: docker-compose logs -f api"
}

# Start development
start_dev() {
    print_header "Starting Development Environment"
    check_env
    docker-compose -f docker-compose.dev.yml up
}

# Stop services
stop() {
    print_header "Stopping Services"
    docker-compose down
    print_success "Services stopped"
}

# View logs
logs() {
    SERVICE=${2:-api}
    print_header "Viewing Logs for $SERVICE"
    docker-compose logs -f $SERVICE
}

# Restart service
restart() {
    SERVICE=${2:-api}
    print_header "Restarting $SERVICE"
    docker-compose restart $SERVICE
    print_success "$SERVICE restarted"
}

# Rebuild and restart
rebuild() {
    print_header "Rebuilding and Restarting"
    check_env
    docker-compose up -d --build
    print_success "Services rebuilt and restarted"
}

# Execute command in container
exec_cmd() {
    SERVICE=${2:-api}
    CMD=${3:-sh}
    print_header "Executing command in $SERVICE"
    docker-compose exec $SERVICE $CMD
}

# Show status
status() {
    print_header "Container Status"
    docker-compose ps
}

# Clean up
clean() {
    print_header "Cleaning Up"
    print_warning "This will remove containers, networks, and volumes"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        print_success "Cleanup completed"
    else
        print_info "Cleanup cancelled"
    fi
}

# Backup
backup() {
    print_header "Creating Backup"
    BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p $BACKUP_DIR
    
    # Backup database
    print_info "Backing up database..."
    docker-compose exec -T postgres pg_dump -U postgres alpine_ecommerce > $BACKUP_DIR/database.sql 2>/dev/null || print_warning "Database backup skipped (postgres not running)"
    
    # Backup uploads
    print_info "Backing up uploads..."
    if [ -d "./alpine-uploads" ]; then
        cp -r ./alpine-uploads $BACKUP_DIR/uploads 2>/dev/null || print_warning "Uploads backup skipped"
    fi
    
    # Backup env
    if [ -f .env ]; then
        cp .env $BACKUP_DIR/.env
    fi
    
    print_success "Backup created: $BACKUP_DIR"
}

# Show help
show_help() {
    echo "Alpine Ecommerce Backend - Docker Helper"
    echo ""
    echo "Usage: ./docker-helper.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build-prod      Build production Docker image"
    echo "  build-dev       Build development Docker image"
    echo "  start-prod      Start production environment"
    echo "  start-dev       Start development environment"
    echo "  stop            Stop all services"
    echo "  logs [service]  View logs (default: api)"
    echo "  restart [svc]   Restart service (default: api)"
    echo "  rebuild         Rebuild and restart services"
    echo "  exec [svc] [cmd] Execute command in container"
    echo "  status          Show container status"
    echo "  clean           Remove containers and volumes"
    echo "  backup          Create backup"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./docker-helper.sh start-prod"
    echo "  ./docker-helper.sh logs postgres"
    echo "  ./docker-helper.sh exec api sh"
    echo "  ./docker-helper.sh backup"
}

# Main
case "$1" in
    build-prod)
        build_prod
        ;;
    build-dev)
        build_dev
        ;;
    start-prod)
        start_prod
        ;;
    start-dev)
        start_dev
        ;;
    stop)
        stop
        ;;
    logs)
        logs "$@"
        ;;
    restart)
        restart "$@"
        ;;
    rebuild)
        rebuild
        ;;
    exec)
        exec_cmd "$@"
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    backup)
        backup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac

