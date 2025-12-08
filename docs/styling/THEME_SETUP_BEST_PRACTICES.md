# Theme Setup Best Practices

## 🎯 วัตถุประสงค์

เอกสารนี้เป็นแนวทาง **เพื่อป้องกันปัญหา Theme** เมื่อสร้างฟีเจอร์ใหม่หรือแอป web ใหม่

---

## 📋 Checklist: ก่อนสร้าง Theme

### ✅ **ขั้นตอน 1: ตรวจสอบโครงสร้าง Library**

```bash
# ตรวจสอบว่า library มี themes folder
ls -la libs/aegisx-ui/src/lib/styles/vendor/fuse/

# ที่คุณควรเห็น:
# user-themes.scss      ← Theme colors
# themes.scss          ← Generation logic
# main.scss            ← Coordinator
```

**ถ้าหายไป** → Create from scratch:

```bash
mkdir -p libs/aegisx-ui/src/lib/styles/vendor/fuse
# Copy user-themes.scss and themes.scss from reference
```

### ✅ **ขั้นตอน 2: ตรวจสอบ Index Entry**

```bash
# ตรวจสอบว่า library index.scss นำเข้า main.scss
cat libs/aegisx-ui/src/lib/styles/index.scss | grep main
```

**ควรเห็น**:

```scss
@import 'vendor/fuse/main.scss';
```

**ถ้าหายไป** → Add:

```scss
/* libs/aegisx-ui/src/lib/styles/index.scss */
@import 'vendor/fuse/main.scss';
```

### ✅ **ขั้นตอน 3: ตรวจสอบ Web App Styles**

```bash
# ตรวจสอบ angular.json สำหรับ web app
cat angular.json | grep -A 5 '"web"'
```

**ควรเห็น**:

```json
{
  "build": {
    "options": {
      "styles": ["apps/web/src/styles.scss"]
    }
  }
}
```

**สำคัญ**: ❌ NOT importing library SCSS

### ✅ **ขั้นตอน 4: ตรวจสอบ M3ThemeService**

```bash
# ตรวจสอบว่า service มี injectThemeCss method
grep -n "injectThemeCss" libs/aegisx-ui/src/lib/services/theme/m3-theme.service.ts
```

**ควรเห็น**:

```typescript
private injectThemeCss(theme: M3Theme): void { ... }
private generateThemeCss(theme: M3Theme): string { ... }
```

---

## 🏗️ ขั้นตอนการตั้งค่า (New Project)

### **สำหรับ Web App ใหม่** (e.g., admin app)

#### **Step 1: Create App-Specific Styles**

```bash
mkdir -p apps/admin/src/styles/components
```

```scss
/* apps/admin/src/styles.scss */
/* Minimal setup - let library handle themes */

@use 'styles/components/material-fixes' as *;
@use 'styles/components/form-utilities' as *;

@tailwind base;
@tailwind components;
@tailwind utilities;

/* App-specific globals only */
:root {
  /* your CSS vars */
}
```

#### **Step 2: Update angular.json**

```json
{
  "admin": {
    "architect": {
      "build": {
        "options": {
          "styles": ["apps/admin/src/styles.scss"]
        }
      }
    }
  }
}
```

#### **Step 3: Inject M3ThemeService in Bootstrap**

```typescript
/* apps/admin/src/main.ts */
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { M3ThemeService } from '@aegisx/ui';

bootstrapApplication(AppComponent, {
  providers: [
    M3ThemeService, // Automatically applies theme
  ],
});
```

#### **Step 4: Use Theme Switcher**

```typescript
/* In any component */
import { AxThemeSwitcherComponent } from '@aegisx/ui';

@Component({
  imports: [AxThemeSwitcherComponent],
})
export class LayoutComponent {}
```

---

## 🎨 ขั้นตอน: เพิ่ม Theme ใหม่

### **ทำตามลำดับนี้**:

#### **1. เพิ่มสีใน user-themes.scss**

