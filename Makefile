# VidX Marketplace - Development Makefile
# Quick commands for common development tasks

.PHONY: help install dev test clean deploy status logs

# Default target - show help
help:
	@echo "VidX Marketplace - Available Commands:"
	@echo ""
	@echo "  make install    - Install dependencies"
	@echo "  make dev        - Run local development server"
	@echo "  make test       - Run tests (when added)"
	@echo "  make clean      - Clean temporary files"
	@echo "  make deploy     - Deploy to Azure production"
	@echo "  make status     - Check Azure deployment status"
	@echo "  make logs       - Stream Azure application logs"
	@echo ""

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	pip install -r requirements.txt
	@echo "✅ Dependencies installed!"

# Run local development server
dev:
	@echo "🚀 Starting local development server..."
	@echo "📍 Running at http://127.0.0.1:5000"
	@echo "💡 Press Ctrl+C to stop"
	@echo ""
	python app.py

# Run tests (placeholder for when you add tests)
test:
	@echo "🧪 Running tests..."
	@echo "⚠️  No tests configured yet"
	# pytest tests/

# Clean temporary files
clean:
	@echo "🧹 Cleaning temporary files..."
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.log" -delete
	rm -f deploy.zip deployment.zip
	@echo "✅ Cleaned!"

# Deploy to Azure
deploy:
	@echo "🚀 Deploying to Azure App Service..."
	@echo ""
	@echo "⚠️  This will deploy your current code to production!"
	@echo "📍 Production URL: https://vidx-marketplace.azurewebsites.net"
	@echo ""
	@read -p "Continue? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "📦 Creating deployment package..."; \
		az webapp up --name vidx-marketplace --runtime "PYTHON:3.12" --sku B1 --location westeurope; \
		echo ""; \
		echo "✅ Deployment complete!"; \
		echo "🌐 Visit: https://vidx-marketplace.azurewebsites.net"; \
	else \
		echo "❌ Deployment cancelled"; \
	fi

# Check Azure deployment status
status:
	@echo "📊 Checking Azure App Service status..."
	@az webapp show --name vidx-marketplace --resource-group andrei_09_rg_3843 --query "{name:name, state:state, url:defaultHostName, runtime:siteConfig.linuxFxVersion}" -o table

# Stream Azure logs
logs:
	@echo "📜 Streaming Azure application logs..."
	@echo "💡 Press Ctrl+C to stop"
	@echo ""
	az webapp log tail --name vidx-marketplace --resource-group andrei_09_rg_3843
