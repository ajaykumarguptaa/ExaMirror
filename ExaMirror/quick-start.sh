#!/bin/bash

# ExamBook Quick Start Script
# This script helps you quickly set up and test the ExamBook application

set -e

echo "🚀 ExamBook Quick Start Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check prerequisites
print_step "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"
print_status "npm version: $(npm -v)"

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        print_status "MongoDB is running"
    else
        print_warning "MongoDB is not running. You'll need to start it or use MongoDB Atlas."
    fi
else
    print_warning "MongoDB is not installed. You'll need to install it or use MongoDB Atlas."
fi

# Setup backend
print_step "Setting up backend..."

cd backend

# Check if .env exists
if [ ! -f .env ]; then
    print_warning "Creating .env file from example..."
    if [ -f env.example ]; then
        cp env.example .env
        print_warning "Please edit backend/.env with your settings:"
        echo "  - MONGODB_URI (use MongoDB Atlas for production)"
        echo "  - JWT_SECRET (change to a strong secret)"
        echo "  - EMAIL settings (for email verification)"
        read -p "Press Enter after editing .env file..."
    else
        print_error "env.example not found in backend directory"
        exit 1
    fi
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
npm install

cd ..

# Setup frontend
print_step "Setting up frontend..."

# Check if .env exists
if [ ! -f .env ]; then
    print_warning "Creating .env file from example..."
    if [ -f env.example ]; then
        cp env.example .env
        print_status "Frontend .env created with default settings"
    else
        print_error "env.example not found in frontend directory"
        exit 1
    fi
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install

print_step "Setup completed! 🎉"

echo ""
echo "Next steps:"
echo "==========="
echo "1. Start MongoDB (if using local MongoDB):"
echo "   mongod"
echo ""
echo "2. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "4. Open your browser and go to:"
echo "   http://localhost:3000"
echo ""
echo "5. Default admin credentials:"
echo "   Email: admin@exambook.com"
echo "   Password: admin123"
echo ""
echo "For production deployment, see PRODUCTION.md"
echo ""

# Ask if user wants to start services now
read -p "Would you like to start the services now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Starting services..."
    
    # Start backend in background
    print_status "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 5
    
    # Check if backend is running
    if curl -f http://localhost:5000/api/health &> /dev/null; then
        print_status "Backend is running on http://localhost:5000"
    else
        print_error "Backend failed to start. Check the logs above."
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    # Start frontend
    print_status "Starting frontend server..."
    npm run dev &
    FRONTEND_PID=$!
    
    # Wait for frontend to start
    sleep 3
    
    print_status "Frontend is starting on http://localhost:3000"
    print_status "Backend PID: $BACKEND_PID"
    print_status "Frontend PID: $FRONTEND_PID"
    
    echo ""
    print_status "🎉 ExamBook is now running!"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:5000"
    echo ""
    echo "Press Ctrl+C to stop all services"
    
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
    wait
else
    print_status "Setup completed. You can start the services manually when ready."
fi 