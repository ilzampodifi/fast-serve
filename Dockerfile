# Use the official Bun image
FROM oven/bun:1 AS base

# Set working directory
WORKDIR /app

# Copy package.json and bun.lock for dependency installation
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy source code and build
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-slim AS production

WORKDIR /app

# Copy built application from build stage
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./

# Expose port (adjust if your app uses a different port)
EXPOSE 3000

# Run the built application
CMD ["bun", "run", "dist/server.js"]
