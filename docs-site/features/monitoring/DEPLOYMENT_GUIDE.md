# Activity Tracking System - Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Activity Tracking System in production environments. It covers prerequisites, deployment steps, configuration, monitoring setup, and production best practices.

## Prerequisites

### System Requirements

#### Minimum Hardware Requirements

- **CPU**: 4 cores (8 cores recommended for high-volume)
- **RAM**: 8GB (16GB+ recommended)
- **Storage**: 100GB SSD (1TB+ for production)
- **Network**: 1Gbps connection

#### Software Requirements

- **Operating System**: Ubuntu 20.04+ / CentOS 8+ / Amazon Linux 2
- **Node.js**: 18.17.0+
- **PostgreSQL**: 15.0+
- **Redis**: 6.0+ (optional, for caching)
- **Nginx**: 1.20+ (reverse proxy)
- **Docker**: 20.10+ (if using containers)

### Database Requirements

#### PostgreSQL Configuration

```ini
# postgresql.conf - Production settings
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.7
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
```

#### Database User Setup

```sql
-- Create dedicated database user for activity tracking
CREATE USER activity_user WITH PASSWORD 'secure_password_here';
CREATE DATABASE activity_tracking_db OWNER activity_user;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE activity_tracking_db TO activity_user;

-- For production, use more restrictive permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO activity_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO activity_user;
```

## Deployment Steps

### Step 1: Environment Setup

#### 1.1 Create Deployment Directory

```bash
# Create application directory
sudo mkdir -p /opt/aegisx
sudo chown $USER:$USER /opt/aegisx
cd /opt/aegisx

# Clone repository
git clone https://github.com/your-org/aegisx-platform.git
cd aegisx-platform/aegisx-starter
```

#### 1.2 Install Dependencies

```bash
# Install Node.js dependencies
npm install --production

# Install PM2 for process management
sudo npm install -g pm2

# Install Nx globally (if needed)
sudo npm install -g nx
```

#### 1.3 Environment Configuration

```bash
# Create production environment file
cp .env.example .env.production

# Edit configuration
nano .env.production
```

```bash
# .env.production
NODE_ENV=production
API_PORT=3333
API_HOST=0.0.0.0

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=activity_tracking_db
DB_USER=activity_user
DB_PASSWORD=secure_password_here

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_here

# Activity Logging Configuration
ACTIVITY_LOGGING_ENABLED=true
ACTIVITY_LOGGING_ASYNC=true
ACTIVITY_LOGGING_BATCH_SIZE=100
ACTIVITY_LOGGING_FLUSH_INTERVAL=5000

# Security
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/aegisx/activity-tracking.log
```

### Step 2: Database Setup

#### 2.1 Run Database Migrations

```bash
# Run migrations
npm run db:migrate

# Seed initial data (if needed)
npm run db:seed
```

#### 2.2 Verify Database Setup

```bash
# Connect to database and verify tables
psql -h localhost -U activity_user -d activity_tracking_db -c "\dt"

# Check activity logs table structure
psql -h localhost -U activity_user -d activity_tracking_db -c "\d user_activity_logs"

# Verify indexes
psql -h localhost -U activity_user -d activity_tracking_db -c "SELECT indexname FROM pg_indexes WHERE tablename = 'user_activity_logs';"
```

### Step 3: Application Build

#### 3.1 Build Production Assets

```bash
# Build API
nx build api --configuration=production

# Build Web Application
nx build web --configuration=production

# Build Admin Panel (if applicable)
nx build admin --configuration=production
```

#### 3.2 Verify Build Output

```bash
# Check build artifacts
ls -la dist/apps/api/
ls -la dist/apps/web/

# Test API build
node dist/apps/api/main.js --help
```

### Step 4: Process Management Setup

#### 4.1 PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'aegisx-api',
      script: 'dist/apps/api/main.js',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3333,
      },
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: '/var/log/aegisx/api-error.log',
      out_file: '/var/log/aegisx/api-out.log',
      log_file: '/var/log/aegisx/api-combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
    },
  ],
};
```

#### 4.2 Start Application

```bash
# Create log directory
sudo mkdir -p /var/log/aegisx
sudo chown $USER:$USER /var/log/aegisx

