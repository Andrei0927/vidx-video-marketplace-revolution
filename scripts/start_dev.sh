#!/bin/bash

# VidX Development Server Starter
# Starts both the static file server and authentication server

# Change to project root directory (parent of scripts folder)
cd "$(dirname "$0")/.." || exit 1

echo "🚀 Starting VidX Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Kill any existing servers
echo "🧹 Cleaning up old servers..."
lsof -ti tcp:3000 | xargs kill -9 2>/dev/null || true
lsof -ti tcp:3001 | xargs kill -9 2>/dev/null || true
sleep 1

# Start Python static file server on port 3000
echo ""
echo -e "${BLUE}📁 Starting static file server on http://localhost:3000${NC}"
python3 -m http.server 3000 > /dev/null 2>&1 &
STATIC_PID=$!

# Wait a moment
sleep 1

# Start authentication server on port 3001
echo -e "${BLUE}🔐 Starting authentication server on http://localhost:3001${NC}"
python3 scripts/auth_server.py &
AUTH_PID=$!

# Wait a moment for servers to start
sleep 2

echo ""
echo -e "${GREEN}✅ Development environment is ready!${NC}"
echo ""
echo "📱 Access your app:"
echo "   Main app:  http://localhost:3000"
echo "   Auth API:  http://localhost:3001/api/auth"
echo ""
echo "📋 Test credentials:"
echo "   Email: demo@example.com"
echo "   Password: demo1234"
echo ""
echo "🛠️  Servers running:"
echo "   Static server PID: $STATIC_PID"
echo "   Auth server PID:   $AUTH_PID"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping servers..."; kill $STATIC_PID $AUTH_PID 2>/dev/null; echo "✅ Servers stopped"; exit' INT

# Keep script running
wait
