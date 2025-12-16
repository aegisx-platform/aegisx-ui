# CSS Architecture Summary (ฉบับสั้น)

## 🎯 ความเข้าใจโดยรวม

### **aegisx-ui Library ด้าน (ฝั่งห้องสมุด)**

```
libs/aegisx-ui/src/lib/styles/
├─ vendor/fuse/user-themes.scss .......... 🎨 สีของ theme (brand, teal, rose, etc.)
├─ vendor/fuse/themes.scss .............. 📝 ตัวอักษรสำหรับสร้างกฎ Material (reference only)
├─ vendor/fuse/main.scss ................ 📋 ประสานงาน SCSS
├─ ax.scss ............................ ⭐ Main styles
└─ index.scss ......................... 🚪 Entry point
```

**ตัวอักษร**:

- `user-themes.scss`: กำหนดจานสีทั้งหมด (primary, accent, warn)
- `themes.scss`: loop ผ่าน themes และสร้าง Material color rules
- **ทั้งสองไฟล์นี้ถูกรวมเข้า** ตอนที่ build library

### **Web Application ด้าน (ฝั่งแอพ)**

```
apps/web/src/
├─ styles.scss ........................ 🎭 Global styles ของแอพ
│  ├─ Material fixes
│  ├─ Tailwind CSS
│  └─ CSS variables
└─ styles/components/
   ├─ _material-fixes.scss
   └─ _form-utilities.scss
```

**สำคัญ**: ❌ **ไม่นำเข้า** library SCSS files

---

## ⚙️ Configuration ที่จำเป็น

### **1. tsconfig.base.json**

```json
{
  "paths": {
    "@aegisx/ui": ["libs/aegisx-ui/src/index.ts"]
  }
}
```

**สำหรับ**: TypeScript imports (NOT for SCSS)

### **2. angular.json** (Web Build)

```json
{
  "build": {
    "options": {
      "styles": ["apps/web/src/styles.scss"]
    }
  }
}
```

**หมายความ**: เพียงคอมไพล์ `apps/web/src/styles.scss` เท่านั้น

### **3. aegisx-ui library.json** (Library Build)

```json
{
  "build": {
    "options": {
      "styles": ["libs/aegisx-ui/src/lib/styles/index.scss"]
    }
  }
}
```

**หมายความ**: เพียงคอมไพล์ library styles เท่านั้น

---

## 🔄 Flow ของ CSS/Theme

```
┌─────────────────────────────────────────────────────┐
│ 1. BUILD TIME (pnpm nx build aegisx-ui)           │
├─────────────────────────────────────────────────────┤
│ user-themes.scss (color definitions)               │
│           ↓ combined in SCSS                        │
│ themes.scss (generation logic)                     │
│           ↓ compiled to CSS                         │
│ Compiled CSS in dist/ folder                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 2. APPLICATION START (pnpm nx serve web)           │
├─────────────────────────────────────────────────────┤
│ M3ThemeService initializes                         │
│           ↓                                         │
│ Reads from localStorage or system preference      │
│           ↓                                         │
│ applyTheme() called                               │
│           ↓                                         │
│ 1. Apply .theme-brand class to <html>            │
│ 2. Apply .light/.dark class to <html>            │
│ 3. Call injectThemeCss(theme) ← 🔑 KEY STEP      │
│           ↓                                         │
│ generateThemeCss() creates CSS rules              │
│           ↓                                         │
│ <style> tag injected to <head>                    │
│           ↓                                         │
│ Material components get colors ✅                 │
└─────────────────────────────────────────────────────┘
```

---

## 📝 ตัวอย่าง: User Switch Theme

```typescript
// M3ThemeService
setTheme(themeId: 'brand') {
  this._currentTheme.set('brand');              // ❶ Update signal
  localStorage.setItem('m3-theme-id', 'brand');  // ❷ Persist
  this.applyTheme();                             // ❸ Apply to DOM
}

private applyTheme() {
  // ❶ Apply CSS classes
  root.classList.add('theme-brand');
  root.classList.add('light');  // or 'dark'

  // ❷ Inject theme CSS
  this.injectThemeCss(theme);  // Creates <style> tag
}

private injectThemeCss(theme) {
  // Remove old <style>
  if (this.themeStyleElement) {
    this.themeStyleElement.parentNode.removeChild(this.themeStyleElement);
  }

  // Create new <style> with CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = this.generateThemeCss(theme);

  // Inject to <head>
  document.head.appendChild(styleElement);
}

private generateThemeCss(theme) {
  return `
    .theme-brand button[mat-raised-button][color="primary"] {
      background-color: #2196f3 !important;
      color: #ffffff !important;
    }
    /* ... more rules ... */
  `;
}
```

