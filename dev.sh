#!/bin/bash
# VidX Marketplace - Quick Development Script
# Run local development server with auto-reload

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 VidX Marketplace - Local Development Server${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file. Please update with your values.${NC}"
    echo ""
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Virtual environment not found. Creating...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✅ Virtual environment created${NC}"
    echo ""
fi

# Activate virtual environment
echo -e "${BLUE}🔧 Activating virtual environment...${NC}"
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/.deps_installed" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    pip install -r requirements.txt
    touch venv/.deps_installed
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    echo ""
fi

# Start the server
echo -e "${GREEN}✅ Starting Flask development server...${NC}"
echo -e "${BLUE}📍 Running at http://127.0.0.1:5000${NC}"
echo -e "${YELLOW}💡 Press Ctrl+C to stop${NC}"
echo ""

# Run with Flask development server for auto-reload
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --host=127.0.0.1 --port=5000 --reload
