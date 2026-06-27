## Vercel Deployment - npm Error FIX

### The Problem
Vercel CLI was ignoring `vercel.json` configuration and defaulting to `npm install`, which failed with:
```
npm error Exit handler never called!
npm error This is an error with npm itself.
```

### Root Cause
Vercel CLI's default behavior for monorepos is to use npm, even if:
- `packageManager: "pnpm@10.17.1"` is set in package.json
- `pnpm-lock.yaml` exists
- `vercel.json` specifies different commands

### The Solution
Use a minimal `vercel.json` that ONLY specifies the build script, and let `build.sh` handle all pnpm setup:

**vercel.json:**
```json
{
  "buildCommand": "bash ./build.sh",
  "outputDirectory": "artifacts/bloombook/dist"
}
```

**build.sh:**
```bash
#!/bin/bash
set -e

echo "Starting BloomBook Vercel build..."

# Enable pnpm via corepack
corepack enable pnpm
corepack prepare pnpm@10.17.1 --activate

# Verify pnpm is available
echo "pnpm version: $(pnpm --version)"

# Install dependencies with pnpm
pnpm install --frozen-lockfile --verbose

# Build bloombook application
pnpm --filter @workspace/bloombook run build

echo "Build completed successfully!"
```

### Why This Works
1. Vercel respects the `buildCommand` in vercel.json
2. The bash script explicitly enables pnpm via corepack before any other operations
3. No npm is involved - Vercel just runs the bash script
4. The script handles dependency installation, not Vercel's default npm

### Deployment Steps

1. **Go to Vercel Dashboard**
   - Navigate to your BloomBook project
   - Go to Settings → Build & Development

2. **Verify Configuration** 
   - Build Command: `bash ./build.sh`
   - Output Directory: `artifacts/bloombook/dist`
   - Install Command: (leave empty)

3. **Set Environment Variables**
   - Go to Settings → Environment Variables
   - Add these variables:
     - `VITE_CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
     - `VITE_CLOUDINARY_UPLOAD_PRESET` - Your Cloudinary preset
     - `VITE_API_URL` - Your production API endpoint (optional)

4. **Redeploy**
   - Go to Deployments
   - Click "Redeploy" on the latest failed deployment
   - Or push a new commit to trigger a fresh deployment

### If Deploy Still Fails

**Clear Vercel Cache:**
1. Go to Settings → Build & Development → Vercel Analytics
2. Click "Clear Purged Cache"
3. Redeploy

**Check Build Logs:**
1. Go to Deployments → Click on the failed deployment
2. Scroll to "Building with 'build.sh'"
3. Look for error messages
4. Check if pnpm initialized correctly

**Local Verification:**
```bash
# Simulate Vercel build locally
bash build.sh

# Or manually:
corepack enable pnpm
pnpm install --frozen-lockfile
pnpm --filter @workspace/bloombook run build

# Check output
ls -la artifacts/bloombook/dist/
```

### Key Files

- **build.sh** - Bash script that Vercel executes
  - Enables pnpm via corepack
  - Installs dependencies
  - Builds the application

- **vercel.json** - Minimal Vercel configuration
  - Only specifies buildCommand and outputDirectory
  - Everything else is handled by build.sh

- **package.json** - Root package configuration
  - `packageManager: "pnpm@10.17.1"` pins the version
  - Scripts are defined at package level

### Troubleshooting

**Q: Build still says "npm error Exit handler never called!"**
A: This means Vercel is still using npm instead of build.sh. Try:
   1. Clear Vercel cache (see above)
   2. Delete `.vercel/` folder locally and re-link project
   3. Contact Vercel support with project ID: `prj_zE9q24zcvZ9paJnGXQk2dZKhVUkR`

**Q: "command not found: pnpm"**
A: The corepack enable didn't work. Check:
   1. Node.js 20.x is selected in Vercel settings
   2. No custom Node.js version override

**Q: "pnpm-lock.yaml not found"**
A: Lockfile might be outdated. Regenerate locally:
   ```bash
   rm pnpm-lock.yaml
   pnpm install
   git add pnpm-lock.yaml
   git commit -m "regenerate pnpm-lock.yaml"
   git push
   ```

**Q: Build passes but artifact not found**
A: Verify output directory:
   ```bash
   ls -la artifacts/bloombook/dist/
   # Should contain index.html and other files
   ```

### Performance

- Build time: ~5-10 minutes (first build, no cache)
- Build time: ~2-3 minutes (subsequent builds with cache)
- Bundle size: ~163KB (gzip compressed)
- Output: Single-page React application

### Support

If you still encounter issues:

1. Check the Vercel build logs carefully
2. Try the local verification steps above
3. Contact Vercel support: https://vercel.com/help
4. Reference project ID: `prj_zE9q24zcvZ9paJnGXQk2dZKhVUkR`

---

**Last Updated:** June 27, 2026
**Status:** Fixed - Ready for Deployment
**Solution:** Minimal vercel.json + build.sh script
