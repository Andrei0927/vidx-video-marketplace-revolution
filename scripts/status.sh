#!/bin/bash
# Check Azure App Service status

APP_NAME="vidx-marketplace"
RESOURCE_GROUP="andrei_09_rg_3843"
PROD_URL="https://vidx-marketplace.azurewebsites.net"

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  VidX Marketplace - Production Status${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# App Service status
echo -e "${GREEN}📊 App Service Status:${NC}"
az webapp show \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query "{Name:name, State:state, URL:defaultHostName, Runtime:siteConfig.linuxFxVersion, Location:location}" \
    -o table

echo ""

# HTTP check
echo -e "${GREEN}🌐 HTTP Check:${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $PROD_URL)
echo "Status Code: $HTTP_STATUS"

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}✅ Site is responding correctly${NC}"
else
    echo -e "${YELLOW}⚠️  Site may be having issues${NC}"
fi

echo ""
echo -e "${GREEN}🔗 Production URL:${NC} $PROD_URL"
echo ""
