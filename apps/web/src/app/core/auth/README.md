# 🛡️ Authentication System

> **📚 Complete Documentation:** [docs/architecture/frontend/auth-system.md](../../../../../docs/architecture/frontend/auth-system.md)

## Quick Reference

### **Core Files**

- `auth.service.ts` - Main authentication service
- `auth.interceptor.ts` - HTTP token management
- `auth.guard.ts` - Route protection
- `auth-state.interface.ts` - Type definitions

### **Key Features**

- ✅ **Signals-based** reactive state management
- ✅ **Proactive token refresh** (auto-refresh 2 min before expiry)
- ✅ **Smart guards** wait for auth state resolution
- ✅ **401 handling** with automatic retry
- ✅ **Loading states** for better UX

### **Usage**

```typescript
// In components
authService = inject(AuthService);

// Check auth state
authService.isAuthenticated(); // boolean signal
authService.isLoading(); // boolean signal
authService.currentUser(); // User | null signal

// Methods
authService.login(credentials).subscribe();
authService.logout().subscribe();
```

### **Configuration**

- **Token expiry:** 15 minutes (backend)
- **Proactive refresh:** 2 minutes before expiry
- **Storage:** localStorage
- **Idle handling:** Token expires naturally

---

**📖 For complete documentation, examples, and troubleshooting:**
**[docs/architecture/frontend/auth-system.md](../../../../../docs/architecture/frontend/auth-system.md)**
