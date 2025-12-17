# AegisX UI Component Library

**Quick Navigation:** This document serves as a bridge between monorepo documentation and the standalone AegisX UI library documentation.

**For detailed component API, examples, and guides, see:** [`libs/aegisx-ui/docs/`](../../../libs/aegisx-ui/docs/)

---

## Table of Contents

1. [Overview](#overview)
2. [Documentation Organization](#documentation-organization)
3. [Quick Examples](#quick-examples)
4. [Component Categories](#component-categories)
5. [Key Documentation Links](#key-documentation-links)
6. [Integration with Monorepo](#integration-with-monorepo)

---

## Overview

AegisX UI is a comprehensive Angular component library providing 60+ production-ready components built on Material Design 3 principles. It's designed for both standalone usage and integration within the AegisX monorepo.

**Key Features:**

- 🎨 Material Design 3 token system
- 🌓 Automatic light/dark theme support
- 📘 Full TypeScript support with type safety
- ♿ Accessibility-first (WCAG 2.1 AA compliant)
- 📱 Responsive and mobile-friendly
- 📚 Comprehensive API documentation

---

## Documentation Organization

The AegisX UI library maintains **self-contained documentation** in the library directory to support standalone usage when published to npm as `@aegisx/ui`.

### Documentation Structure

```
libs/aegisx-ui/docs/              # Library documentation (standalone)
├── component-overview.md         # Component catalog with all 60+ components
├── THEMING_GUIDE.md             # Material-First theming approach
├── TOKEN_REFERENCE.md           # Design token reference
└── components/                   # Detailed component documentation
    ├── data-display/
    ├── forms/
    ├── feedback/
    ├── navigation/
    ├── layout/
    ├── theme/
    ├── auth/
    └── integrations/

docs/reference/ui/                # Monorepo cross-references
└── aegisx-ui-overview.md        # This file (navigation hub)
```

### Relationship Between Monorepo and Library Docs

**Library Documentation (`libs/aegisx-ui/docs/`):**

- Self-contained for standalone library usage
- Syncs to GitHub: `aegisx-platform/aegisx-ui`
- Published with npm package `@aegisx/ui`
- Contains complete API references and examples
- **This is the primary source of truth for component documentation**

**Monorepo Documentation (`docs/`):**

- Links to library docs for component details
- Contains integration guides for the full monorepo
- Documents monorepo-specific workflows and architecture

**Rule:** Monorepo docs link to library docs, not duplicate content.

---

## Quick Examples

### Basic Component Usage

```typescript
// Import standalone components
import { AxCardComponent, AxButtonComponent } from '@aegisx/ui';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AxCardComponent, AxButtonComponent],
  template: `
    <ax-card>
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard</p>
      <ax-loading-button (click)="save()"> Save Changes </ax-loading-button>
    </ax-card>
  `,
})
export class DashboardComponent {}
```

### Form Integration

```typescript
import { FormControl } from '@angular/forms';
import { AxDatePickerComponent } from '@aegisx/ui';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [AxDatePickerComponent, ReactiveFormsModule],
  template: ` <ax-date-picker [formControl]="dateControl" placeholder="Select date" [minDate]="minDate" /> `,
})
export class BookingComponent {
  dateControl = new FormControl(new Date());
  minDate = new Date();
}
```

### Theme Switching

```typescript
import { AxThemeSwitcherComponent } from '@aegisx/ui';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AxThemeSwitcherComponent],
  template: ` <ax-theme-switcher [themes]="['light', 'dark', 'auto']" [currentTheme]="theme" (themeChange)="onThemeChange($event)" /> `,
})
export class HeaderComponent {
  theme = 'auto';

  onThemeChange(newTheme: string) {
    this.theme = newTheme;
    // Theme persisted automatically
  }
}
```

**For more examples, see the detailed component documentation.**

---

## Component Categories

AegisX UI provides 60+ components organized into 8 categories:

### 1. Data Display (16 components)

Display data in various formats - calendars, cards, charts, lists, timelines, badges, etc.

**Popular components:**

- `ax-calendar` - Full-featured calendar with event management
- `ax-card` - Flexible content container with Material elevation
- `ax-kpi-card` - Key performance indicator display
- `ax-timeline` - Chronological event visualization

**📖 [View all Data Display components →](../../../libs/aegisx-ui/docs/component-overview.md#data-display)**

### 2. Forms (6 components)

Advanced form inputs with Angular Forms integration.

**Popular components:**

- `ax-date-picker` - Date selection with Thai Buddhist calendar support
- `ax-scheduler` - Combined date and time selection
- `ax-input-otp` - One-time password input with auto-focus
- `ax-time-slots` - Time slot selection grid

**📖 [View all Forms components →](../../../libs/aegisx-ui/docs/component-overview.md#forms)**

### 3. Feedback (12 components)

User feedback and loading states.

**Popular components:**

- `ax-loading-button` - Button with integrated loading state
- `ax-skeleton` - Placeholder loading animation
- `ax-error-state` - Error messages with recovery actions
- `ax-empty-state` - No data / empty list feedback

**📖 [View all Feedback components →](../../../libs/aegisx-ui/docs/component-overview.md#feedback)**

### 4. Navigation (13 components)

Navigation menus, drawers, breadcrumbs, and command palettes.

**Popular components:**

- `ax-navigation` - Main navigation with Angular Router
- `ax-drawer` - Side drawer navigation panel
- `ax-launcher` - Application launcher grid
- `ax-command-palette` - Keyboard-driven command interface

**📖 [View all Navigation components →](../../../libs/aegisx-ui/docs/component-overview.md#navigation)**

### 5. Layout (3 components)

Layout containers and grid systems.

**Components:**

- `ax-layout-switcher` - Switch between compact/enterprise layouts
- `ax-gridster` - Drag-and-drop dashboard grid (12-column)
- `ax-splitter` - Resizable split panels

**📖 [View all Layout components →](../../../libs/aegisx-ui/docs/component-overview.md#layout)**

### 6. Theme (6 components)

Theme customization and color tools.

**Popular components:**

- `ax-theme-builder` - Interactive theme customization tool
- `ax-theme-switcher` - Light/dark theme toggle
- `ax-color-palette-editor` - Edit Material 3 color palettes
- `ax-image-color-extractor` - Extract colors from images

**📖 [View all Theme components →](../../../libs/aegisx-ui/docs/component-overview.md#theme)**

### 7. Auth (7 components)

Authentication forms and layouts.

**Components:**

- `ax-login-form` - User login with social auth support
- `ax-register-form` - User registration
- `ax-forgot-password-form` - Password reset request
- `ax-reset-password-form` - Password reset with token validation

**📖 [View all Auth components →](../../../libs/aegisx-ui/docs/component-overview.md#auth)**

### 8. Integrations (3 components)

External service integrations.

**Components:**

- `ax-file-upload` - File upload with drag-and-drop
- `ax-qrcode` - QR code generator (vCard, WiFi, URL)
- `ax-signature-pad` - Digital signature capture

**📖 [View all Integrations components →](../../../libs/aegisx-ui/docs/component-overview.md#integrations)**

---

## Key Documentation Links

### Component Documentation

- **[Component Overview](../../../libs/aegisx-ui/docs/component-overview.md)** - Complete component catalog with all 60+ components
- **[Data Display Components](../../../libs/aegisx-ui/docs/components/data-display/)** - Detailed docs for display components
- **[Forms Components](../../../libs/aegisx-ui/docs/components/forms/)** - Angular Forms integration guides
- **[Feedback Components](../../../libs/aegisx-ui/docs/components/feedback/)** - Loading states and error handling
- **[Navigation Components](../../../libs/aegisx-ui/docs/components/navigation/)** - Router integration patterns
- **[Layout Components](../../../libs/aegisx-ui/docs/components/layout/)** - Grid systems and responsive layouts
- **[Theme Components](../../../libs/aegisx-ui/docs/components/theme/)** - Theme customization
- **[Auth Components](../../../libs/aegisx-ui/docs/components/auth/)** - Authentication forms
- **[Integration Components](../../../libs/aegisx-ui/docs/components/integrations/)** - External service integrations

### Theming & Styling

- **[Theming Guide](../../../libs/aegisx-ui/docs/THEMING_GUIDE.md)** - Material-First theming approach with design tokens
- **[Token Reference](../../../libs/aegisx-ui/docs/TOKEN_REFERENCE.md)** - Complete design token documentation

### Library Information

- **[Component Overview](../../../libs/aegisx-ui/docs/component-overview.md)** - Complete component index and quick start
- **[Component Source](../../../libs/aegisx-ui/src/lib/components/)** - TypeScript source code

---

## Integration with Monorepo

### Using AegisX UI in Monorepo Apps

When using AegisX UI components within the monorepo (e.g., in `apps/admin/` or `apps/web/`), import from the library path:

```typescript
// In monorepo apps
import { AxCardComponent, AxButtonComponent } from '@aegisx/ui';

// NOT: import from relative paths
// ❌ import { AxCardComponent } from '../../../libs/aegisx-ui/src/...';
```

### Monorepo-Specific Integration Guides

For integration with other monorepo features:

- **Frontend Architecture:** [docs/architecture/frontend-architecture.md](../../architecture/frontend-architecture.md)
- **Backend Integration:** [docs/architecture/backend-architecture.md](../../architecture/backend-architecture.md)
- **Feature Development:** [docs/guides/development/feature-development-standard.md](../../guides/development/feature-development-standard.md)

### Development Workflow

When developing new components or features:

1. **Plan:** Follow [Feature Development Standard](../../guides/development/feature-development-standard.md)
2. **Backend:** Use [API-First Standard](../../guides/development/api-calling-standard.md)
3. **Frontend:** Integrate AegisX UI components following component docs
4. **Test:** Follow [QA Checklist](../../guides/development/qa-checklist.md)

---

## Getting Started

### For New Developers

1. **Read the Component Overview:** Start with [`libs/aegisx-ui/docs/component-overview.md`](../../../libs/aegisx-ui/docs/component-overview.md) to see all available components

2. **Explore Component Categories:** Browse by category to find components for your use case

3. **Read Detailed Component Docs:** Each component has comprehensive documentation with:
   - Complete API reference (inputs, outputs, methods)
   - Basic and advanced usage examples
   - Styling and theming options
   - Accessibility guidelines
   - Integration patterns

4. **Check the Theming Guide:** Understand theming with [`THEMING_GUIDE.md`](../../../libs/aegisx-ui/docs/THEMING_GUIDE.md)

### For Component Selection

**Need to display data?** → [Data Display components](../../../libs/aegisx-ui/docs/component-overview.md#data-display)
**Building forms?** → [Forms components](../../../libs/aegisx-ui/docs/component-overview.md#forms)
**Need loading/error states?** → [Feedback components](../../../libs/aegisx-ui/docs/component-overview.md#feedback)
**Building navigation?** → [Navigation components](../../../libs/aegisx-ui/docs/component-overview.md#navigation)
**Customizing theme?** → [Theme components](../../../libs/aegisx-ui/docs/component-overview.md#theme)
**Building auth flows?** → [Auth components](../../../libs/aegisx-ui/docs/component-overview.md#auth)

---

## Support & Resources

### Documentation

- **Component Docs:** [`libs/aegisx-ui/docs/`](../../../libs/aegisx-ui/docs/)
- **Monorepo Docs:** [`docs/`](../../)

### External Resources

- **Material Design 3:** [m3.material.io](https://m3.material.io)
- **Angular:** [angular.dev](https://angular.dev)
- **Accessibility:** [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Library Repository

- **GitHub:** [aegisx-platform/aegisx-ui](https://github.com/aegisx-platform/aegisx-ui)
- **npm:** `@aegisx/ui`

---

**Last Updated:** 2025-12-17
**Monorepo Version:** 3.x
**Library Version:** 2.0.0
