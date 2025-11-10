#!/bin/bash
# Stream Azure App Service logs

APP_NAME="vidx-marketplace"
RESOURCE_GROUP="andrei_09_rg_3843"

# Colors
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  VidX Marketplace - Application Logs${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}💡 Press Ctrl+C to stop streaming${NC}"
echo ""

az webapp log tail \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP
