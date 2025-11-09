# Contributing to VidX

Thank you for your interest in contributing to VidX! This document provides guidelines and information for contributors.

## 📁 Project Organization

We follow the **5S methodology** for workspace organization:

### Directory Structure

```
vidx-video-marketplace-revolution/
├── *.html                 # All page files (root level for easy access)
├── components/            # Reusable web components
├── css/                   # Stylesheets
├── js/                    # JavaScript modules
├── images/               # Static images and assets
├── templates/            # HTML templates
├── scripts/              # Python scripts and dev tools
│   ├── auth_server.py    # Authentication server
│   ├── server.py         # Static file server
│   ├── migrate_db.py     # Database migrations
│   └── start_dev.sh      # Development startup script
├── data/                 # Databases and data files
│   ├── auth_db.json      # User authentication data
│   └── db.json           # Main application data
├── docs/                 # All documentation
│   ├── guides/           # How-to guides and tutorials
│   ├── architecture/     # System architecture documentation
│   ├── audits/          # Audit reports and roadmaps
│   └── summaries/       # Implementation summaries
└── Demo ads/            # Sample video content
```

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+ (optional, for package management)
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vidx-video-marketplace-revolution.git
   cd vidx-video-marketplace-revolution
   ```

2. **Start development servers**
   ```bash
   chmod +x scripts/start_dev.sh
   ./scripts/start_dev.sh
   ```

3. **Access the application**
   - Main app: http://localhost:3000
   - Auth API: http://localhost:3001/api/auth

## 📝 Coding Standards

### JavaScript

- Use ES6+ features (const, let, arrow functions, template literals)
- Prefer async/await over promise chains
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions small and focused (single responsibility)

**Example:**
```javascript
/**
 * Generate video from product description
 * @param {Object} params - Video generation parameters
 * @param {string} params.description - Product description
 * @param {Array} params.files - Image files
 * @returns {Promise<Object>} Job ID and estimated time
 */
async function generateVideo(params) {
    // Implementation
}
```

### Python

- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings for functions and classes
- Use meaningful variable names

**Example:**
```python
def hash_password(password: str) -> str:
    """
    Hash a password using SHA-256 with salt
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password with salt (format: salt$hash)
    """
    # Implementation
```

### HTML

- Use semantic HTML5 elements
- Include ARIA labels for accessibility
- Use Tailwind CSS utility classes
- Keep markup clean and readable
- Add comments for complex sections

### CSS

- Use Tailwind CSS utilities first
- Custom CSS only when necessary
- Follow dark mode patterns (`dark:` prefix)
- Use CSS variables for theme values

## 🔧 Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards
   - Test thoroughly
   - Update documentation

3. **Test locally**
   ```bash
   ./scripts/start_dev.sh
   # Test all affected pages
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```

### Commit Message Format

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
```
feat: Add password reset functionality
fix: Resolve video autoplay issue on Safari
docs: Update API documentation
refactor: Reorganize project structure
```

## 📚 Documentation

### When to Update Documentation

- Adding new features → Update relevant guide in `docs/guides/`
- Changing architecture → Update `docs/architecture/`
- API changes → Update `docs/guides/OPENAI_VIDEO_PIPELINE.md`
- New scripts → Add usage to README.md

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots where helpful
- Keep documentation up-to-date with code

## 🧪 Testing

### Manual Testing Checklist

Before submitting changes, test:

- [ ] Feature works on desktop browsers (Chrome, Firefox, Safari)
- [ ] Feature works on mobile browsers (iOS Safari, Chrome)
- [ ] Dark mode works correctly
- [ ] Authentication flows work
- [ ] No console errors
- [ ] Responsive design looks good

### Test Pages

- **Upload Flow**: upload.html → upload-details.html → upload-review.html
- **Authentication**: login.html, register.html
- **Marketplace**: index.html, automotive.html, electronics.html
- **User Features**: profile.html, my-ads.html, favourites.html

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g., Chrome 120, Safari 17]
- OS: [e.g., macOS 14, iOS 17]
- Device: [e.g., iPhone 15, Desktop]
```

## ✨ Feature Requests

### Feature Request Template

```markdown
**Problem Statement**
Describe the problem this feature would solve.

**Proposed Solution**
Describe your proposed solution.

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other context, mockups, or examples.
```

## 📦 Pull Requests

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tested on multiple browsers
- [ ] Commit messages follow convention

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tested on multiple browsers
```

## 🗂️ File Organization Rules

### Where to Put New Files

- **HTML pages** → Root directory (e.g., `new-page.html`)
- **JavaScript modules** → `js/` directory
- **Web components** → `components/` directory
- **Stylesheets** → `css/` directory
- **Python scripts** → `scripts/` directory
- **Documentation** → `docs/` (in appropriate subdirectory)
- **Data files** → `data/` directory
- **Static assets** → `images/` directory

### Naming Conventions

- **Files**: Use kebab-case (e.g., `video-generation-service.js`)
- **Classes**: Use PascalCase (e.g., `VideoGenerationService`)
- **Functions**: Use camelCase (e.g., `generateVideo`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

## 🔐 Security Guidelines

- **Never commit API keys** or secrets
- **Use environment variables** for sensitive data
- **Sanitize user input** before processing
- **Use HTTPS** in production
- **Follow OWASP** security best practices

## 📞 Getting Help

- **Documentation**: Check `docs/guides/` first
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions

## 🙏 Thank You!

Your contributions make VidX better for everyone. We appreciate your time and effort!

---

**Project Maintainer**: @andrei-09
**Last Updated**: November 2025
