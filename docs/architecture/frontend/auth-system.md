# 🛡️ Authentication System Documentation

## 📋 Overview

ระบบ Authentication ที่ปรับปรุงใหม่ให้เป็นระบบ เรียบง่าย และใช้งานง่าย โดยใช้ Angular Signals และ RxJS สำหรับการจัดการ state และ HTTP requests

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Components    │    │    Guards        │    │  Interceptor    │
│                 │    │                  │    │                 │
│ - Login Form    │    │ - AuthGuard      │    │ - Token Attach  │
│ - Dashboard     │    │ - GuestGuard     │    │ - Auto Refresh  │
│ - Profile       │    │                  │    │ - Error Handle  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────────┐
                    │    AuthService      │
                    │                     │
                    │ - User State        │
                    │ - Token Management  │
                    │ - Loading States    │
                    │ - API Integration   │
                    └─────────────────────┘
```

## 🔧 Core Components

### 1. AuthService (`auth.service.ts`)

**หน้าที่หลัก:** จัดการ authentication state, token management, และการเชื่อมต่อ API

#### **Signals & State Management**

```typescript
// Reactive state ใช้ Angular Signals
readonly currentUser = signal<User | null>(null);
readonly isAuthenticated = signal<boolean>(false);
readonly isLoading = signal<boolean>(false);
readonly accessToken = signal<string | null>(null);

// Computed values
readonly userDisplayName = computed(() => {
  const user = this.currentUser();
  return user ? `${user.firstName} ${user.lastName}` : 'Guest';
});

// Usage in components
@Component({
  template: `
    <div *ngIf="authService.isLoading()">Loading...</div>
    <div *ngIf="authService.isAuthenticated()">
      Welcome {{ authService.userDisplayName() }}
    </div>
  `
})
export class MyComponent {
  authService = inject(AuthService);
}
```

#### **Key Methods**

```typescript
// Authentication
login(credentials: LoginRequest): Observable<AuthResponse>
register(userData: RegisterRequest): Observable<AuthResponse>
logout(): Observable<any>
refreshToken(): Observable<any>

