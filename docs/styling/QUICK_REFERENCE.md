# Theme System - Quick Reference

## 🎨 ภาพรวมของ CSS Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MONOREPO STRUCTURE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────┐  ┌──────────────────────────────┐ │
│  │   aegisx-ui Library             │  │   web App                    │ │
│  │   (Owns Theme System)           │  │   (Consumes Themes)          │ │
│  ├─────────────────────────────────┤  ├──────────────────────────────┤ │
│  │                                 │  │                              │ │
│  │ libs/aegisx-ui/src/lib/styles/  │  │ apps/web/src/               │ │
│  │                                 │  │                              │ │
│  │ vendor/fuse/                    │  │ styles.scss                  │ │
│  │ ├─ user-themes.scss ............ │  │ ├─ Material fixes           │ │
│  │ │  🎨 COLOR DEFINITIONS       │  │ │ ├─ Form utilities          │ │
│  │ │  • brand (#2196f3)          │  │ │ └─ Tailwind CSS             │ │
│  │ │  • teal (#14b8a6)           │  │ │                              │ │
│  │ │  • rose (#f43f5e)           │  │ └─ styles/components/         │ │
│  │ │  • purple (#a855f7)         │  │    ├─ _material-fixes.scss   │ │
│  │ │  • amber (#f59e0b)          │  │    └─ _form-utilities.scss   │ │
│  │ │  • default (#4f46e5)        │  │                              │ │
│  │ │                             │  │                              │ │
│  │ ├─ themes.scss ............... │  │                              │ │
│  │ │  📝 GENERATION LOGIC       │  │                              │ │
│  │ │  (Reference only)           │  │                              │ │
│  │ │  Generates CSS rules        │  │                              │ │
│  │ │  for Material components   │  │                              │ │
│  │ │                             │  │                              │ │
│  │ └─ main.scss ................ │  │                              │ │
│  │    🔗 COORDINATOR            │  │                              │ │
│  │    Imports all styles        │  │                              │ │
│  │                                 │  │                              │ │
│  │ services/theme/                 │  │                              │ │
│  │ ├─ m3-theme.service.ts ........ │  │                              │ │
│  │ │  🔑 KEY SERVICE            │  │                              │ │
│  │ │  ✓ Applies CSS classes    │  │                              │ │
│  │ │  ✓ Injects <style> tags   │  │                              │ │
│  │ │  ✓ Generates CSS at runtime │  │                              │ │
│  │ │                             │  │                              │ │
│  │ ├─ m3-theme.types.ts          │  │                              │ │
│  │ └─ m3-color-utils.ts          │  │                              │ │
│  │                                 │  │                              │ │
│  │ components/                     │  │                              │ │
│  │ └─ ax-theme-switcher.component │  │ ← Integrated here            │ │
│  │    🎚️ UI for switching themes   │  │                              │ │
│  │                                 │  │                              │ │
│  └─────────────────────────────────┘  └──────────────────────────────┘ │
│                    ▲                              ▲                     │
│                    │ depends on                   │ uses               │
│                    └──────────────────────────────┘                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│  1. LIBRARY BUILD TIME (pnpm nx build aegisx-ui)                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  user-themes.scss (theme colors)                                        │
│        ↓                                                                │
│  themes.scss (generation logic) ← [Reference only for developers]      │
│        ↓                                                                │
│  index.scss (combines all)                                             │
│        ↓                                                                │
│  Compiled CSS in libs/dist/aegisx-ui-new/styles/                       │
│        ↓                                                                │
│  Package ready for use                                                 │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  2. APPLICATION RUNTIME (pnpm nx serve web)                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  App loads BootstrapApplication                                         │
│        ↓                                                                │
│  M3ThemeService injected (Angular provides)                            │
│        ↓                                                                │
│  Constructor runs:                                                     │
│  • initializeTheme() - loads from localStorage/system preference       │
│  • afterNextRender() - waits for DOM ready                            │
│        ↓                                                                │
│  applyTheme() called:                                                 │
│                                                                          │
│  ┌─ Step 1: Apply CSS Classes ──────────────────────────────────────┐ │
│  │ root.classList.add('light')        // or 'dark'                   │ │
│  │ root.classList.add('theme-brand')  // or other theme            │ │
│  │                                                                   │ │
│  │ Result HTML: <html class="light theme-brand">                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
│        ↓                                                                │
│  ┌─ Step 2: Inject Dynamic CSS ────────────────────────────────────┐ │
│  │ injectThemeCss(theme) {                                          │ │
│  │   const style = document.createElement('style')                 │ │
│  │   style.id = 'dynamic-theme-styles'                             │ │
│  │   style.textContent = generateThemeCss(theme)                   │ │
│  │   document.head.appendChild(style)                              │ │
│  │ }                                                                │ │
│  │                                                                   │ │
│  │ Result HTML: <style id="dynamic-theme-styles">                  │ │
│  │   .theme-brand button[mat-raised-button][color="primary"] {    │ │
│  │     background-color: #2196f3 !important;                       │ │
│  │     color: #ffffff !important;                                  │ │
│  │   }                                                              │ │
│  │ </style>                                                         │ │
│  └────────────────────────────────────────────────────────────────┘ │
│        ↓                                                                │
│  Material components now styled with theme color ✅                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  3. USER SWITCH THEME (user clicks AxThemeSwitcherComponent)            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  setTheme('teal') called                                               │
│        ↓                                                                │
│  _currentTheme.set('teal')              // Update signal             │
│        ↓                                                                │
│  localStorage.setItem('m3-theme-id', 'teal')  // Persist              │
│        ↓                                                                │
│  applyTheme() called (again)                                          │
│        ↓                                                                │
│  1. Remove old theme class: 'theme-brand'                            │
│  2. Add new theme class: 'theme-teal'                                │
│  3. Remove old injected <style>                                      │
│  4. Create new <style> with teal colors                              │
│  5. Inject to <head>                                                 │
│        ↓                                                                │
│  Material components now styled with TEAL color ✅                     │
│  No page reload needed! 🚀                                            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration Matrix

| Configuration      | Location                                 | Purpose                            | Example                                         |
| ------------------ | ---------------------------------------- | ---------------------------------- | ----------------------------------------------- |
| **Theme Colors**   | `libs/aegisx-ui/.../user-themes.scss`    | Define color palettes              | `brand: (primary: (#2196f3))`                   |
| **Theme Service**  | `libs/aegisx-ui/.../m3-theme.service.ts` | Manage theme state & injection     | `setTheme('brand')`                             |
| **Library Styles** | `libs/aegisx-ui/src/lib/styles/`         | SCSS entry point                   | `index.scss` imports all                        |
| **App Styles**     | `apps/web/src/styles.scss`               | App-specific styles only           | Material fixes, form utils                      |
| **Build Config**   | `angular.json`                           | Tell builder which SCSS to compile | `"styles": ["apps/web/src/styles.scss"]`        |
| **TS Aliases**     | `tsconfig.base.json`                     | Map `@aegisx/ui` to library        | `"@aegisx/ui": ["libs/aegisx-ui/src/index.ts"]` |

---

## ✅ Implementation Checklist

### **Library Setup**

```
☐ user-themes.scss has 6+ themes with selector property
☐ themes.scss exists (can be reference only)
☐ main.scss imports both files
☐ index.scss (in library root) imports main.scss
☐ M3ThemeService has injectThemeCss() method
☐ M3ThemeService has generateThemeCss() method
☐ AxThemeSwitcherComponent imports M3ThemeService
```

### **Web App Setup**

```
☐ apps/web/src/styles.scss imports Material fixes only
☐ NO library SCSS imports in web app
☐ angular.json has correct styles path
☐ M3ThemeService provided in bootstrap
☐ AxThemeSwitcherComponent placed in layout
☐ html element has correct theme & light/dark classes
```

### **Testing**

```
☐ pnpm nx build aegisx-ui succeeds
☐ pnpm nx serve web loads without errors
☐ Theme switcher visible in browser
☐ Clicking theme changes HTML classes
☐ <style id="dynamic-theme-styles"> appears in <head>
☐ Button colors change to selected theme
☐ localStorage has m3-theme-id and m3-theme-scheme
☐ Dark mode toggle works
☐ Theme persists after page reload
```

---

## 🐛 Debugging Quick Commands

```javascript
// In Browser Console (F12)

// Check if service loaded
localStorage.getItem('m3-theme-id'); // 'brand', 'teal', etc.
localStorage.getItem('m3-theme-scheme'); // 'light' or 'dark'

// Check HTML classes
document.documentElement.className; // Should have theme-* and light/dark

// Check injected CSS
document.getElementById('dynamic-theme-styles');
document.getElementById('dynamic-theme-styles').textContent;

// Monitor theme changes
Object.observe = (el) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      if (m.attributeName === 'class') {
        console.log('Classes changed:', el.className);
      }
    });
  });
  observer.observe(el, { attributes: true });
};
Object.observe(document.documentElement);
```

---

## 📝 File Structure Summary

```
aegisx-ui Library (owns themes):
├─ src/lib/styles/
│  ├─ index.scss ................................ ⭐ Entry
│  ├─ ax.scss ................................... Main styles
│  └─ vendor/fuse/
│     ├─ main.scss .............................. Coordinator
│     ├─ user-themes.scss ....................... 🎨 COLORS
│     ├─ themes.scss ............................ 📝 Logic (ref only)
│     └─ [component styles]
│
├─ src/lib/services/theme/
│  ├─ m3-theme.service.ts ....................... 🔑 KEY SERVICE
│  ├─ m3-theme.types.ts
│  └─ m3-color-utils.ts
│
└─ src/lib/components/
   └─ ax-theme-switcher.component ............. 🎚️ UI

web App (uses themes):
├─ src/styles.scss .............................. Only app-specific
├─ src/styles/components/
│  ├─ _material-fixes.scss
│  └─ _form-utilities.scss
└─ src/app/
   └─ app.component.ts (imports AxThemeSwitcherComponent)
```

---

## 💡 Key Concepts at a Glance

| Concept              | What                                   | Where              | When                        |
| -------------------- | -------------------------------------- | ------------------ | --------------------------- |
| **Theme Definition** | Color palettes (primary, accent, warn) | user-themes.scss   | Build time (reference only) |
| **Theme Service**    | Applies classes + injects CSS          | M3ThemeService     | Runtime                     |
| **CSS Injection**    | Dynamic `<style>` creation             | injectThemeCss()   | When user switches theme    |
| **Runtime Not SCSS** | Why not import SCSS directly           | TypeScript aliases | Path resolution issues      |
| **Material Theming** | How Material gets colors               | Dynamic CSS rules  | After injection             |

---

## 🎓 To Remember

✅ **Library owns themes** - centralized, reusable
✅ **App uses M3ThemeService** - no theme SCSS in web app
✅ **Runtime CSS injection** - flexible, no build issues
✅ **DevTools is your friend** - check HTML classes and `<style>` tag
✅ **localStorage persists** - theme remembered after reload

---

## 📞 Need Help?

1. **Theme colors not showing?**
   - Check: `<style id="dynamic-theme-styles">` in DevTools
   - Check: HTML has theme-\* class
   - Check: CSS rules in style tag

2. **Theme not switching?**
   - Check: AxThemeSwitcherComponent rendered
   - Check: M3ThemeService injected
   - Check: No JS errors in Console

3. **Theme doesn't persist?**
   - Check: localStorage has m3-theme-id
   - Check: initializeTheme() reads localStorage
   - Check: Browser privacy not blocking localStorage

---

**📚 Full guides available in:**

- `THEME_SYSTEM_SETUP_GUIDE.md` - Complete architecture
- `CSS_ARCHITECTURE_SUMMARY.md` - Detailed explanation
- `THEME_SETUP_BEST_PRACTICES.md` - Implementation steps
