# VidX Video Marketplace - Production Docker Image
# Python 3.12 with FFmpeg support
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies including FFmpeg for video processing
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    ffmpeg \
    imagemagick \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire application code
COPY . .

# Make startup script executable
RUN chmod +x startup.sh

# Expose port (Azure will set PORT env var)
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Run using the startup script (which starts Gunicorn)
CMD ["./startup.sh"]