// State helpers
waitForAuthState(): Promise<boolean>  // รอให้ auth state พร้อม
getAccessToken(): string | null       // สำหรับ interceptors
isTokenExpired(): boolean            // ตรวจสอบ token หมดอายุ
```

#### **Proactive Token Refresh**

```typescript
getAccessToken(): string | null {
  const token = this._accessToken();

  // Auto refresh เมื่อ token เหลือ 2 นาที
  if (token && this.tokenExpiresWithin(token, 2)) {
    this.refreshToken().subscribe({
      next: () => console.log('Proactive refresh successful'),
      error: (error) => console.warn('Proactive refresh failed', error)
    });
  }

  return token;
}
```

### 2. Auth Interceptor (`auth.interceptor.ts`)

**หน้าที่หลัก:** จัดการ HTTP requests, เพิ่ม Authorization header, และ handle 401 errors

#### **Features**

- ✅ **Auto Token Attachment** - เพิ่ม `Bearer token` ทุก request
- ✅ **Proactive Refresh** - Check token expiry ก่อนส่ง request
- ✅ **401 Error Handling** - Auto refresh + retry เมื่อได้ 401
- ✅ **Skip Auth Routes** - ไม่ intercept `/auth/*` endpoints

#### **Implementation**

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip auth endpoints
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  // Get token (with proactive refresh)
  const token = authService.getAccessToken();

  // Add Authorization header
  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Try token refresh and retry
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = authService.getAccessToken();
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
          catchError(() => {
            router.navigate(['/login']);
            return EMPTY;
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
```

### 3. Guards (`auth.guard.ts`)

**หน้าที่หลัก:** ป้องกัน routes และจัดการ navigation

#### **AuthGuard - ป้องกัน Protected Routes**

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  async canActivate(route, state): Promise<boolean> {
    // รอให้ auth state พร้อม
    const isAuthenticated = await this.authService.waitForAuthState();

    if (isAuthenticated && !this.authService.isTokenExpired()) {
      return true;
    }

    // Redirect to login
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
```

#### **GuestGuard - ป้องกัน Auth Pages เมื่อ Login แล้ว**

```typescript
@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  async canActivate(): Promise<boolean> {
    // รอให้ auth state พร้อม
    const isAuthenticated = await this.authService.waitForAuthState();

    if (isAuthenticated && !this.authService.isTokenExpired()) {
      // Redirect to dashboard
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true; // Allow access to login/register
  }
}
```

## ⚙️ Configuration & Setup

### 1. App Configuration (`app.config.ts`)

```typescript
import { authInterceptor } from './core/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // HTTP client with interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // Register auth interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: authInterceptor,
      multi: true,
    },

    // Other providers...
  ],
};
```

### 2. Route Configuration

```typescript
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
];
```

### 3. Environment Configuration

```typescript
// environment.ts
export const environment = {
  apiUrl: 'http://localhost:3333',
  // Token configuration is handled by backend
  // Default: JWT expires in 15 minutes
};
```

## 🔄 Token Management Flow

### **Normal Flow (With Activity)**

```
0 min ──────── 13 min ──────── 15 min
  │               │              │
Login       Auto Refresh     Still Active
           (เหลือ 2 นาที)
```

### **Idle Flow (No Activity)**

```
0 min ──────────────────────── 15 min
  │                              │
Login                         Expired
                          (ต้อง login ใหม่)
```

### **Error Fallback Flow**

```
API Request → 401 Error → Token Refresh → Retry Request
     │                        │                │
     └─ Proactive failed   Success      ─ Continue
                              │
                           Failed → Redirect Login
```

## 📱 Usage Examples

### **Component with Auth State**

```typescript
@Component({
  selector: 'app-header',
  template: `
    <div *ngIf="authService.isLoading()">
      <mat-spinner diameter="20"></mat-spinner>
    </div>

    <div *ngIf="!authService.isLoading()">
      <div *ngIf="authService.isAuthenticated(); else loginButton">
        <span>{{ authService.userDisplayName() }}</span>
        <button (click)="logout()">Logout</button>
      </div>

      <ng-template #loginButton>
        <a routerLink="/login">Login</a>
      </ng-template>
    </div>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout().subscribe();
  }
}
```

### **Login Component**

```typescript
@Component({
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <input matInput type="email" formControlName="email" placeholder="Email" />
      </mat-form-field>

      <mat-form-field>
        <input matInput type="password" formControlName="password" placeholder="Password" />
      </mat-form-field>

      <button mat-raised-button type="submit" [disabled]="authService.isLoading() || loginForm.invalid">
        <span *ngIf="authService.isLoading()">Logging in...</span>
        <span *ngIf="!authService.isLoading()">Login</span>
      </button>
    </form>
  `,
})
export class LoginComponent {
  authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          // Success - AuthService handles redirect
        },
        error: (error) => {
          console.error('Login failed:', error.message);
        },
      });
    }
  }
}
```

### **Protected Route Component**

```typescript
@Component({
  template: `
    <div *ngIf="authService.canShowContent$ | async">
      <h1>Dashboard</h1>
      <p>Welcome {{ authService.userDisplayName() }}</p>

      <!-- Protected content -->
      <div *ngIf="authService.hasRole()('admin')">Admin content here</div>
    </div>
  `,
})
export class DashboardComponent {
  authService = inject(AuthService);

  // Helper computed for content visibility
  canShowContent$ = computed(() => this.authService.isAuthenticated() && !this.authService.isLoading());
}
```

## 🚨 Error Handling

### **Common Scenarios**

#### **1. Network Errors**

```typescript
// AuthService automatically handles network errors
this.authService.login(credentials).subscribe({
  error: (error) => {
    // Error messages are user-friendly
    if (error.message === 'Network error - please check your connection') {
      // Show network error UI
    }
  },
});
```

#### **2. Invalid Credentials**

```typescript
// 401 from login API
this.authService.login(credentials).subscribe({
  error: (error) => {
    if (error.message === 'Invalid credentials') {
      // Show validation errors
    }
  },
});
```

#### **3. Token Refresh Failures**

```typescript
// Handled automatically by interceptor
// User gets redirected to login page
// No action needed in components
```

## 📊 Monitoring & Debugging

### **Console Logs**

```typescript
// Enable in development
console.log('Proactive token refresh successful');
console.warn('Proactive token refresh failed', error);
console.log('401 error, attempting token refresh...');
console.log('Token refresh successful, retrying request');
console.log('Token refresh failed, redirecting to login');
```

### **Debug Auth State**

```typescript
// In browser console
const authService = angular.getComponent(document.body).authService;

// Check current state
console.log('User:', authService.currentUser());
console.log('Authenticated:', authService.isAuthenticated());
console.log('Loading:', authService.isLoading());
console.log('Token:', authService.getAccessToken());
console.log('Token Expired:', authService.isTokenExpired());
```

## 🔐 Security Features

### **1. Token Storage**

- ✅ **localStorage** สำหรับ persistence
- ✅ **Automatic cleanup** เมื่อ logout หรือ token invalid
- ✅ **Expiry checking** ก่อนทุกการใช้งาน

### **2. Route Protection**

- ✅ **AuthGuard** ป้องกัน unauthorized access
- ✅ **GuestGuard** ป้องกัน authenticated users เข้า login
- ✅ **Loading states** รอ auth state ก่อน render

### **3. API Security**

- ✅ **Auto token attachment** ทุก HTTP request
- ✅ **Token refresh** เมื่อหมดอายุ
- ✅ **Secure logout** clear ทุก state และ redirect

## 🎯 Best Practices

### **1. Component Development**

```typescript
// ✅ Good - Use signals reactively
@Component({
  template: `<div *ngIf="authService.isAuthenticated()">Content</div>`
})

// ❌ Avoid - Manual subscriptions
@Component({
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(...)
  }
})
```

### **2. Error Handling**

```typescript
// ✅ Good - Handle specific errors
this.authService.login(creds).subscribe({
  error: (error) => {
    this.errorMessage = error.message;
  }
});

// ❌ Avoid - Generic error handling
.catchError(() => of('Something went wrong'))
```

### **3. Loading States**

```typescript
// ✅ Good - Show loading UI
@Component({
  template: `
    <div *ngIf="authService.isLoading()">Loading...</div>
    <div *ngIf="!authService.isLoading()">Content</div>
  `
})

// ❌ Avoid - No loading feedback
```

## 🐛 Troubleshooting

### **Common Issues**

#### **1. Guards not working**

```typescript
// Problem: Route not protected
// Solution: Make sure guards are registered
{
  path: 'protected',
  component: ProtectedComponent,
  canActivate: [AuthGuard] // ← Add this
}
```

#### **2. Interceptor not attaching token**

```typescript
// Problem: No Authorization header
// Solution: Check HTTP_INTERCEPTORS registration
{
  provide: HTTP_INTERCEPTORS,
  useClass: authInterceptor, // ← Correct class
  multi: true               // ← Don't forget multi: true
}
```

#### **3. Token refresh loop**

```typescript
// Problem: Infinite refresh calls
// Solution: Check /auth/ URL exclusion
if (req.url.includes('/auth/')) {
  return next(req); // Skip auth endpoints
}
```

#### **4. Loading state stuck**

```typescript
// Problem: isLoading always true
// Solution: Check error handling in AuthService
.pipe(
  finalize(() => this._isLoading.set(false)) // Always clear loading
)
```

## 📈 Performance Considerations

### **1. Token Refresh Timing**

- **Current:** Refresh เมื่อเหลือ 2 นาที
- **Benefit:** ไม่ refresh บ่อยเกินไป
- **Trade-off:** มี 2 นาทีสำหรับ fallback

### **2. Memory Management**

- **Signals:** Automatic cleanup เมื่อ component destroyed
- **Subscriptions:** ใช้ async pipe หรือ takeUntilDestroyed
- **Token storage:** Clear เมื่อ logout

### **3. Network Optimization**

- **Background refresh:** ไม่ block user interactions
- **Single refresh:** ป้องกัน duplicate calls (TODO: implement queue)
- **Minimal API calls:** Refresh เมื่อจำเป็นเท่านั้น

---

## 📋 Summary

ระบบ Authentication นี้ได้รับการปรับปรุงให้:

- ✅ **เป็นระบบ** → Code organized, maintainable
- ✅ **เรียบง่าย** → ไม่ซับซ้อน, เข้าใจง่าย
- ✅ **ใช้งานง่าย** → Developer-friendly APIs
- ✅ **Performance ดี** → Proactive refresh, minimal calls
- ✅ **Security** → Proper token management, route protection
- ✅ **UX ดี** → Loading states, smooth transitions

**Perfect balance ระหว่าง simplicity และ functionality** 🎯
