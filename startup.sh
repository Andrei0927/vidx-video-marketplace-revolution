#!/bin/bash
# VidX Production Startup Script

echo "🚀 VidX Marketplace - Starting..."

# Check if FFmpeg is available (but don't try to install it)
if command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg available: $(ffmpeg -version | head -n 1)"
else
    echo "⚠️ FFmpeg not available - video generation will be disabled"
    echo "   To enable video generation, use a custom Docker container with FFmpeg pre-installed"
fi

# Load production environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Use Azure's PORT environment variable, default to 8000 if not set
PORT=${PORT:-8000}

echo "✅ Starting Gunicorn on port $PORT..."

# Start Gunicorn with production settings
gunicorn --bind=0.0.0.0:$PORT --timeout 600 --workers 2 --access-logfile - --error-logfile - app:app

