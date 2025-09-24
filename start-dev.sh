#!/bin/bash

# Development startup script for Phrasing Craft
# Starts both backend and frontend servers

echo "🚀 Starting Phrasing Craft Development Environment"
echo "================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to start backend
start_backend() {
    echo -e "\n${BLUE}Starting Backend Server...${NC}"
    cd api
    go run main.go &
    BACKEND_PID=$!
    echo -e "${GREEN}✅ Backend started on http://localhost:8080 (PID: $BACKEND_PID)${NC}"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo -e "\n${BLUE}Starting Frontend Server...${NC}"
    cd ui
    npm run dev &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend started on http://localhost:3000 (PID: $FRONTEND_PID)${NC}"
    cd ..
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo -e "${GREEN}✅ Backend stopped${NC}"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}✅ Frontend stopped${NC}"
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start servers
start_backend
sleep 2
start_frontend

echo -e "\n${GREEN}🎉 Development environment ready!${NC}"
echo -e "${YELLOW}Backend:  http://localhost:8080${NC}"
echo -e "${YELLOW}Frontend: http://localhost:3000${NC}"
echo -e "\n${BLUE}Press Ctrl+C to stop both servers${NC}"

# Wait for user interrupt
wait
