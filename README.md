# Ekko Landing Page

The marketing landing page for Ekko - Natural Language Blockchain Monitoring platform with deep Avalanche ecosystem integration.

🌐 **Live Site**: https://ekko.zone

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:4321
```

## Project Structure

```
landing/
├── src/
│   ├── components/     # React components
│   ├── layouts/        # Page layouts
│   ├── pages/          # Site pages (routes)
│   └── styles/         # Global styles
├── public/             # Static assets
│   ├── .nojekyll      # Required for GitHub Pages
│   └── CNAME          # Custom domain config
├── dist/              # Build output (git ignored)
└── package.json       # Project config
```

## Making Changes

### 1. Edit Page Content

All pages are in `src/pages/`:
- `index.astro` - Homepage
- `features.astro` - Features page
- `pricing.astro` - Pricing tiers
- `mint.astro` - Early access program
- `about.astro` - About us
- `docs.astro` - Documentation links
- `download.astro` - App downloads

### 2. Update Styles

- Global styles: `src/styles/global.css`
- Component styles: Use Tailwind CSS classes directly
- Brand colors are defined in CSS variables

### 3. Modify Components

React components are in `src/components/`:
- Import and use within `.astro` pages
- Components use TypeScript for type safety

### 4. Test Locally

```bash
# Development server with hot reload
npm run dev

# Build and preview production version
npm run build
npm run preview
```

## Deployment

### Automatic Deployment

Simply run:
```bash
npm run deploy
```

This will:
1. Build the site to `dist/`
2. Deploy to GitHub Pages
3. Site will be live at https://ekko.zone within minutes

### Manual Deployment Steps

If you need more control:

```bash
# 1. Build the site
npm run build

# 2. Deploy to GitHub Pages
npx gh-pages -d dist \
  --repo git@github.com:web3ekko/landing.git \
  --branch gh-pages \
  --dotfiles
```

### Alternative: Using Deploy Script

```bash
./deploy-to-github.sh
```

## Important Notes

### GitHub Pages Requirements

⚠️ **Critical**: The `.nojekyll` file in `public/` is REQUIRED. Without it, GitHub Pages won't serve the `_astro` directory containing CSS and JavaScript files.

### Repository Structure

This landing page exists within a larger GitLab repository. The deployment process:
- Uses `--repo` flag to deploy directly to GitHub
- Doesn't add GitHub as a git remote
- Keeps GitLab repo unaffected

### Custom Domain

The site uses `ekko.zone` as the custom domain:
- CNAME file in `public/` directory
- DNS A records point to GitHub Pages IPs:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153

## Common Tasks

### Adding a New Page

1. Create new `.astro` file in `src/pages/`
2. Use the BaseLayout component:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Page Title">
  <!-- Your content here -->
</BaseLayout>
```

3. Page will be automatically available at `/filename`

### Updating Navigation

Edit the Navigation component in each page's header section:
```astro
<a href="/new-page" class="text-sm font-medium...">
  New Page
</a>
```

### Changing Brand Colors

Edit `src/styles/global.css`:
```css
:root {
  --ekko-primary: #6366f1;    /* Indigo */
  --ekko-secondary: #8b5cf6;  /* Purple */
  --ekko-accent: #10b981;     /* Emerald */
}
```

### Updating Meta Tags

Edit `src/layouts/BaseLayout.astro` for global changes, or pass props for page-specific meta:
```astro
<BaseLayout 
  title="Custom Title"
  description="Custom description"
  image="/custom-og-image.png"
>
```

### Adding Analytics

Add tracking scripts to `src/layouts/BaseLayout.astro` before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## Technology Stack

- **[Astro](https://astro.build)** - Static site generator
- **[Tailwind CSS v4](https://tailwindcss.com)** - Utility-first CSS
- **[React](https://react.dev)** - Interactive components
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **[GitHub Pages](https://pages.github.com)** - Hosting

## Performance

The site is optimized for performance:
- Static generation for instant loads
- Optimized images and assets
- Minimal JavaScript (only where needed)
- CSS is extracted and minified
- Lighthouse score >95 on all metrics

## Development Tips

1. **Use Astro Components**: For static content, use `.astro` files instead of React
2. **Optimize Images**: Place images in `public/` and use appropriate formats
3. **Keep It Fast**: Minimize JavaScript - Astro ships zero JS by default
4. **Test Responsively**: Check all breakpoints: mobile (320px), tablet (768px), desktop (1024px+)
5. **Validate Changes**: Run `npm run build` before deploying to catch errors

## Troubleshooting

### CSS Not Loading After Deploy

Ensure `.nojekyll` file exists in `public/` directory. Without it, GitHub Pages ignores `_astro` folder.

### 404 Errors on Deploy

Check that:
1. Build completed successfully
2. `dist/` folder contains all files
3. Deploy command includes `--dotfiles` flag

### Changes Not Showing

1. Clear browser cache
2. Wait 5-10 minutes for GitHub Pages to update
3. Check GitHub Pages settings at https://github.com/web3ekko/landing/settings/pages

### Build Errors

```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Astro cache
rm -rf .astro dist
npm run build
```

## Support

For issues or questions:
- Check the [PRD documentation](../docs/prd/landing/PRD-Landing-Page-Website.md)
- Review [Astro docs](https://docs.astro.build)
- Contact the development team

## License

Copyright © 2025 Ekko Labs. All rights reserved.