# Start application with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Generate startup script
pm2 startup

# Follow the instructions provided by pm2 startup command
```

### Step 5: Reverse Proxy Setup

#### 5.1 Nginx Configuration

```nginx
# /etc/nginx/sites-available/aegisx-activity
upstream aegisx_api {
    least_conn;
    server 127.0.0.1:3333 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types application/json application/javascript text/css text/javascript;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=activity:10m rate=100r/m;

    # Activity API endpoints
    location /api/profile/activity {
        limit_req zone=activity burst=20 nodelay;
        proxy_pass http://aegisx_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # General API endpoints
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://aegisx_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://aegisx_api;
        access_log off;
    }

    # Activity logs (if serving frontend)
    location /activity {
        try_files $uri $uri/ /index.html;
        root /opt/aegisx/aegisx-platform/dist/apps/web;
        expires 1h;
    }
}
```

#### 5.2 Enable Nginx Configuration

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/aegisx-activity /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 6: SSL Certificate Setup

#### 6.1 Install Certbot

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Set up automatic renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Step 7: Monitoring Setup

#### 7.1 Application Monitoring

```bash
# Install monitoring tools
npm install -g clinic
npm install -g @pm2/pm2-server-monit

# Set up PM2 monitoring
pm2 install pm2-server-monit
```

#### 7.2 Log Rotation Setup

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/aegisx-activity
```

```bash
# /etc/logrotate.d/aegisx-activity
/var/log/aegisx/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 aegisx aegisx
    postrotate
        pm2 reload ecosystem.config.js
    endscript
}
```

#### 7.3 Database Monitoring

```sql
-- Create monitoring user
CREATE USER monitor WITH PASSWORD 'monitor_password';
GRANT CONNECT ON DATABASE activity_tracking_db TO monitor;
GRANT SELECT ON pg_stat_database TO monitor;
GRANT SELECT ON pg_stat_user_tables TO monitor;
GRANT SELECT ON pg_stat_user_indexes TO monitor;
```

### Step 8: Backup Configuration

#### 8.1 Automated Database Backups

```bash
#!/bin/bash
# /opt/aegisx/scripts/backup-activity-db.sh

BACKUP_DIR="/backup/activity-tracking"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="activity_tracking_db"
DB_USER="activity_user"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Full database backup
pg_dump -h localhost -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_DIR/full_backup_$DATE.sql.gz"

# Activity logs table backup (for faster restore)
pg_dump -h localhost -U "$DB_USER" -t user_activity_logs "$DB_NAME" | gzip > "$BACKUP_DIR/activity_logs_$DATE.sql.gz"

# Cleanup old backups (keep 30 days)
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete

# Log backup completion
echo "$(date): Database backup completed - $DATE" >> /var/log/aegisx/backup.log
```

#### 8.2 Schedule Backups

```bash
# Make script executable
chmod +x /opt/aegisx/scripts/backup-activity-db.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /opt/aegisx/scripts/backup-activity-db.sh
```

## Production Configuration

### Activity Logging Configuration

#### High-Volume Settings

```typescript
// Production configuration for high-volume activity logging
export const productionActivityConfig = {
  enabled: true,
  async: true,
  batchSize: 200, // Larger batches for better performance
  flushInterval: 3000, // Shorter interval for better responsiveness
  maxQueueSize: 10000, // Prevent memory exhaustion
  connectionPoolMin: 10, // Minimum database connections
  connectionPoolMax: 50, // Maximum database connections
  skipSuccessfulGets: true, // Reduce log volume
  includeRequestData: false,
  includeResponseData: false,
  logLevel: 'warn', // Only log warnings and errors
  enableMetrics: true, // Enable performance metrics
  enableHealthCheck: true, // Enable health monitoring
};
```

#### Security Settings

```typescript
export const securityConfig = {
  maskIpAddresses: true, // Mask IP addresses for privacy
  truncateUserAgents: true, // Truncate user agents
  encryptSensitiveData: true, // Encrypt sensitive metadata
  dataRetentionDays: 730, // Retain data for 2 years
  automaticCleanup: true, // Enable automatic cleanup
  rateLimit: {
    enabled: true,
    windowMs: 60000, // 1 minute window
    maxRequests: 100, // Max 100 requests per minute
    skipSuccessfulGets: true,
  },
};
```

