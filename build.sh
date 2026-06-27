#!/bin/bash
set -e

echo "Starting BloomBook Vercel build..."
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

# Enable pnpm via corepack
echo "Enabling pnpm via corepack..."
corepack enable pnpm
corepack prepare pnpm@10.17.1 --activate

# Verify pnpm is available
echo "pnpm version: $(pnpm --version)"

# Install dependencies with pnpm
echo "Installing dependencies with pnpm (frozen lockfile)..."
pnpm install --frozen-lockfile --verbose

# Build bloombook application
echo "Building BloomBook application..."
pnpm --filter @workspace/bloombook run build

echo "Build completed successfully!"
ls -lah artifacts/bloombook/dist/