```scss
/* libs/aegisx-ui/src/lib/styles/vendor/fuse/user-themes.scss */

$user-themes: (
  brand: {...},

  // ↓ ADD YOUR NEW THEME HERE
  ocean: (
      selector: '.theme-ocean',
      primary: (
        50: #e0f7fa,
        100: #b3e5fc,
        200: #81d4fa,
        300: #4fc3f7,
        400: #29b6f6,
        500: #03a9f4,
        // ← Main color
        600: #039be5,
        DEFAULT: #03a9f4,
        contrast: (
          50: #000000,
          100: #000000,
          200: #000000,
          300: #000000,
          400: #000000,
          500: #ffffff,
          600: #ffffff,
          DEFAULT: #ffffff,
        ),
      ),
      accent: (
        ...,
      ),
      warn: (
        ...,
      ),
    ),
);
```

#### **2. เพิ่มใน M3ThemeService**

```typescript
/* libs/aegisx-ui/src/lib/services/theme/m3-theme.service.ts */

private readonly themes: Record<string, M3Theme> = {
  brand: { ... },

  // ↓ ADD HERE
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    seedColor: '#03a9f4',
    description: 'Calm ocean blue theme'
  }
};
```

#### **3. Build Library**

```bash
pnpm nx build aegisx-ui
```

#### **4. Test in Web App**

```bash
pnpm nx serve web
```

**Browser Check**:

1. Open DevTools (F12)
2. Click theme switcher
3. Select "Ocean Blue"
4. HTML should have: `class="light theme-ocean"`
5. `<style id="dynamic-theme-styles">` should contain ocean theme CSS
6. Button colors should be blue (#03a9f4)

---

## 🔍 Debugging Checklist

### **Theme ไม่เปลี่ยนสี?**

```javascript
// In Browser Console (F12)

// 1. Check if theme service loaded
console.log(localStorage.getItem('m3-theme-id')); // Should be 'brand', 'ocean', etc.
console.log(localStorage.getItem('m3-theme-scheme')); // Should be 'light' or 'dark'

// 2. Check HTML classes
console.log(document.documentElement.className); // Should include theme-ocean, light, etc.

// 3. Check injected CSS
const styleEl = document.getElementById('dynamic-theme-styles');
console.log(styleEl); // Should exist
console.log(styleEl?.textContent); // Should have CSS rules

// 4. Check if service exists
console.log(window.ng.probe(document.documentElement).injector.get(M3ThemeService));
```

### **Common Issues:**

| ปัญหา                     | สาเหตุ                   | วิธีแก้                                      |
| ------------------------- | ------------------------ | -------------------------------------------- |
| Colors not changing       | No injected `<style>`    | Check M3ThemeService has `injectThemeCss()`  |
| Theme class not applied   | Service not initialized  | Check M3ThemeService in main.ts              |
| Colors change then revert | Theme CSS removed        | Check style element not being deleted        |
| Dark mode not working     | Wrong class name         | Check `.dark` and `.light` applied correctly |
| localStorage empty        | Browser privacy settings | Check private browsing disabled              |

---

## ⚠️ สิ่งที่ต้องเลี่ยง

### ❌ **DON'T: Import Library SCSS Directly**

```scss
/* ❌ apps/web/src/styles.scss */
@import '@aegisx/ui/styles/vendor/fuse/themes.scss'; // ← ERROR!
@import '../../libs/aegisx-ui/src/lib/styles/themes.scss'; // ← ERROR!
```

**ทำไม**: SCSS loader ไม่รู้จัก path aliases

### ❌ **DON'T: Put Theme in Web App**

```scss
/* ❌ apps/web/src/styles/my-theme.scss */
$my-theme: (
  primary: #2196f3,
); // ← WRONG PLACE!
```

**ทำไม**: Themes ควร be in library (centralized, reusable)

### ❌ **DON'T: Hardcode Colors in HTML**

```html
<!-- ❌ apps/web/src/app/app.component.html -->
<button style="background-color: #2196f3">Click</button>
<!-- ← Static! -->
```

**ทำไม**: ไม่สามารถเปลี่ยน theme ได้

### ✅ **DO: Use Material Color Attribute**

```html
<!-- ✅ apps/web/src/app/app.component.html -->
<button mat-raised-button color="primary">Click</button>
<!-- ↑ M3ThemeService injected CSS จะให้สี -->
```

---

## 🚀 Optimization Tips

### **1. Lazy Load Theme CSS**

```typescript
/* Only inject CSS when theme actually changes */
setTheme(themeId: string): void {
  // Only inject if different from current
  if (this.currentTheme() !== themeId) {
    this._currentTheme.set(themeId);
    this.injectThemeCss(this.themes[themeId]);
  }
}
```

### **2. Cache Generated CSS**

```typescript
private themeCssCache = new Map<string, string>();

private generateThemeCss(theme: M3Theme): string {
  if (this.themeCssCache.has(theme.id)) {
    return this.themeCssCache.get(theme.id)!;
  }

  const css = `/* theme CSS */`;
  this.themeCssCache.set(theme.id, css);
  return css;
}
```

### **3. Preload Common Themes**

```typescript
/* In M3ThemeService constructor */
constructor() {
  // Pre-generate CSS for common themes
  ['brand', 'dark'].forEach(themeId => {
    this.generateThemeCss(this.themes[themeId]);
  });
}
```

---

## 📚 Reference Files

| ไฟล์                 | ตำแหน่ง                                      | สำคัญ        |
| -------------------- | -------------------------------------------- | ------------ |
| **user-themes.scss** | `libs/aegisx-ui/src/lib/styles/vendor/fuse/` | 🔴 Critical  |
| **themes.scss**      | `libs/aegisx-ui/src/lib/styles/vendor/fuse/` | 🟠 Reference |
| **M3ThemeService**   | `libs/aegisx-ui/src/lib/services/theme/`     | 🔴 Critical  |
| **index.scss**       | `libs/aegisx-ui/src/lib/styles/`             | 🟠 Important |
| **styles.scss**      | `apps/web/src/`                              | 🟠 Important |
| **angular.json**     | Root                                         | 🟠 Important |

---

## 💡 Key Takeaways

1. **Library = Theme Owner**
   - Owns user-themes.scss
   - Owns M3ThemeService
   - Provides AxThemeSwitcherComponent

2. **App = Theme Consumer**
   - Imports from library
   - Uses M3ThemeService
   - Shows AxThemeSwitcherComponent

3. **Runtime Injection = Flexibility**
   - No build-time complications
   - Easy theme switching
   - No page reload needed

4. **SCSS = Ref Only**
   - themes.scss for reference
   - Don't import in web app
   - Use runtime CSS injection

5. **Test = DevTools Check**
   - HTML classes
   - Injected `<style>` tag
   - localStorage values
   - Button colors

---

## 🤔 FAQ

**Q: ทำไมไม่ import library SCSS ตรงๆ?**
A: SCSS loader ไม่รู้จัก TypeScript path aliases (@aegisx/ui). Runtime CSS injection เป็นวิธีที่เชื่อถือได้มากกว่า

**Q: ถ้าผมมี 3 apps (web, admin, mobile) ต้อง duplicate theme ไหม?**
A: ไม่! ทั้งหมดใช้ library เดียว ลบ duplicate

**Q: เปลี่ยน theme ต้อง refresh page ไหม?**
A: ไม่! M3ThemeService เปลี่ยน CSS แบบ dynamic ไม่ต้อง reload

**Q: Dark mode ต้องสร้าง theme ใหม่ไหม?**
A: ไม่! `.dark` class ใช้ dark palette เดียวกัน ไม่ต้องสร้าง theme ใหม่

**Q: ต้องสร้าง Material theme file ไหม? (e.g., mat.define-light-theme)**
A: ไม่! user-themes.scss มี color definition พอแล้ว runtime injection ก็เพียงพอ
