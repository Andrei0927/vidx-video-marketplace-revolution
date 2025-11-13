#!/bin/bash
# VidX Production Startup Script

echo "🚀 VidX Marketplace - Starting initialization..."

# Install FFmpeg and dependencies (required for video processing)
echo "📦 Checking for FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "🎬 Installing FFmpeg..."
    apt-get update -qq
    apt-get install -y ffmpeg imagemagick > /dev/null 2>&1
    
    if command -v ffmpeg &> /dev/null; then
        echo "✅ FFmpeg installed: $(ffmpeg -version | head -n 1)"
    else
        echo "❌ FFmpeg installation failed"
    fi
else
    echo "✅ FFmpeg already installed: $(ffmpeg -version | head -n 1)"
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

