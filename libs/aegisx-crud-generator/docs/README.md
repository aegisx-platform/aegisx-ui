# AegisX CLI Documentation

> Premium CRUD Generator for Angular + Fastify

---

## 📚 Documentation Index

### Getting Started

- **[Installation Guide](./INSTALLATION.md)** - Install, activate license, first steps
- **[Quick Reference](./QUICK_REFERENCE.md)** - All commands at a glance

### Feature Guides

- **[Shell Generation](./SHELL_GUIDE.md)** - Create Angular app shells
- **[WebSocket Events](./EVENTS_GUIDE.md)** - Real-time CRUD with `--with-events`
- **[Bulk Import](./IMPORT_GUIDE.md)** - Excel/CSV import with `--with-import`

### Advanced

- **[Template Development](./TEMPLATE_DEVELOPMENT_GUIDE.md)** - Create custom templates
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Upgrade from previous versions

---

## Quick Start

### 1. Install

```bash
npm install -g @aegisx/cli
```

### 2. Activate License

```bash
# Start 14-day trial
aegisx trial

# Or activate with license key
aegisx activate AEGISX-PRO-XXXXXXXX-XX
```

### 3. Generate Your First Module

```bash
# Backend CRUD
aegisx generate products --force

# Frontend CRUD
aegisx generate products --target frontend --force
```

---

## Features

- **Backend Generation** - Fastify routes, services, repositories, schemas
- **Frontend Generation** - Angular components with Material Design
- **Shell Generation** - Complete app layouts (simple, enterprise, multi-app)
- **WebSocket Events** - Real-time updates with `--with-events`
- **Bulk Import** - Excel/CSV import with `--with-import`
- **TypeBox Schemas** - Type-safe validation
- **Multi-Package** - Standard, Enterprise, Full packages

---

## Command Reference

### Generate Commands

```bash
# Basic CRUD
aegisx generate <table_name>

# Frontend
aegisx generate <table_name> --target frontend

# With events
aegisx generate <table_name> --with-events

# With import
aegisx generate <table_name> --with-import

# Full package (all features)
aegisx generate <table_name> --with-events --with-import
```

### Shell Commands

```bash
# Enterprise shell (default)
aegisx shell <name>

# Simple shell
aegisx shell <name> --type simple

# Multi-app shell
aegisx shell <name> --type multi-app
```

### License Commands

```bash
# Start trial
aegisx trial

# Activate
aegisx activate <key>

# Check status
aegisx license

# Deactivate
aegisx deactivate
```

---

## License Tiers

| Tier         | Price     | Developers | Features                  |
| ------------ | --------- | ---------- | ------------------------- |
| Trial        | Free      | 1          | 14 days, limited          |
| Professional | $49       | 1          | All features, 1yr updates |
| Team         | $199/year | Up to 10   | Priority support          |
| Enterprise   | Contact   | Unlimited  | On-premise, SLA           |

---

## Support

- **Documentation**: This folder (`docs/`)
- **Community**: GitHub Issues
- **Email**: support@aegisx.dev (Team/Enterprise)

---

**Copyright (c) 2024 AegisX Team. All rights reserved.**
