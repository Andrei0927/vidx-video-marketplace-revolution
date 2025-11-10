# VidX Marketplace - Development Guide

## 🚀 Quick Start

### First Time Setup

```bash
# 1. Clone the repository
git clone https://github.com/Andrei0927/vidx-video-marketplace-revolution.git
cd vidx-video-marketplace-revolution

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 5. Run development server
./dev.sh
# Or: make dev
# Or: python app.py
```

Visit http://127.0.0.1:5000 in your browser.

---

## 📋 Development Workflow

### Option 1: Quick Script (Recommended)

```bash
./dev.sh
```

This script:
- ✅ Checks for virtual environment
- ✅ Installs dependencies if needed
- ✅ Activates environment
- ✅ Runs Flask with auto-reload

### Option 2: Makefile Commands

```bash
make dev        # Start development server
make install    # Install dependencies
make clean      # Clean temporary files
make test       # Run tests (when added)
```

### Option 3: Manual

```bash
source venv/bin/activate
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --reload
```

---

## 🔄 Git Workflow

### Daily Development

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes, test locally with ./dev.sh

# 3. Commit changes
git add .
git commit -m "Description of changes"

# 4. Push to GitHub
git push origin feature/your-feature-name

# 5. Create Pull Request on GitHub (optional)

# 6. Merge to main when ready
git checkout main
git merge feature/your-feature-name
git push origin main
```

### Quick Commits

```bash
# Make changes, test with ./dev.sh

# Add and commit
git add .
git commit -m "Your commit message"
git push origin main
```

---

## 🚀 Deployment to Production

### Option 1: One-Command Deploy (Recommended)

```bash
./scripts/deploy.sh
```

This script:
- ✅ Shows current branch and commit
- ✅ Confirms deployment
- ✅ Cleans build artifacts
- ✅ Pushes to GitHub
- ✅ Deploys to Azure
- ✅ Verifies deployment
- ✅ Shows production URL

### Option 2: Makefile

```bash
make deploy
```

### Option 3: Manual Azure CLI

```bash
# Clean, commit, push
git add .
git commit -m "Changes"
git push origin main

# Deploy
az webapp up --name vidx-marketplace --runtime "PYTHON:3.12" --sku B1 --location westeurope

# Wait 4-5 minutes, then verify
curl -I https://vidx-marketplace.azurewebsites.net
```

---

## 📊 Monitoring & Debugging

### Check Production Status

```bash
./scripts/status.sh
# Or: make status
```

Shows:
- App Service state
- Runtime version
- HTTP status code
- Production URL

### Stream Application Logs

```bash
./scripts/logs.sh
# Or: make logs
```

Press Ctrl+C to stop.

### Download Logs for Analysis

```bash
az webapp log download \
    --name vidx-marketplace \
    --resource-group andrei_09_rg_3843 \
    --log-file logs.zip

unzip logs.zip
```

---

## 🛠️ Common Development Tasks

### Install New Python Package

```bash
# Activate virtual environment
source venv/bin/activate

# Install package
pip install package-name

# Update requirements.txt
pip freeze > requirements.txt

# Commit changes
git add requirements.txt
git commit -m "Add package-name dependency"
```

### Add New Route

1. Create route in `app.py` or blueprints
2. Create template in `templates/`
3. Test locally: `./dev.sh`
4. Commit: `git add . && git commit -m "Add new route"`
5. Deploy when ready: `./scripts/deploy.sh`

### Update Static Files (CSS/JS)

1. Edit files in `static/`
2. Test locally (hard refresh: Cmd+Shift+R)
3. Commit changes
4. Deploy: `./scripts/deploy.sh`
5. Hard refresh in production

### Database Changes (PostgreSQL - when added)

```bash
# Create migration
flask db migrate -m "Description"

# Apply migration locally
flask db upgrade

# Test locally
./dev.sh

# Commit migration files
git add migrations/
git commit -m "Add migration: description"

