#!/bin/bash
# VidX Production Startup Script

# Load production environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Use Azure's PORT environment variable, default to 8000 if not set
PORT=${PORT:-8000}

# Start Gunicorn with production settings
gunicorn --bind=0.0.0.0:$PORT --timeout 600 --workers 2 --access-logfile - --error-logfile - app:app

