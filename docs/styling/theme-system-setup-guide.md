# Theme System Setup Guide

## 📋 Overview

This guide explains the CSS/SCSS architecture for the Material Design 3 theme system across the monorepo, covering both the **aegisx-ui library** and the **web application**. This prevents integration issues when adding themes in the future.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    WEB APPLICATION                          │
│                   (apps/web/src)                            │
├─────────────────────────────────────────────────────────────┤
│  styles.scss                                                │
│  ├─ Imports: Tailwind, Material fixes, form utilities       │
│  └─ NO imports of library themes (dynamic injection used)   │
└────────────────┬────────────────────────────────────────────┘
                 │ depends on
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              AEGISX-UI LIBRARY                              │
│          (libs/aegisx-ui/src/lib)                           │
├─────────────────────────────────────────────────────────────┤
│  styles/                                                    │
│  ├─ index.scss ................................. entry point
│  ├─ ax.scss .................................... main styles
│  ├─ tailwind.scss ............................... tailwind reset
│  │                                                          │
│  ├─ themes/                                                 │
│  │  ├─ default.scss ............................ light theme
│  │  └─ dark.scss ............................... dark theme  │
│  │                                                          │
│  └─ vendor/fuse/                                           │
│     ├─ main.scss ............................... coordinator
│     ├─ user-themes.scss ........................ ⭐ THEME COLORS
│     ├─ themes.scss ............................. ⭐ GENERATION LOGIC
│     ├─ angular-material.scss .................. Material fixes
│     └─ [other component styles]                           │
│                                                            │
│  services/theme/                                          │
│  ├─ m3-theme.service.ts .............. 🔑 RUNTIME INJECTION
│  ├─ m3-theme.types.ts ................. type definitions
│  └─ m3-color-utils.ts ................. color utilities
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 File Breakdown

### **1. aegisx-ui Library Styles**

#### **libs/aegisx-ui/src/lib/styles/vendor/fuse/user-themes.scss**

- **Purpose**: Define theme color palettes (brand, teal, rose, purple, amber, default)
- **Format**: SCSS map with theme definitions
- **Content**:
  ```scss
  $user-themes: (
    brand: (
      selector: '.theme-brand',
      primary: (
        50: #eff5fe,
        100: #e2ecfd,
        ...,
        DEFAULT: #2196f3,
      ),
      accent: (
        ...,
      ),
      warn: (
        ...,
      ),
    ), // ... other themes
  );
  ```
- **Key Point**: Each theme has a **selector** property that maps to a CSS class name

#### **libs/aegisx-ui/src/lib/styles/vendor/fuse/themes.scss**

- **Purpose**: Generate Material component color rules
- **What It Does**:
  ```scss
  @each $name, $theme in userThemes.$user-themes {
    // For each theme, generate:
    // 1. Light mode CSS rules
    // 2. Dark mode CSS rules
    // Using Material's @include mat.all-component-colors()
  }
  ```
- **Creates selectors like**:
  - `.theme-brand .light { ... Material colors ... }`
  - `.theme-brand.light { ... Material colors ... }`
  - `.theme-brand .dark { ... Material colors ... }`
  - `.theme-brand.dark { ... Material colors ... }`

#### **libs/aegisx-ui/src/lib/styles/index.scss**

- **Entry point** for all library styles
- Imports all SCSS modules in correct order
- **This file is compiled** when the library is built (`pnpm nx build aegisx-ui`)

### **2. Web Application Styles**

#### **apps/web/src/styles.scss**

- **Purpose**: Main global stylesheet for the web app
- **Current Setup**:

  ```scss
  /* Material Design fixes */
  @use 'styles/components/material-fixes' as *;
  @use 'styles/components/form-utilities' as *;

  /* Tailwind CSS */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  /* Global styles, CSS variables, etc. */
  ```

- **Does NOT import**: Library theme SCSS files
- **Why**: Library styles are already compiled in the aegisx-ui package and imported as JavaScript

#### **apps/web/src/styles/components/\_material-fixes.scss**

- Fixes for Material Design components
- Form utilities and Material-specific overrides

---

## 🎯 How Theme System Works (Current Implementation)