# Deploy (migrations run automatically in Azure)
./scripts/deploy.sh
```

---

## 🎯 Best Practices

### Before Committing

- ✅ Test locally with `./dev.sh`
- ✅ Check browser console for errors
- ✅ Test in Safari if making CSS changes
- ✅ Review changes: `git diff`
- ✅ Write meaningful commit messages

### Before Deploying

- ✅ All changes committed
- ✅ Pushed to GitHub
- ✅ Local testing complete
- ✅ No breaking changes
- ✅ Ready to wait 4-5 minutes for deployment

### After Deploying

- ✅ Wait for deployment to complete (don't Ctrl+C!)
- ✅ Hard refresh browser (Cmd+Shift+R)
- ✅ Check production site works
- ✅ Check browser console for errors
- ✅ Test critical user flows

---

## 🐛 Troubleshooting

### "Port 5000 already in use"

```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
flask run --port 5001
```

### "Module not found" error

```bash
# Reinstall dependencies
source venv/bin/activate
pip install -r requirements.txt
```

### Production site not updating

1. Wait 5 minutes after deployment
2. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)
3. Check logs: `./scripts/logs.sh`
4. Verify deployment: `./scripts/status.sh`

### Safari rendering issues

1. Check browser console for errors
2. Check Network tab for failed CDN loads
3. Test Tailwind: `typeof tailwind` in console
4. Hard refresh to clear cache

---

## 📁 Project Structure

```
vidx-video-marketplace-revolution/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── .env                    # Local environment variables (gitignored)
├── .env.example           # Environment template
├── Makefile               # Quick commands
├── dev.sh                 # Development server script
├── startup.sh             # Azure startup script
│
├── scripts/               # Deployment scripts
│   ├── deploy.sh         # One-command deployment
│   ├── status.sh         # Check production status
│   └── logs.sh           # Stream logs
│
├── static/               # Static assets
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript
│   ├── components/      # Web components
│   └── images/          # Images
│
├── templates/           # Jinja2 templates
│   ├── base.html       # Master template
│   ├── home.html       # Homepage
│   ├── category.html   # Category pages
│   └── ...
│
└── blueprints/         # Flask blueprints (when added)
    ├── auth/
    ├── listings/
    └── ...
```

---

## 🔗 Useful Commands Reference

### Development

| Command | Description |
|---------|-------------|
| `./dev.sh` | Start development server |
| `make dev` | Same as above |
| `make install` | Install dependencies |
| `make clean` | Clean temporary files |

### Git

| Command | Description |
|---------|-------------|
| `git status` | Check current changes |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Commit with message |
| `git push origin main` | Push to GitHub |

### Deployment

| Command | Description |
|---------|-------------|
| `./scripts/deploy.sh` | Deploy to production |
| `./scripts/status.sh` | Check production status |
| `./scripts/logs.sh` | Stream application logs |
| `make deploy` | Alternative deploy command |

### Azure CLI

| Command | Description |
|---------|-------------|
| `az webapp show --name vidx-marketplace --resource-group andrei_09_rg_3843` | Show app details |
| `az webapp restart --name vidx-marketplace --resource-group andrei_09_rg_3843` | Restart app |
| `az webapp config appsettings list --name vidx-marketplace --resource-group andrei_09_rg_3843` | List environment variables |

---

## 💡 Tips

- **Local Development**: Always test with `./dev.sh` before committing
- **Git Commits**: Make small, frequent commits with clear messages
- **Deployment**: Use `./scripts/deploy.sh` for production - it handles everything
- **Logs**: Use `./scripts/logs.sh` to debug production issues in real-time
- **Safari Testing**: Always hard refresh (Cmd+Shift+R) after deployment
- **Don't Panic**: If deployment seems stuck, DON'T Ctrl+C - wait 5 minutes

---

## 🎓 Learning Resources

- **Flask Documentation**: https://flask.palletsprojects.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Azure App Service**: https://docs.microsoft.com/azure/app-service/
- **Git Basics**: https://git-scm.com/doc

---

**Happy coding! 🚀**
