#!/bin/bash

# FlowChat Installation Script
# This script installs all dependencies for both frontend and backend

echo "📦 Installing FlowChat Dependencies..."
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Install Backend Dependencies
echo -e "${BLUE}🔧 Installing Backend Dependencies...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi
cd ..
echo ""

# Install Frontend Dependencies
echo -e "${BLUE}💻 Installing Frontend Dependencies...${NC}"
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi
cd ..
echo ""

echo -e "${GREEN}🎉 All dependencies installed successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Make sure MongoDB is running"
echo "2. Configure .env files (backend/.env and frontend/.env.local)"
echo "3. Run './scripts/start-dev.sh' to start development servers"
echo ""

