#!/bin/bash
# Deploy VidX Backend to Azure Container Apps

set -e  # Exit on error

echo "🚀 Deploying VidX Backend to Azure Container Apps"
echo "=================================================="

# Configuration
RESOURCE_GROUP="video-marketplace-prod"
REGISTRY_NAME="videomarketplaceregistry"
IMAGE_NAME="backend"
IMAGE_TAG="latest"
APP_NAME="video-marketplace-api"
ENV_NAME="video-marketplace-env"
LOCATION="northeurope"

# Database configuration
DATABASE_URL="postgresql://videoadmin:VideoMarket2025!Secure@video-marketplace-db.postgres.database.azure.com:5432/videodb?sslmode=require"

# R2 configuration
R2_ACCOUNT_ID="c26c8394fb93e67fc5f913894a929467"
R2_ACCESS_KEY_ID="482722d37434d880650023e880dfee08"
R2_SECRET_ACCESS_KEY="e4bdc965de36d185f8bc5ed2ce81f627a86d7813253e8a6989bea032511bbe59"
R2_BUCKET_NAME="video-marketplace-videos"

# Frontend URL
CORS_ORIGIN="https://mango-desert-0f205db03.3.azurestaticapps.net"

echo ""
echo "Step 1: Login to Azure Container Registry..."
az acr login --name $REGISTRY_NAME

echo ""
echo "Step 2: Build Docker image..."
docker build -t $REGISTRY_NAME.azurecr.io/$IMAGE_NAME:$IMAGE_TAG .

echo ""
echo "Step 3: Push image to Azure Container Registry..."
docker push $REGISTRY_NAME.azurecr.io/$IMAGE_NAME:$IMAGE_TAG

echo ""
echo "Step 4: Enable admin access on Container Registry..."
az acr update --name $REGISTRY_NAME --admin-enabled true

echo ""
echo "Step 5: Get registry credentials..."
REGISTRY_SERVER=$(az acr show --name $REGISTRY_NAME --query loginServer --output tsv)
REGISTRY_USERNAME=$(az acr credential show --name $REGISTRY_NAME --query username --output tsv)
REGISTRY_PASSWORD=$(az acr credential show --name $REGISTRY_NAME --query passwords[0].value --output tsv)

echo ""
echo "Step 6: Deploy to Container Apps..."
az containerapp create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENV_NAME \
  --image $REGISTRY_SERVER/$IMAGE_NAME:$IMAGE_TAG \
  --target-port 8080 \
  --ingress external \
  --registry-server $REGISTRY_SERVER \
  --registry-username $REGISTRY_USERNAME \
  --registry-password $REGISTRY_PASSWORD \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 0 \
  --max-replicas 3 \
  --env-vars \
    DATABASE_URL="$DATABASE_URL" \
    R2_ACCOUNT_ID="$R2_ACCOUNT_ID" \
    R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID" \
    R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY" \
    R2_BUCKET_NAME="$R2_BUCKET_NAME" \
    CORS_ORIGIN="$CORS_ORIGIN" \
    PORT=8080 \
    FLASK_ENV=production

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Getting app URL..."
APP_URL=$(az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo ""
echo "🎉 Backend deployed successfully!"
echo "=================================================="
echo "Backend URL: https://$APP_URL"
echo "Health check: https://$APP_URL/health"
echo ""
echo "Next steps:"
echo "1. Update frontend auth-service.js with backend URL"
echo "2. Test endpoints"
echo "3. Setup SendGrid for emails"
echo "4. Add OpenAI API key"
