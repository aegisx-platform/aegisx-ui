---
title: 'AegisX CLI'
description: 'CRUD generator and CLI tools for AegisX Platform'
category: reference
tags: [cli, crud, generator]
---

# AegisX CLI Documentation (Monorepo)

> **Internal documentation for monorepo developers & maintainers**

## User Documentation

**[Go to User Docs](../../libs/aegisx-cli/docs/README.md)** - Complete CLI usage documentation

| Document                                                             | Description                  |
| -------------------------------------------------------------------- | ---------------------------- |
| [Quick Reference](../../libs/aegisx-cli/docs/QUICK_REFERENCE.md)     | All commands at a glance     |
| [Workflow Overview](../../libs/aegisx-cli/docs/WORKFLOW_OVERVIEW.md) | CLI architecture & workflows |
| [Events Guide](../../libs/aegisx-cli/docs/EVENTS_GUIDE.md)           | WebSocket real-time events   |
| [Import Guide](../../libs/aegisx-cli/docs/IMPORT_GUIDE.md)           | Bulk Excel/CSV import        |

## Monorepo-Specific Commands

For monorepo developers, use these pnpm shortcuts:

```bash
# Basic CRUD
pnpm run crud -- <table_name> --force

# With import
pnpm run crud:import -- <table_name> --force

# With events
pnpm run crud:events -- <table_name> --force

# Full package
pnpm run crud:full -- <table_name> --force

# List tables
pnpm run crud:list
```
