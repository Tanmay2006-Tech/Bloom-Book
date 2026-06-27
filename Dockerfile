FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.17.1

# Copy only lockfile and package files first (for layer caching)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY artifacts/bloombook/package.json ./artifacts/bloombook/
COPY lib/*/package.json ./lib/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy entire project
COPY . .

# Build the application
RUN pnpm --filter @workspace/bloombook run build

# Expose the built application
EXPOSE 3000

# Serve the built application
CMD ["npx", "serve", "-s", "artifacts/bloombook/dist", "-l", "3000"]