### Database Optimization

#### Production Indexes

```sql
-- Additional production indexes for performance
CREATE INDEX CONCURRENTLY idx_user_activity_logs_composite
  ON user_activity_logs (user_id, action, created_at DESC);

CREATE INDEX CONCURRENTLY idx_user_activity_logs_severity_recent
  ON user_activity_logs (severity, created_at DESC)
  WHERE created_at > CURRENT_DATE - INTERVAL '30 days';

CREATE INDEX CONCURRENTLY idx_user_activity_logs_session_recent
  ON user_activity_logs (session_id, created_at DESC)
  WHERE session_id IS NOT NULL;

-- Partial index for error activities
CREATE INDEX CONCURRENTLY idx_user_activity_logs_errors
  ON user_activity_logs (user_id, created_at DESC, action, description)
  WHERE severity IN ('error', 'critical');
```

#### Maintenance Jobs

```sql
-- Create maintenance function
CREATE OR REPLACE FUNCTION maintain_activity_logs()
RETURNS void AS $$
BEGIN
  -- Update table statistics
  ANALYZE user_activity_logs;

  -- Reindex if fragmentation is high
  REINDEX INDEX CONCURRENTLY idx_user_activity_user_created;

  -- Vacuum if needed
  VACUUM ANALYZE user_activity_logs;

  -- Log maintenance completion
  INSERT INTO maintenance_log (table_name, operation, completed_at)
  VALUES ('user_activity_logs', 'maintenance', NOW());
END;
$$ LANGUAGE plpgsql;

-- Schedule weekly maintenance
SELECT cron.schedule('maintain-activity-logs', '0 1 * * 0', 'SELECT maintain_activity_logs();');
```

## Health Checks and Monitoring

### Application Health Checks

```bash
#!/bin/bash
# /opt/aegisx/scripts/health-check.sh

API_URL="http://localhost:3333"
HEALTH_ENDPOINT="$API_URL/health/activity-tracking"

# Check API health
response=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_ENDPOINT")

if [ "$response" = "200" ]; then
    echo "✓ Activity Tracking API is healthy"
    exit 0
else
    echo "✗ Activity Tracking API is unhealthy (HTTP $response)"

    # Restart API if unhealthy
    pm2 restart aegisx-api

    # Send alert (implement your alerting system)
    # /opt/aegisx/scripts/send-alert.sh "Activity Tracking API is down"

    exit 1
fi
```

### Database Health Checks

```sql
-- Database health check query
SELECT
  'Database Health' as check_type,
  CASE
    WHEN pg_is_in_recovery() THEN 'Replica'
    ELSE 'Primary'
  END as db_role,
  pg_database_size('activity_tracking_db') as db_size_bytes,
  (SELECT count(*) FROM user_activity_logs WHERE created_at > NOW() - INTERVAL '1 hour') as recent_activities,
  (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') as active_connections,
  NOW() as check_time;
```

### Performance Monitoring Queries

```sql
-- Monitor slow queries
SELECT
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
WHERE query LIKE '%user_activity_logs%'
ORDER BY mean_time DESC
LIMIT 10;

-- Monitor table statistics
SELECT
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  n_tup_hot_upd as hot_updates,
  n_live_tup as live_tuples,
  n_dead_tup as dead_tuples,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
WHERE tablename = 'user_activity_logs';
```

## Scaling Considerations

### Horizontal Scaling Setup

#### Load Balancer Configuration

```bash
# HAProxy configuration for multiple API instances
# /etc/haproxy/haproxy.cfg

global
    daemon
    maxconn 4096

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend activity_api_frontend
    bind *:80
    bind *:443 ssl crt /etc/ssl/certs/aegisx.pem
    redirect scheme https if !{ ssl_fc }
    default_backend activity_api_backend

backend activity_api_backend
    balance roundrobin
    option httpchk GET /health
    server api1 10.0.1.10:3333 check
    server api2 10.0.1.11:3333 check
    server api3 10.0.1.12:3333 check
```

