# Configuration System

## Overview

This project now uses a centralized configuration system that allows you to change business information in one place and have it applied across all website pages.

## How It Works

### 1. Configuration File
All business information is stored in `config/business-config.json`. This includes:
- Business names (Japanese, English, brand names)
- Contact information (email, business hours)
- Location details
- Legal information (copyright, last updated dates)
- Policies (shipping, returns, payment methods)

### 2. Template System
HTML files in the `templates/` directory contain placeholders like `{{CONTACT_EMAIL}}` that get replaced with actual values from the configuration file.

### 3. Build Process
Run `npm run build` to generate the final HTML files in the `dist/` directory with all placeholders replaced.

## Making Changes

### To Update Business Information:

1. **Edit the config file**: `config/business-config.json`
2. **Run the build**: `npm run build`
3. **Deploy**: Copy files from `dist/` to your web server, or use the generated files

### Example: Changing Email Address

1. Open `config/business-config.json`
2. Find the email field:
   ```json
   "contact": {
     "email": "ninety840331@gmail.com"
   }
   ```
3. Change it to your new email:
   ```json
   "contact": {
     "email": "your-new-email@example.com"
   }
   ```
4. Run `npm run build`
5. All HTML files will now use the new email address

## Available Placeholders

### Business Names
- `{{BUSINESS_NAME_JAPANESE}}` - 日本旅行企劃家の私藏清單
- `{{BUSINESS_NAME_BRAND}}` - hokkaido_meimei
- `{{BUSINESS_NAME_SHORT}}` - Mei

### Contact Information
- `{{CONTACT_EMAIL}}` - Email address
- `{{BUSINESS_HOURS_JP}}` - Business hours in Japanese
- `{{BUSINESS_HOURS_ZH}}` - Business hours in Chinese

### Location
- `{{LOCATION_JAPANESE}}` - Location in Japanese
- `{{LOCATION_CHINESE}}` - Location in Chinese
- `{{LOCATION_FULL}}` - Full address placeholder

### Legal & Policies
- `{{COPYRIGHT}}` - Copyright notice
- `{{LAST_UPDATED}}` - Last updated date
- `{{RETURN_POLICY_JP}}` - Return policy in Japanese
- `{{RETURN_POLICY_ZH}}` - Return policy in Chinese
- `{{PAYMENT_METHODS_JP}}` - Payment methods in Japanese
- `{{PAYMENT_METHODS_ZH}}` - Payment methods in Chinese

## Adding New Templates

1. Create a new HTML file in `templates/` directory
2. Use placeholders like `{{CONTACT_EMAIL}}` where needed
3. Run `npm run build` to generate the final file

## Project Structure

```
project/
├── config/
│   └── business-config.json    # Main configuration file
├── templates/                  # Template files with placeholders
│   ├── tokusho.html
│   ├── tokusho-zh.html
│   └── ... (other templates)
├── scripts/
│   └── build.js               # Build script
├── dist/                      # Generated files (ready for deployment)
├── assets/                    # Static assets
├── src/                       # Source files
└── docs/                      # Documentation
```

## Quick Commands

- `npm run build` - Generate HTML files from templates
- `npm run dev` - Build and start development server
- `npm start` - Start the server only

## Tips

1. **Always edit the config file**, not the generated HTML files
2. **Backup your config file** before making major changes
3. **Test changes locally** before deploying to production
4. **Use version control** to track changes to your configuration 