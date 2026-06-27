# Vercel Deployment - Quick Fix Guide

## Issue Resolution

The Vercel deployment error has been fixed with the following changes:

### 1. Enhanced vercel.json Configuration

**Key Changes:**
- Added `corepack enable pnpm` to ensure pnpm is available
- Explicit build command: `pnpm install && pnpm --filter @workspace/bloombook run build`
- Proper install command with frozen lockfile
- Added devCommand for preview deployments

**Why This Works:**
- `corepack enable pnpm` activates pnpm package manager
- `--filter @workspace/bloombook` targets only the bloombook app (not the monorepo root)
- This prevents npm from being used as fallback

### 2. .vercelignore File

Created to:
- Reduce deployment size (ignore node_modules, dist, build)
- Ignore non-production directories (api-server, mockup-sandbox)
- Only deploy what's needed for bloombook

### 3. Updated package.json Scripts

Added `build:vercel` script for explicit Vercel builds:
```json
"build:vercel": "pnpm install && pnpm --filter @workspace/bloombook run build"
```

### 4. Root-level pnpm Configuration

The package.json includes:
- `"packageManager": "pnpm@10.17.1"` - Tells Vercel to use pnpm
- Proper scripts for monorepo workspace

## Step-by-Step Deployment

1. **Go to Vercel Dashboard**
   - https://vercel.com

2. **Create New Project**
   - Click "Add New" → "Project"
   - Select "Import Git Repository"
   - Choose: `Tanmay2006-Tech/Bloom-Book`

3. **Configure Build Settings**
   - Framework Preset: "Other"
   - Build Command: Leave blank (uses vercel.json)
   - Output Directory: Leave blank (uses vercel.json)
   - Root Directory: Leave blank

4. **Set Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_CLOUDINARY_CLOUD_NAME = your_cloudinary_name
     VITE_CLOUDINARY_UPLOAD_PRESET = your_upload_preset
     VITE_API_URL = https://your-api-endpoint.com
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (5-10 minutes)
   - Test the deployment URL

## What Each File Does

### vercel.json
- Tells Vercel how to build the project
- Specifies pnpm as package manager
- Defines output directory
- Sets environment variable requirements
- Configures regions

### .vercelignore
- Prevents uploading unnecessary files
- Reduces build time and deployment size
- Keeps only needed artifacts

### pnpm-lock.yaml
- Lock file for dependency versions
- Ensures consistent builds across environments
- Automatically used during `pnpm install`

## Common Issues & Solutions

### Still Getting npm Error?

**Solution:**
1. Go to Vercel Project Settings
2. Go to "Build & Deployment" tab
3. Clear build cache:
   - Click the three dots (...)
   - Select "Clear all caches"
   - Redeploy

### Deployment Still Fails?

**Check:**
1. Verify environment variables are set (4 required vars)
2. Check Vercel build logs for specific errors
3. Try manually running locally:
   ```bash
   pnpm install
   pnpm --filter @workspace/bloombook run build
   ```

### Build Times Out?

**Solution:**
- Vercel build timeout is 60 minutes for Pro plan
- Check for large files or slow installs
- Clear cache and rebuild

## Verification

After deployment:
1. Visit the deployment URL
2. Check that images load (Cloudinary integration)
3. Test navigation between pages
4. Check browser console for errors
5. Test file upload feature

## Monitoring Deployment

- **Vercel Dashboard** - Real-time build status
- **Deployment Logs** - Detailed build output
- **Performance** - Web Vitals and metrics
- **Analytics** - Traffic and user insights

## Rollback

If deployment has issues:
1. Go to Vercel Deployments tab
2. Find previous working deployment
3. Click the three dots
4. Select "Promote to Production"

## Support

For additional help:
1. Check Vercel Documentation: https://vercel.com/docs
2. Review VERCEL_SETUP.md for detailed guide
3. Check GitHub Issues for known problems
4. Email support: support@vercel.com

---

**Status:** Vercel deployment now properly configured  
**Build System:** pnpm monorepo  
**Package Manager:** pnpm@10.17.1  
**Node Version:** 20.x
