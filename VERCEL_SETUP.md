# Vercel Deployment Setup Guide

This guide helps you deploy BloomBook to Vercel successfully.

## Prerequisites

- GitHub repository (already set up)
- Vercel account (free at vercel.com)
- Cloudinary account for image/video hosting

## Step 1: Set Up Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Search for and select `Tanmay2006-Tech/Bloom-Book`
5. Click "Import"

## Step 2: Configure Project Settings

On the project import page:

### Framework Preset
- Select "Other" (since we use custom build)

### Root Directory
- Leave as default (Vercel will auto-detect)

### Build & Development Settings
- **Build Command**: `pnpm run build` (auto-detected from vercel.json)
- **Output Directory**: `artifacts/bloombook/dist` (auto-detected from vercel.json)
- **Install Command**: `pnpm install --frozen-lockfile` (auto-detected from vercel.json)

## Step 3: Set Environment Variables

In the "Environment Variables" section, add:

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Yes |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Your Cloudinary upload preset | Yes |
| `VITE_API_URL` | Your production API URL | Yes |
| `PORT` | `5173` (default, can override) | No |
| `BASE_PATH` | `/` (default) | No |

### How to Get Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Find "Cloud Name" at the top of the page
4. Create an unsigned upload preset:
   - Settings → Upload → Add upload preset
   - Signing Mode: Unsigned
   - Copy the preset name

## Step 4: Deploy

After configuring environment variables, click "Deploy".

Vercel will:
1. Clone your repository
2. Install dependencies with pnpm
3. Run build with `pnpm run build`
4. Deploy to production

## Deployment Success Indicators

✅ Build succeeds (check build logs)
✅ All environment variables are set
✅ Output directory is correct (`artifacts/bloombook/dist`)
✅ No "npm install" errors
✅ No build-time environment variable errors

## Common Issues & Solutions

### Issue: "npm install" Error

**Error**: `npm error Exit handler never called!`

**Cause**: Vercel was using npm instead of pnpm

**Solution**: 
- vercel.json is already configured with pnpm
- If error persists, go to Project Settings → General
- Verify "Install Command" shows pnpm

### Issue: "PORT environment variable not set"

**Error**: `Error: PORT environment variable is required but was not provided`

**Solution**:
- vite.config.ts now has default values
- If still fails, set PORT=5173 in environment variables

### Issue: "VITE_CLOUDINARY_CLOUD_NAME not set"

**Error**: `Error: VITE_CLOUDINARY_CLOUD_NAME is required but was not provided`

**Solution**:
1. Get your Cloud Name from Cloudinary Dashboard
2. Add to Vercel Environment Variables
3. Redeploy or clear cache and retry

### Issue: "Build output directory not found"

**Error**: `Error: Output directory "artifacts/bloombook/dist" not found`

**Solution**:
- Check build logs for actual errors
- Verify all dependencies installed correctly
- Check environment variables are set
- Try manual build locally: `pnpm run build`

### Issue: Builds Succeed but App Shows 404

**Cause**: vercel.json outputDirectory or routing issue

**Solution**:
1. Verify vercel.json outputDirectory: `artifacts/bloombook/dist`
2. Check build output contains dist files
3. In Vercel dashboard, go to Deployments → click latest
4. Check "Files" tab - should show HTML/JS files

## Monitoring Deployments

### View Build Logs
1. Go to Vercel dashboard
2. Click project → Deployments
3. Click on a deployment
4. View build logs in real-time or after completion

### View Live Site
- Click the deployment URL or "Visit" button
- Preview URLs available before production

### Rollback a Deployment
1. Go to Deployments
2. Click the deployment to restore
3. Click "Promote to Production"

## Environment Variables in Production

After initial setup, to update environment variables:

1. Go to Project Settings → Environment Variables
2. Edit or add new variables
3. All new deployments will use updated variables
4. To apply to current deployment, trigger a new build:
   - Push to main branch, OR
   - Go to Deployments → click "Redeploy"

## CI/CD Configuration

BloomBook uses automatic deployments:

- **Push to main**: Automatically deploys to production
- **Push to other branches**: Creates preview deployments
- **Pull requests**: Automatic preview deployment

Preview URL format: `https://bloom-book-git-<branch>-<org>.vercel.app`

## Custom Domain

To add a custom domain:

1. Go to Project Settings → Domains
2. Click "Add"
3. Enter your domain name
4. Follow DNS configuration steps
5. DNS verification typically takes 15-30 minutes

## SSL/TLS Certificates

Vercel automatically provides SSL certificates (no configuration needed).

- All deployments have HTTPS
- Certificates auto-renew
- No additional cost

## Performance & Analytics

View performance metrics:

1. Go to Analytics tab
2. Check Core Web Vitals
3. View traffic and performance trends

Monitor:
- **LCP (Largest Contentful Paint)**: < 2.5s (target)
- **CLS (Cumulative Layout Shift)**: < 0.1 (target)
- **INP (Interaction to Next Paint)**: < 100ms (target)

## Troubleshooting Checklist

Before contacting support:

- [ ] vercel.json exists and configured correctly
- [ ] All required environment variables set
- [ ] pnpm-lock.yaml in repository
- [ ] Build succeeds locally: `pnpm run build`
- [ ] Check build logs for specific errors
- [ ] Node.js version correct (20.x)
- [ ] Output directory contains dist files

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **pnpm Monorepo**: https://pnpm.io/workspaces
- **Build Logs**: Available in Vercel dashboard
- **Community**: https://vercel.com/support

## Next Steps

After successful deployment:

1. Set up custom domain (optional)
2. Configure analytics monitoring
3. Set up error tracking (Sentry, etc.)
4. Test all features in production
5. Monitor performance metrics

---

**Last Updated**: June 27, 2026  
**Vercel Status**: ✅ Configured & Ready