### **Step 1: Library Build Time**

```
pnpm nx build aegisx-ui
    ↓
Compiles: styles/vendor/fuse/themes.scss
    ↓
Combines: user-themes.scss + themes.scss + other styles
    ↓
Output: Compiled CSS in libs/dist/aegisx-ui-new/
```

### **Step 2: Application Runtime**

````
Application starts (pnpm nx serve web)
    ↓
Angular loads M3ThemeService
    ↓
Service initializes & loads theme from localStorage
    ↓
afterNextRender() hook triggers
    ↓
applyTheme() method runs:
  1. Applies .theme-brand class to <html>
  2. Applies .light or .dark class to <html>
  3. Calls injectThemeCss() ← 🔑 KEY STEP
    ↓
injectThemeCss() creates <style> tag:
  ```html
  <style id="dynamic-theme-styles">
    .theme-brand button[mat-raised-button][color="primary"] {
      background-color: #2196f3 !important;
      color: #ffffff !important;
    }
    /* ... more rules ... */
  </style>
````

    ↓

<style> tag injected into <head>
    ↓
Material components get the theme color! ✅
```

---

## ⚙️ Configuration Files

### **1. TypeScript Configuration (tsconfig.base.json)**
```json
{
  "compilerOptions": {
    "paths": {
      "@aegisx/ui": ["libs/aegisx-ui/src/index.ts"]
    }
  }
}
```
- **Purpose**: Maps `@aegisx/ui` import alias to the library
- **Used for**: TypeScript imports like `import { M3ThemeService } from '@aegisx/ui'`
- **NOT used for**: SCSS imports (SCSS doesn't understand TypeScript paths)

### **2. Angular Build Configuration (angular.json)**
```json
{
  "projects": {
    "web": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "apps/web/src/styles.scss"
            ]
          }
        }
      }
    }
  }
}
```
- **Purpose**: Tells Angular which SCSS files to compile
- **Note**: Only includes `apps/web/src/styles.scss`, not library styles

### **3. NX Configuration (nx.json / project.json)**
- Manages build targets and dependencies between projects
- When you run `pnpm nx build web`, it automatically builds `aegisx-ui` first

---

## ✅ Current Best Practices

### **DO:**

✅ **Keep theme SCSS in aegisx-ui library**
- Centralized location for all theme definitions
- Easy to maintain and update

✅ **Use runtime CSS injection for theme application**
```typescript
// In M3ThemeService.ts
private injectThemeCss(theme: M3Theme): void {
  const styleElement = this.document.createElement('style');
  styleElement.textContent = this.generateThemeCss(theme);
  this.document.head.appendChild(styleElement);
}
```
- Avoids SCSS import path resolution issues
- Works reliably across all environments
- Easy to debug (just look at injected `<style>` tag)

✅ **Define theme colors in user-themes.scss**
```scss
$user-themes: (
  my-theme: (
    selector: ".theme-my-theme",
    primary: (...),
    accent: (...),
    warn: (...)
  )
);
```

✅ **Use CSS class selectors in web app**
```html
<!-- applied by M3ThemeService -->
<html class="light theme-brand">
  <!-- Material components inherit colors -->
  <button mat-raised-button color="primary">Click me</button>
</html>
```

### **DON'T:**

❌ **Don't try to import library SCSS directly from web app**
```scss
/* ❌ WRONG - Will fail! */
@import '@aegisx/ui/styles/vendor/fuse/themes.scss';
@import '../../libs/aegisx-ui/src/lib/styles/vendor/fuse/themes.scss';
```
- SCSS loader doesn't resolve TypeScript path aliases
- Relative paths break in different build contexts
- Use runtime injection instead

❌ **Don't put theme SCSS in web app**
- Themes should be library-owned
- Easier to test and maintain in one place
- Web app focuses on application-specific styles

❌ **Don't rely on Material theme SCSS generation**
```scss
/* ❌ WRONG - Too complex and error-prone */
/* Just use dynamic CSS injection instead */
```

---

## 📋 Setup Checklist for New Themes

When adding a new theme in the future, follow this checklist:

### **Step 1: Add Theme Colors (in library)**
- [ ] Open `libs/aegisx-ui/src/lib/styles/vendor/fuse/user-themes.scss`
- [ ] Add new theme to `$user-themes` map:
  ```scss
  my-new-theme: (
    selector: ".theme-my-new-theme",
    primary: (50: #f0f9ff, 100: #e0f2fe, ..., DEFAULT: #0284c7),
    accent: (...),
    warn: (...)
  )
  ```

### **Step 2: Add Theme Definition (in service)**
- [ ] Open `libs/aegisx-ui/src/lib/services/theme/m3-theme.service.ts`
- [ ] Add to `themes` map:
  ```typescript
  'my-new-theme': {
    id: 'my-new-theme',
    name: 'My New Theme',
    seedColor: '#0284c7',
    description: 'Description of the theme'
  }
  ```

### **Step 3: Build and Test**
- [ ] Run `pnpm nx build aegisx-ui`
- [ ] Run `pnpm nx serve web`
- [ ] Open browser dev tools (F12)
- [ ] Click theme switcher
- [ ] Select new theme
- [ ] Verify:
  - [ ] HTML shows `class="light theme-my-new-theme"`
  - [ ] `<style id="dynamic-theme-styles">` exists in `<head>`
  - [ ] Button colors changed to new theme color
  - [ ] Persists in localStorage as `m3-theme-id: my-new-theme`

---

## 🔧 Troubleshooting

### **Problem: Colors not changing**
**Check**:
1. Browser DevTools → Elements tab
2. Look for `<style id="dynamic-theme-styles">` in `<head>`
3. Check if CSS rules are present
4. Check if `<html>` has correct theme class like `class="light theme-brand"`

### **Problem: SCSS import fails at build time**
**Solution**: Don't import library SCSS in web app. Use M3ThemeService instead.

### **Problem: Theme not persisting after page reload**
**Check**:
1. Browser Console → check localStorage: `localStorage.getItem('m3-theme-id')`
2. Make sure `initializeTheme()` in M3ThemeService is reading from localStorage
3. Check browser privacy settings aren't blocking localStorage

### **Problem: Dark mode not working**
**Check**:
1. `m3-theme-scheme` in localStorage should be `"dark"`
2. HTML should have `class="dark theme-brand"`
3. Browser prefers-color-scheme media query might be interfering

---

## 📚 File Reference Guide

| File | Location | Purpose |
|------|----------|---------|
| **user-themes.scss** | `libs/aegisx-ui/src/lib/styles/vendor/fuse/` | Theme color definitions |
| **themes.scss** | `libs/aegisx-ui/src/lib/styles/vendor/fuse/` | Material color generation (reference only) |
| **M3ThemeService** | `libs/aegisx-ui/src/lib/services/theme/` | 🔑 Runtime theme application |
| **m3-theme.types.ts** | `libs/aegisx-ui/src/lib/services/theme/` | TypeScript types |
| **styles.scss** | `apps/web/src/` | Web app global styles |
| **_material-fixes.scss** | `apps/web/src/styles/components/` | Material overrides |

---

## 🎓 Key Learnings

1. **Library vs App Separation**
   - Library: Owns theme definitions and components
   - App: Imports and uses library styles

2. **SCSS Path Resolution**
   - TypeScript path aliases (`@aegisx/ui`) don't work in SCSS
   - Use relative paths or let module bundler handle imports
   - Prefer runtime CSS injection to avoid path issues

3. **Material Design 3 Theming**
   - Material 2 uses SCSS `@include mat.all-component-colors()`
   - Material 3 (Material Design Color System) is different
   - Current approach uses dynamic CSS injection for flexibility

4. **Runtime Theming Pattern**
   - Create `<style>` tags dynamically
   - Inject into document `<head>`
   - Allows theme switching without page reload
   - Works across all browsers and environments

---

## 📞 Questions?

For more details, see:
- **M3ThemeService**: `/libs/aegisx-ui/src/lib/services/theme/m3-theme.service.ts`
- **Theme Colors**: `/libs/aegisx-ui/src/lib/styles/vendor/fuse/user-themes.scss`
- **Web App Styles**: `/apps/web/src/styles.scss`
