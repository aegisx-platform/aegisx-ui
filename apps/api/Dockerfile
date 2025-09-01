# Multi-stage Dockerfile for AegisX API
# Stage 1: Build dependencies and application
FROM node:20-alpine AS builder

# Install security updates and required packages
RUN apk update && apk upgrade && \
    apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json yarn.lock ./
COPY nx.json tsconfig.base.json ./

# Copy project-specific configurations
COPY apps/api/package*.json apps/api/
COPY apps/api/project.json apps/api/
COPY apps/api/tsconfig*.json apps/api/

# Install all dependencies (including devDependencies for building)
RUN yarn install --frozen-lockfile --network-timeout 100000

# Copy source code
COPY apps/api/src apps/api/src/
COPY libs/ libs/ 2>/dev/null || true

# Build the application
RUN npx nx build api --configuration=production

# Prune dependencies for production
RUN npx nx prune api

# Stage 2: Production runtime
FROM node:20-alpine AS runtime

# Install security updates
RUN apk update && apk upgrade && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S aegisx -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=aegisx:nodejs /app/dist/apps/api ./
COPY --from=builder --chown=aegisx:nodejs /app/dist/apps/api/node_modules ./node_modules/

# Create directory for logs
RUN mkdir -p /app/logs && chown aegisx:nodejs /app/logs

# Switch to non-root user
USER aegisx

# Expose application port
EXPOSE 3000

# Copy health check script
COPY --from=builder --chown=aegisx:nodejs /app/apps/api/src/healthcheck.js ./

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node healthcheck.js

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "main.js"]