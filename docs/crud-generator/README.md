# CRUD Generator Documentation

> Documentation has been consolidated to a single location

---

## Documentation Location

**All CRUD Generator documentation is now located at:**

```
libs/aegisx-cli/docs/
```

**[Go to Documentation](../../libs/aegisx-cli/docs/README.md)**

---

## Quick Links

| Document                                                             | Description                  |
| -------------------------------------------------------------------- | ---------------------------- |
| [README](../../libs/aegisx-cli/docs/README.md)                       | Main documentation hub       |
| [Quick Reference](../../libs/aegisx-cli/docs/QUICK_REFERENCE.md)     | All commands at a glance     |
| [Workflow Overview](../../libs/aegisx-cli/docs/WORKFLOW_OVERVIEW.md) | CLI architecture & workflows |
| [Events Guide](../../libs/aegisx-cli/docs/EVENTS_GUIDE.md)           | WebSocket real-time events   |
| [Import Guide](../../libs/aegisx-cli/docs/IMPORT_GUIDE.md)           | Bulk Excel/CSV import        |

---

## Why This Change?

Previously, documentation was scattered between:

- `docs/crud-generator/` (monorepo docs)
- `libs/aegisx-cli/docs/` (npm package docs)

Now, **all documentation lives in `libs/aegisx-cli/docs/`** because:

1. **Single Source of Truth** - One place to maintain
2. **Docs Travel with Package** - NPM users get complete documentation
3. **No Sync Issues** - Changes are immediate for all users

---

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

See [Monorepo Integration](../../libs/aegisx-cli/docs/README.md#pnpm-scripts-monorepo) for complete pnpm commands.

---

**Last Updated:** 2025-12-07
