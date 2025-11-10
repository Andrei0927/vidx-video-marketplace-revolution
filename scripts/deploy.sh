#!/bin/bash
# VidX Marketplace - Production Deployment Script
# Deploy to Azure App Service with confirmation and status checks

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
APP_NAME="vidx-marketplace"
RESOURCE_GROUP="andrei_09_rg_3843"
RUNTIME="PYTHON:3.12"
SKU="B1"
LOCATION="westeurope"
PROD_URL="https://vidx-marketplace.azurewebsites.net"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  VidX Marketplace - Production Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if there are uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes:${NC}"
    git status -s
    echo ""
    read -p "Continue deployment anyway? [y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Deployment cancelled${NC}"
        exit 1
    fi
fi

# Show current branch and commit
BRANCH=$(git branch --show-current)
COMMIT=$(git rev-parse --short HEAD)
echo -e "${BLUE}📍 Branch:${NC} $BRANCH"
echo -e "${BLUE}📍 Commit:${NC} $COMMIT"
echo -e "${BLUE}📍 Target:${NC} $PROD_URL"
echo ""

# Confirm deployment
echo -e "${YELLOW}⚠️  This will deploy to PRODUCTION!${NC}"
read -p "Are you sure? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Deployment cancelled${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🚀 Starting deployment...${NC}"
echo ""

# Step 1: Clean build artifacts
echo -e "${BLUE}1/4${NC} Cleaning build artifacts..."
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true
rm -f deploy.zip deployment.zip 2>/dev/null || true
echo -e "${GREEN}✅ Cleaned${NC}"
echo ""

# Step 2: Push to GitHub (if changes exist)
if [[ -n $(git log origin/$BRANCH..$BRANCH 2>/dev/null) ]]; then
    echo -e "${BLUE}2/4${NC} Pushing to GitHub..."
    git push origin $BRANCH
    echo -e "${GREEN}✅ Pushed to GitHub${NC}"
else
    echo -e "${BLUE}2/4${NC} No new commits to push"
fi
echo ""

# Step 3: Deploy to Azure
echo -e "${BLUE}3/4${NC} Deploying to Azure App Service..."
echo -e "${YELLOW}💡 This will take 4-5 minutes. Please be patient...${NC}"
echo ""

START_TIME=$(date +%s)

az webapp up \
    --name $APP_NAME \
    --runtime $RUNTIME \
    --sku $SKU \
    --location $LOCATION

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo -e "${GREEN}✅ Deployed in ${DURATION}s${NC}"
echo ""

# Step 4: Verify deployment
echo -e "${BLUE}4/4${NC} Verifying deployment..."
sleep 5  # Wait for app to start

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $PROD_URL)

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}✅ Site is responding (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${YELLOW}⚠️  Site returned HTTP $HTTP_STATUS${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}🌐 Production URL:${NC} $PROD_URL"
echo -e "${YELLOW}💡 Hard refresh in browser:${NC} Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)"
echo ""
echo -e "${BLUE}📊 View logs:${NC} ./scripts/logs.sh"
echo -e "${BLUE}📊 Check status:${NC} ./scripts/status.sh"
echo ""
