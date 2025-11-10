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
    echo -e "${GREEN}✅ Created .env file${NC}"
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
    echo -e "${BLUE}📦 Installing Python dependencies...${NC}"
    pip install -r requirements.txt
    touch venv/.deps_installed
    echo -e "${GREEN}✅ Python dependencies installed${NC}"
    echo ""
fi

# Download Tailwind CSS standalone binary if needed
if [ ! -f "tailwindcss" ]; then
    echo -e "${BLUE}� Downloading Tailwind CSS standalone binary...${NC}"
    curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-macos-arm64
    chmod +x tailwindcss-macos-arm64
    mv tailwindcss-macos-arm64 tailwindcss
    echo -e "${GREEN}✅ Tailwind CSS downloaded${NC}"
    echo ""
fi

# Build Tailwind CSS initially
echo -e "${BLUE}🎨 Building Tailwind CSS...${NC}"
./tailwindcss -i ./static/css/input.css -o ./static/css/output.css --minify
echo -e "${GREEN}✅ Tailwind CSS compiled${NC}"
echo ""

# Start Tailwind CSS watcher in background
echo -e "${BLUE}🎨 Starting Tailwind CSS watcher...${NC}"
./tailwindcss -i ./static/css/input.css -o ./static/css/output.css --watch &
TAILWIND_PID=$!

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping servers...${NC}"
    kill $TAILWIND_PID 2>/dev/null
    echo -e "${GREEN}✅ Stopped${NC}"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup INT TERM

# Start the Flask server
echo -e "${GREEN}✅ Starting Flask development server...${NC}"
echo -e "${BLUE}📍 Local: http://127.0.0.1:8080${NC}"
echo -e "${BLUE}📍 Network: http://$(ipconfig getifaddr en0):8080${NC}"
echo -e "${BLUE}🎨 Tailwind CSS watching for changes...${NC}"
echo -e "${YELLOW}💡 Press Ctrl+C to stop both servers${NC}"
echo ""

# Run with Flask development server for auto-reload
# --host=0.0.0.0 allows connections from other devices on the network
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=8080 --reload
