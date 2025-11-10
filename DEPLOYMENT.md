# VidX Marketplace - Azure Deployment Guide

## ✅ Pre-Deployment Checklist

Your Flask app is ready for deployment with:
- ✅ Modern UI with rounded corners
- ✅ Flask routes configured
- ✅ API endpoints for auth & listings
- ✅ Category-specific search templates
- ✅ Static assets organized
- ✅ Templates using Jinja2
- ✅ Dark mode functionality
- ✅ PWA features

## 🚀 Azure Deployment Steps

### Option 1: Deploy via Azure CLI (Recommended)

1. **Install Azure CLI** (if not already installed):
```bash
brew install azure-cli
```

2. **Login to Azure**:
```bash
az login
```

3. **Create Resource Group** (if needed):
```bash
az group create --name vidx-resources --location westeurope
```

4. **Create App Service Plan**:
```bash
az appservice plan create \
  --name vidx-plan \
  --resource-group vidx-resources \
  --sku B1 \
  --is-linux
```

5. **Create Web App**:
```bash
az webapp create \
  --name vidx-marketplace \
  --resource-group vidx-resources \
  --plan vidx-plan \
  --runtime "PYTHON:3.12"
```

6. **Configure Startup Command**:
```bash
az webapp config set \
  --resource-group vidx-resources \
  --name vidx-marketplace \
  --startup-file "startup.sh"
```

7. **Deploy from Local Git**:
```bash
# Initialize git if not already
git init
git add .
git commit -m "Ready for Azure deployment"

# Set up Azure deployment
az webapp deployment source config-local-git \
  --name vidx-marketplace \
  --resource-group vidx-resources

# Get deployment URL (it will output a Git URL)
az webapp deployment list-publishing-credentials \
  --name vidx-marketplace \
  --resource-group vidx-resources \
  --query scmUri \
  --output tsv

# Add Azure as remote and push
git remote add azure <paste-the-git-url-here>
git push azure main
```

### Option 2: Deploy via VS Code

1. **Install Azure App Service Extension**
2. **Sign in to Azure** in VS Code
3. **Right-click on the folder** → "Deploy to Web App"
4. **Follow the prompts** to create/select App Service

### Option 3: Deploy via GitHub Actions

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Flask migration complete"
git branch -M main
git remote add origin https://github.com/Andrei0927/vidx-video-marketplace-revolution.git
git push -u origin main
```

2. **Set up GitHub Actions** (Azure will provide deployment credentials)

## 🔧 Environment Variables to Set in Azure

After deployment, configure these in Azure Portal → Configuration → Application Settings:

```
SECRET_KEY=<generate-a-secure-random-key>
FLASK_ENV=production
DATABASE_URL=<your-postgresql-connection-string>
CORS_ORIGIN=<your-domain>
```

To generate a secure key:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

## 📊 Database Setup (Optional - for later)

If you want to use PostgreSQL:

1. **Create PostgreSQL Database**:
```bash
az postgres flexible-server create \
  --name vidx-db \
  --resource-group vidx-resources \
  --location westeurope \
  --admin-user vidxadmin \
  --admin-password <strong-password> \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14
```

2. **Get connection string** and add to App Settings

## 🌐 Custom Domain (Optional)

1. **Purchase domain** or use existing
2. **Add custom domain** in Azure Portal
3. **Configure DNS** records
4. **Enable SSL/TLS** (free with Azure)

## 🔍 Post-Deployment Checks

After deployment, verify:
- [ ] Homepage loads (`https://vidx-marketplace.azurewebsites.net/`)
- [ ] Dark mode toggle works
- [ ] Category pages load
- [ ] Login/Register functionality works
- [ ] Static assets load correctly
- [ ] PWA manifest accessible

## 🐛 Troubleshooting

**If deployment fails:**
1. Check deployment logs: `az webapp log tail --name vidx-marketplace --resource-group vidx-resources`
2. Verify Python version in `runtime.txt`
3. Check `requirements.txt` has all dependencies
4. Ensure `startup.sh` is executable

**If search pages are blank:**
- Will fix post-deployment (template routing issue)
- Category pages work fine for now

## 📝 Next Steps After Deployment

1. ✅ Test all routes
2. 🔧 Fix search page blank issue
3. 📹 Add demo video content
4. 🗄️ Connect PostgreSQL database
5. 📤 Implement file uploads to Azure Blob Storage
6. 🔒 Set up authentication secrets
7. 📧 Configure SendGrid for emails

## 🎉 You're Ready!

Your app is configured and ready to deploy. Choose your preferred method above and let's get it live!
