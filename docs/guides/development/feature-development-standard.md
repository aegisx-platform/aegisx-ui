---
title: 'Feature Development Standard'
description: 'Standard workflow for developing new features in the AegisX Platform'
category: guides
tags: [development, workflow, standards]
---

# Feature Development Standard

> **🚨 MANDATORY STANDARD** - This standard MUST be followed for every feature development to ensure quality, maintainability, and prevent conflicts in multi-feature environments.

## 📋 **Feature Development Lifecycle**

### Phase 1: Planning & Documentation (MANDATORY)

### Phase 2: Backend Implementation

### Phase 3: Frontend Implementation

### Phase 4: Integration & Testing

### Phase 5: Documentation & Deployment

## 🔄 **Phase 2-5: Implementation Phases**

### 🚨 **MANDATORY Rules During Implementation**

1. **Progress Updates**: Update `PROGRESS.md` after completing each task
2. **Session Logging**: Add session entry every time you pause work
3. **Blocker Tracking**: Immediately document any blockers encountered
4. **Decision Recording**: Document all significant technical decisions
5. **File Tracking**: Maintain list of files created/modified

### 📊 **Daily Progress Updates**

```bash
# Update progress percentage after each completed task
# Log current work status when pausing
# Note any decisions or blockers encountered
```

### ✅ **Definition of Done**

A feature is considered complete when:

- [ ] All tasks in `TASKS.md` are checked
- [ ] All success criteria in `FEATURE.md` are met
- [ ] Progress shows 100% completion
- [ ] PR readiness checklist is complete
- [ ] Documentation is updated
- [ ] All tests are passing

## 🚨 **Claude Integration**

When Claude is working on features, it MUST:

1. **Always check** if feature documentation exists before coding
2. **Create documentation first** if starting a new feature
3. **Update progress** after completing each task
4. **Log session notes** when pausing work
5. **Follow the task order** defined in TASKS.md
6. **Check for conflicts** before making changes
7. **Validate completion** against Definition of Done

This standard ensures consistent, trackable, and maintainable feature development across all projects.
