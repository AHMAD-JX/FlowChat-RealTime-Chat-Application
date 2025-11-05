#!/bin/bash

# FlowChat Development Startup Script
# This script starts both frontend and backend in development mode

echo "🚀 Starting FlowChat Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo -e "${BLUE}📊 Checking MongoDB...${NC}"
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${RED}❌ MongoDB is not running!${NC}"
    echo -e "${BLUE}Starting MongoDB...${NC}"
    
    # Try to start MongoDB (Linux/macOS)
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
    elif command -v brew &> /dev/null; then
        brew services start mongodb-community
    else
        mongod &
    fi
    
    sleep 2
fi

echo -e "${GREEN}✅ MongoDB is running${NC}"
echo ""

# Start Backend
echo -e "${BLUE}🔧 Starting Backend Server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
cd ..
echo ""

# Wait for backend to start
sleep 3

# Start Frontend
echo -e "${BLUE}💻 Starting Frontend Application...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
cd ..
echo ""

echo -e "${GREEN}🎉 FlowChat is now running!${NC}"
echo ""
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}Backend:${NC}  http://localhost:5000"
echo -e "${BLUE}API Docs:${NC} http://localhost:5000/api/health"
echo ""
echo -e "${RED}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for Ctrl+C
trap "echo -e '\n${RED}Stopping all services...${NC}'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

