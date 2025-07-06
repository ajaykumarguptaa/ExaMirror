#!/bin/bash

# ExamBook Production Deployment Script
# This script helps deploy the application to production

set -e  # Exit on any error

echo "🚀 Starting ExamBook Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_status "npm version: $(npm -v)"

# Function to setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Check if .env exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from example..."
        if [ -f env.example ]; then
            cp env.example .env
            print_warning "Please edit .env file with your production settings before continuing."
            read -p "Press Enter after editing .env file..."
        else
            print_error "env.example not found. Please create .env file manually."
            exit 1
        fi
    fi
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install --production
    
    # Run tests if available
    if npm run test &> /dev/null; then
        print_status "Running backend tests..."
        npm test
    else
        print_warning "No tests configured for backend"
    fi
    
    cd ..
}

# Function to setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    # Check if .env exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from example..."
        if [ -f env.example ]; then
            cp env.example .env
            print_warning "Please edit .env file with your production settings before continuing."
            read -p "Press Enter after editing .env file..."
        else
            print_error "env.example not found. Please create .env file manually."
            exit 1
        fi
    fi
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Build for production
    print_status "Building frontend for production..."
    npm run build
    
    print_status "Frontend build completed successfully!"
}

# Function to start services
start_services() {
    print_status "Starting services..."
    
    # Start backend
    print_status "Starting backend server..."
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 5
    
    # Check if backend is running
    if curl -f http://localhost:5000/api/health &> /dev/null; then
        print_status "Backend is running on http://localhost:5000"
    else
        print_error "Backend failed to start"
        exit 1
    fi
    
    # Start frontend
    print_status "Starting frontend server..."
    npm start &
    FRONTEND_PID=$!
    
    # Wait for frontend to start
    sleep 3
    
    # Check if frontend is running
    if curl -f http://localhost:3000 &> /dev/null; then
        print_status "Frontend is running on http://localhost:3000"
    else
        print_error "Frontend failed to start"
        exit 1
    fi
    
    print_status "All services are running!"
    print_status "Backend PID: $BACKEND_PID"
    print_status "Frontend PID: $FRONTEND_PID"
    
    # Function to cleanup on exit
    cleanup() {
        print_status "Shutting down services..."
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        exit 0
    }
    
    # Set up signal handlers
    trap cleanup SIGINT SIGTERM
    
    # Keep script running
    print_status "Press Ctrl+C to stop all services"
    wait
}

# Function to show help
show_help() {
    echo "ExamBook Production Deployment Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  setup     - Setup both backend and frontend"
    echo "  backend   - Setup only backend"
    echo "  frontend  - Setup only frontend"
    echo "  start     - Start all services"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup    # Setup everything"
    echo "  $0 start    # Start all services"
    echo "  $0 backend  # Setup only backend"
}

# Main script logic
case "${1:-setup}" in
    "setup")
        setup_backend
        setup_frontend
        print_status "Setup completed successfully!"
        ;;
    "backend")
        setup_backend
        print_status "Backend setup completed!"
        ;;
    "frontend")
        setup_frontend
        print_status "Frontend setup completed!"
        ;;
    "start")
        start_services
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac 