# Multi-stage Dockerfile for AegisX Web Application
# Stage 1: Build the Angular application
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
COPY apps/web/package*.json apps/web/ 2>/dev/null || true
COPY apps/web/project.json apps/web/
COPY apps/web/tsconfig*.json apps/web/

# Install all dependencies
RUN yarn install --frozen-lockfile --network-timeout 100000

# Copy source code
COPY apps/web/src apps/web/src/
COPY apps/web/public apps/web/public/
COPY libs/ libs/ 2>/dev/null || true

# Build the Angular application for production
RUN npx nx build web --configuration=production

# Stage 2: Production runtime with Nginx
FROM nginx:1.25-alpine AS runtime

# Install security updates
RUN apk update && apk upgrade && rm -rf /var/cache/apk/*

# Create non-root user for Nginx
RUN addgroup -g 1001 -S aegisx && \
    adduser -S aegisx -u 1001 -G aegisx

# Copy built application from builder stage
COPY --from=builder /app/dist/apps/web /usr/share/nginx/html

# Copy custom Nginx configuration
COPY apps/web/nginx.conf /etc/nginx/nginx.conf

# Create necessary directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R aegisx:aegisx /var/cache/nginx /var/log/nginx /var/run /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /var/run

# Switch to non-root user
USER aegisx

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]