#### Database Read Replicas

```bash
# PostgreSQL read replica setup
# On primary server
echo "host replication replica_user 10.0.1.20/32 md5" >> /etc/postgresql/15/main/pg_hba.conf

# postgresql.conf on primary
wal_level = replica
max_wal_senders = 3
checkpoint_completion_target = 0.9

# On replica server
pg_basebackup -h 10.0.1.10 -D /var/lib/postgresql/15/main -U replica_user -P -v -R -X stream -C
```

### Vertical Scaling Guidelines

#### CPU Scaling

- Monitor CPU usage during peak hours
- Scale CPU cores based on concurrent users
- Use PM2 cluster mode to utilize all cores

#### Memory Scaling

- Monitor memory usage patterns
- Increase heap size for Node.js: `--max-old-space-size=4096`
- Configure database shared_buffers appropriately

#### Storage Scaling

- Monitor database growth rate
- Plan for 2-3x growth capacity
- Use SSD storage for better I/O performance
- Consider partitioning for large datasets

## Troubleshooting

### Common Issues

#### High Memory Usage

```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head -10

# Check Node.js heap usage
node --inspect dist/apps/api/main.js
# Then use Chrome DevTools to monitor memory

# Fix: Increase Node.js memory limit
node --max-old-space-size=4096 dist/apps/api/main.js
```

#### Database Connection Issues

```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check connection limits
SHOW max_connections;

-- Kill long-running queries
SELECT
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

-- Kill specific connection
SELECT pg_terminate_backend(pid);
```

#### Performance Issues

```bash
# Check slow queries
tail -f /var/log/postgresql/postgresql.log | grep "slow query"

# Monitor API response times
curl -w "@curl-format.txt" -s -o /dev/null http://localhost:3333/api/profile/activity

# Profile application
clinic doctor -- node dist/apps/api/main.js
```

### Emergency Procedures

#### Database Failover

```bash
#!/bin/bash
# Emergency database failover script

PRIMARY_DB="10.0.1.10"
REPLICA_DB="10.0.1.20"

# Test primary database
if ! pg_isready -h "$PRIMARY_DB" -p 5432; then
    echo "Primary database is down, promoting replica..."

    # Promote replica to primary
    ssh root@"$REPLICA_DB" "pg_promote /var/lib/postgresql/15/main"

    # Update application configuration
    sed -i "s/$PRIMARY_DB/$REPLICA_DB/g" /opt/aegisx/.env.production

    # Restart application
    pm2 restart all

    echo "Failover completed. Replica is now primary."
fi
```

#### Application Recovery

```bash
#!/bin/bash
# Application recovery script

# Check if application is running
if ! curl -sf http://localhost:3333/health; then
    echo "Application is down, attempting recovery..."

    # Stop all processes
    pm2 stop all

    # Clear PM2 logs
    pm2 flush

    # Restart application
    pm2 start ecosystem.config.js --env production

    # Wait for startup
    sleep 30

    # Verify health
    if curl -sf http://localhost:3333/health; then
        echo "Application recovery successful"
    else
        echo "Application recovery failed - manual intervention required"
        exit 1
    fi
fi
```

## Security Hardening

### File Permissions

```bash
# Set proper file permissions
chown -R aegisx:aegisx /opt/aegisx
chmod -R 750 /opt/aegisx
chmod 600 /opt/aegisx/.env.production
chmod +x /opt/aegisx/scripts/*.sh
```

### Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow from 10.0.0.0/8 to any port 3333  # Internal network only
sudo ufw enable
```

### Database Security

```sql
-- Disable unnecessary extensions
DROP EXTENSION IF EXISTS plpython3u;
DROP EXTENSION IF EXISTS plpgsql CASCADE;
CREATE EXTENSION plpgsql;  -- Re-enable only if needed

-- Set secure password policy
ALTER SYSTEM SET password_encryption = 'scram-sha-256';

-- Limit connection attempts
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
```

---

This deployment guide provides comprehensive instructions for deploying the Activity Tracking System in production. Follow these steps carefully and adapt the configuration to your specific environment and requirements.