**HTML Result**:

```html
<html class="light theme-brand">
  <head>
    <style id="dynamic-theme-styles">
      .theme-brand button[mat-raised-button][color='primary'] {
        background-color: #2196f3 !important;
      }
    </style>
  </head>
  <body>
    <button mat-raised-button color="primary">Click</button>
    <!-- ↑ Gets color #2196f3 from the injected <style> -->
  </body>
</html>
```

---

## ✅ Configuration Checklist

### **สำหรับ New Project / New App**

- [ ] **Library Build Setup**
  - [ ] Create `libs/your-lib/src/lib/styles/index.scss` as entry point
  - [ ] All component styles imported in index.scss
  - [ ] Theme colors in separate SCSS file

- [ ] **Web App Build Setup**
  - [ ] Set `styles: ["apps/your-app/src/styles.scss"]` in angular.json
  - [ ] Import only app-specific styles (Material fixes, form utilities)
  - [ ] Don't import library SCSS files

- [ ] **Theme Service Setup**
  - [ ] M3ThemeService in library's theme/ folder
  - [ ] Implements `injectThemeCss()` method
  - [ ] Generates CSS rules dynamically

- [ ] **TypeScript Config**
  - [ ] Path alias in tsconfig.base.json
  - [ ] Only for TypeScript imports, NOT SCSS

---

## 🚫 Common Mistakes to Avoid

```scss
/* ❌ DON'T: Try to import library SCSS from web app */
@import '@aegisx/ui/styles/vendor/fuse/themes.scss';
// Error: Can't find stylesheet to import

/* ❌ DON'T: Use relative paths */
@import '../../../libs/aegisx-ui/src/lib/styles/themes.scss';
// Breaks in different build contexts

/* ❌ DON'T: Put theme definitions in web app */
$my-theme: (primary: #2196f3, ...);
// Should be in library

/* ✅ DO: Use runtime CSS injection */
const styleElement = document.createElement('style');
styleElement.textContent = generatedCss;
document.head.appendChild(styleElement);
```

---

## 📚 File Locations

| ไฟล์               | ตำแหน่ง                                      | บทบาท                |
| ------------------ | -------------------------------------------- | -------------------- |
| user-themes.scss   | `libs/aegisx-ui/src/lib/styles/vendor/fuse/` | 🎨 Theme colors      |
| themes.scss        | `libs/aegisx-ui/src/lib/styles/vendor/fuse/` | 📝 Generation logic  |
| M3ThemeService     | `libs/aegisx-ui/src/lib/services/theme/`     | 🔑 Runtime injection |
| index.scss         | `libs/aegisx-ui/src/lib/styles/`             | 🚪 Library entry     |
| styles.scss        | `apps/web/src/`                              | 🎭 App global styles |
| angular.json       | Root                                         | ⚙️ Build config      |
| tsconfig.base.json | Root                                         | ⚙️ TypeScript config |

---

## 🎓 Key Concepts

1. **Library = Themes Own** (aegisx-ui)
   - Defines theme colors
   - Provides theme service
   - Self-contained

2. **App = Theme Consumer** (web)
   - Uses M3ThemeService
   - Doesn't manage theme SCSS
   - Focuses on app-specific styles

3. **SCSS = Build Time** (compile during `pnpm nx build`)
   - Library SCSS compiled to CSS in dist/

4. **Runtime Injection = Theme Application** (at runtime)
   - Create `<style>` tags dynamically
   - Inject when theme changes
   - No page reload needed

---

## 💡 เคล็ดลับ

**ตรวจสอบว่า theme ทำงานหรือไม่**:

1. Open DevTools (F12)
2. Elements tab → `<html>` element
3. Check: `class="light theme-brand"` ✓
4. Check: `<style id="dynamic-theme-styles">` in `<head>` ✓
5. Check: CSS rules inside `<style>` ✓
6. Check: localStorage `m3-theme-id` = "brand" ✓

**ถ้าหา theme color ไม่เจอ**:

- Console tab → check errors
- Network tab → aegisx-ui loaded ✓
- M3ThemeService injected CSS ✓
