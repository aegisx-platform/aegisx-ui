# AegisX Platform Documentation Site

This is the VitePress-powered documentation website for the AegisX Platform.

## 🚀 Quick Start

### Development

Start the local development server:

```bash
pnpm docs:dev
```

The site will be available at http://localhost:5173/aegisx-starter/

### Build

Build the static site for production:

```bash
pnpm docs:build
```

The built files will be in `.vitepress/dist/`

### Preview

Preview the production build locally:

```bash
pnpm docs:preview
```

## 📂 Structure

```
docs-site/
├── .vitepress/
│   ├── config.mts          # VitePress configuration
│   ├── public/             # Static assets (logo, images)
│   └── theme/              # Custom theme (if any)
├── getting-started/        # Getting started guides
├── development/            # Development documentation
├── features/               # Feature documentation (21 modules)
├── architecture/           # Architecture documentation
├── api/                    # API reference and playground
├── infrastructure/         # Infrastructure & DevOps
├── crud-generator/         # CRUD Generator docs
├── testing/                # Testing guides
├── references/             # Quick references
└── index.md                # Homepage
```

## 🎨 Features

- ✅ **Full-text search** - Local search across all documentation
- ✅ **Dark mode** - Automatic dark/light theme switching
- ✅ **API Playground** - Interactive API testing with Scalar
- ✅ **Mobile responsive** - Works on all devices
- ✅ **Fast navigation** - Client-side routing for instant page loads
- ✅ **Code highlighting** - Syntax highlighting for code blocks
- ✅ **Last updated** - Timestamps for all pages

## 🔧 Configuration

Main configuration is in `.vitepress/config.mts`:

- **Site metadata** - Title, description
- **Navigation** - Top nav and sidebar
- **Search** - Local search configuration
- **Theme** - Colors, logo, social links
- **GitHub Pages** - Base URL configuration

## 📝 Adding Documentation

### 1. Create a new markdown file

```bash
# Example: Add a new feature guide
touch features/my-feature/README.md
```

### 2. Add front matter (optional)

```yaml
---
title: My Feature
description: Brief description
outline: deep
---
```

### 3. Update navigation

Edit `.vitepress/config.mts` to add your page to the sidebar:

```typescript
sidebar: {
  '/features/': [
    {
      text: 'My Feature',
      link: '/features/my-feature/'
    }
  ]
}
```

## 🚢 Deployment

### GitHub Pages (Automatic)

Docs are automatically deployed to GitHub Pages when you push to `main` or `develop` branch:

1. Push changes to GitHub
2. GitHub Actions workflow runs automatically
3. Site deploys to https://aegisx-platform.github.io/aegisx-starter/

### Manual Deployment

If needed, you can deploy manually:

```bash
# Build the site
pnpm docs:build

# Deploy the .vitepress/dist folder to your hosting provider
```

## 🔗 Links

- **Live Site**: https://aegisx-platform.github.io/aegisx-starter/
- **VitePress Docs**: https://vitepress.dev/
- **Scalar API Reference**: https://github.com/scalar/scalar

## 🐛 Troubleshooting

### Dev server won't start

Make sure dependencies are installed:

```bash
pnpm install
```

### Build fails

Check for:

- Broken internal links
- Missing markdown files referenced in config
- Syntax errors in config.mts

### API Playground not loading

Make sure your API server is running:

```bash
pnpm run dev:api
```

And the OpenAPI spec is accessible at http://localhost:3333/api/docs/json

## 📄 License

MIT License - See main project LICENSE file
