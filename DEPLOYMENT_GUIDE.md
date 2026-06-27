# BloomBook Deployment Guide

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Cloudinary account (for image/video uploads)

### Setup Environment Variables

Create `.env.production.local`:

```env
# Required: Cloudinary configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Optional: API configuration
VITE_API_BASE_URL=https://api.bloombook.app
```

### Build for Production

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Type check
pnpm run typecheck
```

### Deploy

The deployable outputs are:

1. **Frontend** - `artifacts/bloombook/dist/public/`
   - Deploy to CDN or static host
   - Enable compression (gzip already optimized)
   - Set cache headers: `public, max-age=31536000` for assets

2. **API Server** - `artifacts/api-server/dist/`
   - Node.js application
   - Requires environment variables
   - Runs on port specified in deployment config

3. **Mockup Viewer** - `artifacts/mockup-sandbox/dist/`
   - Optional component preview tool
   - Can be deployed separately

### Vercel Deployment

```bash
# Configure Vercel project
vercel env add VITE_CLOUDINARY_CLOUD_NAME
vercel env add VITE_CLOUDINARY_UPLOAD_PRESET

# Deploy
vercel deploy
```

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build
EXPOSE 5000
CMD ["node", "artifacts/api-server/dist/index.mjs"]
```

## Health Checks

### Pre-Deployment Verification

```bash
# 1. Type check passes
pnpm run typecheck

# 2. Build succeeds
pnpm run build

# 3. No critical dependencies vulnerable
pnpm audit --audit-level=moderate

# 4. All tests pass (if configured)
pnpm run test 2>/dev/null || echo "Tests not configured"
```

### Post-Deployment Verification

1. **Frontend Loads**
   - Navigate to app URL
   - Check browser console for errors
   - Verify layout on mobile device

2. **API Works**
   - Fetch health endpoint: `GET /api/health`
   - Test dashboard stats endpoint: `GET /api/dashboard/stats`

3. **Features Function**
   - Test file upload (requires Cloudinary)
   - Test navigation between sections
   - Test error states (disconnect network)

## Rollback Instructions

### Immediate Rollback

```bash
# Revert latest commit
git revert HEAD --no-edit

# Rebuild and redeploy
pnpm run build
vercel deploy --prod
```

### Data Recovery

- **User Data**: Check API database backups
- **Uploaded Files**: Check Cloudinary cloud
- **App State**: Cleared on page reload (no persistence)

## Monitoring

### Recommended Services

- **Error Tracking**: Sentry (JavaScript errors)
- **Analytics**: Plausible (privacy-focused)
- **Performance**: Web Vitals (Core Web Vitals)
- **Uptime**: UptimeRobot (health checks)

### Critical Metrics

Monitor these in production:

1. **API Response Time** < 200ms average
2. **Error Rate** < 1% of requests
3. **Page Load Time** < 3 seconds (4G)
4. **Uptime** > 99.5%

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Try again
pnpm run build
```

### Upload Not Working

Check Cloudinary environment variables:
```bash
# Verify variables are set
echo $VITE_CLOUDINARY_CLOUD_NAME
echo $VITE_CLOUDINARY_UPLOAD_PRESET
```

### Type Errors

```bash
# Check TypeScript version
pnpm list typescript

# Regenerate type definitions
pnpm run build --force
```

### Performance Issues

1. Enable compression on web server
2. Use CDN for static assets
3. Check bundle analyzer: `pnpm run build --report`
4. Review slow queries in API logs

## Version Management

### Track Versions

```bash
# Tag releases
git tag v1.0.0
git push origin v1.0.0

# View changelog
git log --oneline --graph
```

### Update Dependencies

```bash
# Check outdated packages
pnpm outdated

# Update minor versions
pnpm update

# Update major versions (with caution)
pnpm add package@latest
```

## Support & Maintenance

### Regular Maintenance

- **Weekly**: Review error logs for new issues
- **Monthly**: Update dependencies
- **Quarterly**: Security audit
- **Yearly**: Performance review

### Escalation Path

1. Check application logs
2. Review error tracking service
3. Check third-party service status (Cloudinary)
4. Review git history for recent changes
5. Contact development team

## Deployment Checklist

Before going live:

- [ ] Environment variables configured
- [ ] Build completes without errors
- [ ] Type checking passes
- [ ] No console errors on load
- [ ] File upload works
- [ ] Navigation works on mobile
- [ ] Error boundary displays on intentional errors
- [ ] Performance acceptable (< 3s load time)
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Monitoring/alerts set up

## Security Considerations

### API Security

- Use HTTPS only
- Implement rate limiting
- Validate all inputs
- Use environment variables for secrets
- Implement CORS properly

### Frontend Security

- Content Security Policy headers
- No sensitive data in localStorage
- XSS protection (React escapes by default)
- CSRF tokens for state-changing requests

### File Upload Security

- Validate file types server-side
- Limit file sizes
- Scan uploads for malware
- Use signed URLs for downloads
- Cloudinary handles most security

## Performance Optimization

### Already Implemented

- Code splitting by route
- Lazy loading of pages
- Gzip compression
- Tree-shaking unused code

### Additional Options

- Service Worker for offline support
- Image optimization (WebP, AVIF)
- HTTP/2 Server Push
- Edge caching with CDN

---

For questions about specific deployment platforms (AWS, Azure, GCP, Heroku), refer to their official documentation or contact your platform support.
