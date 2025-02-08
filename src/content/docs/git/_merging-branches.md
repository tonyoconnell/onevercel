---
title: Different Deployment Options on Different Branches
description: ow to manage different configurations for different deployment environments using Git branches. 
date: 2024-02-02
section: Git
order: 0
---
How to manage different configurations for different deployment environments using Git branches. Here's a recommended approach:

1. First, create a `.gitignore` entry for your local config:
```bash
echo "astro.config.mjs.local" >> .gitignore
```

2. Rename your current `astro.config.mjs` to `astro.config.mjs.template`:
```bash
mv astro.config.mjs astro.config.mjs.template
```

3. Create branch-specific configurations:

```bash
# Create and switch to netlify branch
git checkout -b netlify

# Create netlify-specific config
cp astro.config.mjs.template astro.config.mjs
```

4. Create a simple script to manage configurations. Create a new file:
```javascript:/Users/toc/Server/ONE/local/astro-shadcn/scripts/config-switch.js
const fs = require('fs');
const path = require('path');

const environment = process.argv[2] || 'local';
const configPath = path.join(__dirname, '..', 'astro.config.mjs');
const templatePath = path.join(__dirname, '..', `astro.config.${environment}.mjs`);

if (fs.existsSync(templatePath)) {
  fs.copyFileSync(templatePath, configPath);
  console.log(`Switched to ${environment} configuration`);
} else {
  console.error(`Configuration for ${environment} not found`);
}
```

5. Add these scripts to your `package.json`:
```json:/Users/toc/Server/ONE/local/astro-shadcn/package.json
{
  "scripts": {
    // ... other scripts ...
    "config:netlify": "node scripts/config-switch.js netlify",
    "config:local": "node scripts/config-switch.js local"
  }
}
```

Now you can work with different configurations:

1. For local development:
```bash
npm run config:local
npm run dev
```

2. For Netlify:
```bash
git checkout netlify
npm run config:netlify
# make your changes
```

When merging branches:
1. Don't merge the `astro.config.mjs` file
2. Only merge the template files and environment-specific configs

You can use git merge strategies to avoid conflicts:
```bash
git merge --strategy-option=ours netlify -- astro.config.mjs
```

This way, you can maintain different configurations for different environments while keeping your main configuration files separate and easily switchable.

Remember to:
1. Keep sensitive information in environment variables
2. Document the different configurations in your README
3. Use clear naming conventions for different environment configs
4. Consider using a configuration management tool for more complex setups