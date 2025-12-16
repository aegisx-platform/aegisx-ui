---
title: 'UI Reference'
description: 'Complete UI documentation including components, themes, styling, and design systems'
category: reference
tags: [ui, components, themes, design, styling]
---

# UI Reference

Complete reference documentation for UI development in AegisX Platform. This section covers component standards, theming systems, design tokens, styling architecture, and the AegisX UI library.

## Quick Navigation

### Components

Reference documentation for all standard UI components with guidelines and examples.

- **[Badge](../../components/badge.md)** - Badge component standards
- **[Breadcrumb](../../components/breadcrumb.md)** - Navigation breadcrumb guidelines
- **[Dialog Standard](../../components/dialog-standard.md)** - Dialog/modal component patterns

### Themes

Theme configuration and customization guides for the application theming system.

- **[Theme System README](../../themes/README.md)** - Overview of Tremor theming architecture
- **[How to Add a Theme](../../themes/how-to-add-theme.md)** - Step-by-step guide for custom themes

### Styling

Core styling documentation, architecture patterns, and CSS best practices.

- **[CSS Architecture Summary](../../styling/css-architecture-summary.md)** - Overview of CSS organization
- **[Quick Reference](../../styling/quick-reference.md)** - Quick lookup for styling patterns
- **[Theme Setup Best Practices](../../styling/theme-setup-best-practices.md)** - Best practices for theme setup
- **[Theme System Setup Guide](../../styling/theme-system-setup-guide.md)** - Comprehensive setup guide

### Design System

Design system standards and token patterns for consistent UI development.

- **[CSS Token Patterns](../../design-system/css-token-patterns.md)** - Design token usage patterns

### Standards & Implementation

Core UI standards and implementation guidelines for the AegisX UI library.

- **[UI Standards](./aegisx-ui-standards.md)** - Mandatory development standards
- **[Theme System Standard](./theme-system-standard.md)** - Theme implementation standard
- **[Token Reference](./token-reference.md)** - Complete design token reference
- **[AegisX UI Implementation Guide](./aegisx-ui-implementation.md)** - Library implementation guide

## Key Sections

### For Component Development

Start with **[UI Standards](./aegisx-ui-standards.md)** to understand mandatory rules and conventions, then reference specific component documentation as needed.

### For Theme & Styling

- Read **[Theme System README](../../themes/README.md)** for architecture overview
- Use **[How to Add a Theme](../../themes/how-to-add-theme.md)** to implement custom themes
- Reference **[CSS Architecture Summary](../../styling/css-architecture-summary.md)** for styling structure
- Check **[Token Reference](./token-reference.md)** for available design tokens

### For Design Tokens

Consult **[CSS Token Patterns](../../design-system/css-token-patterns.md)** for token usage patterns and naming conventions.

### For Library Integration

Read **[AegisX UI Implementation Guide](./aegisx-ui-implementation.md)** for integrating the AegisX UI library into your application.

## Development Workflow

1. **Component Development**: Review [UI Standards](./aegisx-ui-standards.md) for mandatory rules
2. **Styling**: Reference [CSS Architecture](../../styling/css-architecture-summary.md) and [Theme System](../../themes/README.md)
3. **Design Tokens**: Use [Token Reference](./token-reference.md) for color and design token values
4. **Custom Themes**: Follow [How to Add a Theme](../../themes/how-to-add-theme.md)

## Technology Stack

- **Angular Material 20** - UI components
- **AegisX Design Tokens** - Design system (CSS custom properties)
- **Tailwind CSS** - Layout and utility classes
- **SCSS** - Advanced styling

## Design Principles

### Material-First Approach

Use Angular Material components directly rather than creating custom wrappers.

### Design Token-Driven Styling

Use CSS custom properties (design tokens) for colors to ensure theme consistency.

### Tailwind for Layout

Use Tailwind CSS for layout, spacing, and utility classes.

### Accessibility

All components must follow WCAG 2.1 AA standards as enforced in [UI Standards](./aegisx-ui-standards.md).

## Common Tasks

### Add a New Component

1. Reference [UI Standards](./aegisx-ui-standards.md) for development standards
2. Check existing components in [Components](../../components/) for patterns
3. Ensure accessibility compliance

### Add a Custom Theme

1. Follow [How to Add a Theme](../../themes/how-to-add-theme.md)
2. Use design tokens from [Token Reference](./token-reference.md)
3. Test with Material components

### Style a Component

1. Check [CSS Architecture](../../styling/css-architecture-summary.md) for file organization
2. Reference [Token Reference](./token-reference.md) for available tokens
3. Use [CSS Token Patterns](../../design-system/css-token-patterns.md) for implementation

## Related Documentation

- **[Frontend Architecture](../../architecture/frontend-architecture.md)** - Angular application architecture
- **[Angular Material Documentation](https://material.angular.io/)** - Material component reference
- **[Tailwind CSS Documentation](https://tailwindcss.com/)** - Tailwind utility reference

## File Structure

```
docs/reference/ui/
├── README.md (this file)
├── aegisx-ui-standards.md
├── aegisx-ui-implementation.md
├── theme-system-standard.md
├── token-reference.md
├── components/
│   ├── badge.md
│   ├── breadcrumb.md
│   └── dialog-standard.md
├── themes/
│   ├── README.md
│   └── how-to-add-theme.md
├── styling/
│   ├── css-architecture-summary.md
│   ├── quick-reference.md
│   ├── theme-setup-best-practices.md
│   └── theme-system-setup-guide.md
└── design-system/
    └── css-token-patterns.md
```

## Questions or Issues?

For UI-related questions:

1. Check this README for relevant section links
2. Review specific documentation files
3. Check components demo for live examples
4. Consult Angular Material documentation

---

**Last Updated:** 2025-12-16
