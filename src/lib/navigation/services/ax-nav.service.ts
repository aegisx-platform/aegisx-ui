import {
  Injectable,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  Signal,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Subject } from 'rxjs';
import {
  NavMode,
  AppGroup,
  NavModule,
  NavChild,
  Hospital,
  NavNotification,
  NavUser,
  NavAccent,
  NAV_ACCENTS,
} from '../models/ax-nav.model';
import {
  NavAppSwitchEvent,
  NavModeChangeEvent,
  NavHospitalSwitchEvent,
  NavModuleClickEvent,
  NavActionEvent,
} from '../models/ax-nav.events';

const STORAGE_PREFIX = 'ax-nav-state';

@Injectable({ providedIn: 'root' })
export class AxNavService {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  // ── Configuration (set by consumer) ───────────────────
  private _appGroups = signal<AppGroup[]>([]);
  private _hospitals = signal<Hospital[]>([]);

  // ── Core State ────────────────────────────────────────
  private _mode = signal<NavMode>(
    this.loadFromStorage('mode', 'rail') as NavMode,
  );
  private _activeAppId = signal<string>('');
  private _activeModuleId = signal<string>('');
  private _hospitalId = signal<string>(this.loadFromStorage('hospital', ''));
  private _pinned = signal<boolean>(
    this.loadFromStorage('pinned', 'false') === 'true',
  );
  private _notifications = signal<NavNotification[]>([]);
  private _user = signal<NavUser | null>(null);
  private _iconStyle = signal<'mono' | 'diamond'>('mono');
  private _accentId = signal<string>(this.loadFromStorage('accent', 'slate'));
  private _expandedModuleId = signal<string | null>(null);

  // ── Public Readonly ───────────────────────────────────
  readonly mode = this._mode.asReadonly();
  readonly activeAppId = this._activeAppId.asReadonly();
  readonly activeModuleId = this._activeModuleId.asReadonly();
  readonly hospitalId = this._hospitalId.asReadonly();
  readonly pinned = this._pinned.asReadonly();
  readonly notifications = this._notifications.asReadonly();
  readonly user = this._user.asReadonly();
  readonly appGroups = this._appGroups.asReadonly();
  readonly hospitals = this._hospitals.asReadonly();
  readonly iconStyle = this._iconStyle.asReadonly();
  readonly accentId = this._accentId.asReadonly();
  readonly expandedModuleId = this._expandedModuleId.asReadonly();
  readonly accent: Signal<NavAccent> = computed(
    () => NAV_ACCENTS.find((a) => a.id === this._accentId()) ?? NAV_ACCENTS[0],
  );

  // ── Computed ──────────────────────────────────────────
  readonly activeApp: Signal<AppGroup | undefined> = computed(() =>
    this._appGroups().find((a) => a.id === this._activeAppId()),
  );

  readonly visibleModules: Signal<NavModule[]> = computed(() => {
    const app = this.activeApp();
    return app?.modules ?? [];
  });

  readonly visibleApps: Signal<AppGroup[]> = computed(() => this._appGroups());

  readonly activeHospital: Signal<Hospital | undefined> = computed(() =>
    this._hospitals().find((h) => h.id === this._hospitalId()),
  );

  readonly unreadCount: Signal<number> = computed(
    () => this._notifications().filter((n) => n.unread).length,
  );

  readonly expandedModule: Signal<NavModule | null> = computed(() => {
    const id = this._expandedModuleId();
    if (!id) return null;
    return this.activeApp()?.modules.find((m) => m.id === id) ?? null;
  });

  // ── Events ────────────────────────────────────────────
  readonly appSwitch$ = new Subject<NavAppSwitchEvent>();
  readonly modeChange$ = new Subject<NavModeChangeEvent>();
  readonly hospitalSwitch$ = new Subject<NavHospitalSwitchEvent>();
  readonly moduleClick$ = new Subject<NavModuleClickEvent>();
  readonly actionClick$ = new Subject<NavActionEvent>();

  // ── Configuration ─────────────────────────────────────
  configure(config: {
    appGroups: AppGroup[];
    hospitals?: Hospital[];
    defaultAppId?: string;
    user?: NavUser;
    iconStyle?: 'mono' | 'diamond';
  }): void {
    this._appGroups.set(config.appGroups);
    if (config.hospitals) this._hospitals.set(config.hospitals);
    if (config.defaultAppId) this._activeAppId.set(config.defaultAppId);
    if (config.user) this._user.set(config.user);
    if (config.iconStyle) this._iconStyle.set(config.iconStyle);
  }

  // ── Actions ───────────────────────────────────────────
  setMode(mode: NavMode): void {
    const prev = this._mode();
    if (prev === mode) return;
    this._mode.set(mode);
    this.saveToStorage('mode', mode);
    if (mode !== 'dock') {
      this._expandedModuleId.set(null);
    }
    this.modeChange$.next({ previousMode: prev, newMode: mode });
  }

  setActiveApp(appId: string): void {
    const prev = this._activeAppId();
    if (prev === appId) return;
    this._activeAppId.set(appId);
    const app = this._appGroups().find((a) => a.id === appId);
    if (app?.modules.length) {
      const first = app.modules.find((m) => (m.type ?? 'route') === 'route');
      if (first) this.setActiveModule(first.id);
    }
    this.appSwitch$.next({ previousAppId: prev, newAppId: appId });
  }

  setActiveModule(moduleId: string): void {
    const app = this.activeApp();
    const mod = app?.modules.find((m) => m.id === moduleId);
    if (!app || !mod) return;

    const type = mod.type ?? 'route';

    if (type === 'divider') return;

    const hasChildren = (mod.children?.length ?? 0) > 0;
    const isDockMode = this._mode() === 'dock';

    // Dock + route module with children → expand panel, don't navigate
    if (isDockMode && hasChildren && type === 'route') {
      const wasExpanded = this._expandedModuleId() === moduleId;
      if (!wasExpanded) {
        // Opening: mark parent active so dock icon reflects current context
        this._activeModuleId.set(moduleId);
      }
      this.toggleModuleExpand(moduleId);
      return;
    }

    switch (type) {
      case 'route': {
        this._activeModuleId.set(moduleId);
        const fullRoute = `/${app.route}/${mod.route}`;
        this.router.navigate([fullRoute]);
        this.moduleClick$.next({
          appId: app.id,
          moduleId: mod.id,
          route: fullRoute,
          type: 'route',
        });
        break;
      }
      case 'action': {
        const actionKey = mod.action ?? moduleId;
        this.moduleClick$.next({
          appId: app.id,
          moduleId: mod.id,
          route: '',
          type: 'action',
          action: actionKey,
        });
        this.actionClick$.next({
          appId: app.id,
          moduleId: mod.id,
          action: actionKey,
        });
        break;
      }
      case 'external': {
        // Template <a> handles navigation; service only emits the event
        this.moduleClick$.next({
          appId: app.id,
          moduleId: mod.id,
          route: '',
          type: 'external',
          externalUrl: mod.externalUrl,
        });
        break;
      }
    }

    // Dock mode: any non-expanding module click closes an open panel
    // (we already returned early for the expand case above)
    if (isDockMode) {
      this.collapseModule();
    }

    // Auto-collapse expanded panel only for route navigation (non-dock modes)
    if (type === 'route' && this._mode() === 'expanded' && !this._pinned()) {
      this.setMode('rail');
    }
  }

  toggleModuleExpand(moduleId: string): void {
    const current = this._expandedModuleId();
    this._expandedModuleId.set(current === moduleId ? null : moduleId);
  }

  collapseModule(): void {
    this._expandedModuleId.set(null);
  }

  setActiveChild(child: NavChild): void {
    const app = this.activeApp();
    const parentId = this._expandedModuleId();
    if (!app || !parentId) return;
    // Keep parent marked as active — we're on its sub-route
    this._activeModuleId.set(parentId);
    this.router.navigate([child.route]);
    this.moduleClick$.next({
      appId: app.id,
      moduleId: parentId,
      route: child.route,
      type: 'route',
    });
  }

  setHospital(hospitalId: string): void {
    const prev = this._hospitalId();
    if (prev === hospitalId) return;
    this._hospitalId.set(hospitalId);
    this.saveToStorage('hospital', hospitalId);
    this.hospitalSwitch$.next({
      previousHospitalId: prev,
      newHospitalId: hospitalId,
    });
  }

  togglePin(): void {
    const next = !this._pinned();
    this._pinned.set(next);
    this.saveToStorage('pinned', String(next));
  }

  setUser(user: NavUser): void {
    this._user.set(user);
  }

  setIconStyle(style: 'mono' | 'diamond'): void {
    this._iconStyle.set(style);
  }

  setAccent(accentId: string): void {
    this._accentId.set(accentId);
    this.saveToStorage('accent', accentId);
  }

  setNotifications(notifications: NavNotification[]): void {
    this._notifications.set(notifications);
  }

  markNotificationRead(id: string): void {
    this._notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  }

  markAllNotificationsRead(): void {
    this._notifications.update((list) =>
      list.map((n) => ({ ...n, unread: false })),
    );
  }

  // ── Router Sync ───────────────────────────────────────
  private _routerSynced = false;

  syncWithRouter(): void {
    if (this._routerSynced) return;
    this._routerSynced = true;

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => (e as NavigationEnd).urlAfterRedirects),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((url) => {
        const segments = url.split('/').filter(Boolean);
        const app = this._appGroups().find((a) => a.route === segments[0]);
        if (app) {
          this._activeAppId.set(app.id);
          const modSegments = segments.slice(1);
          const mod = app.modules.find((m) => {
            if (!m.route) return false;
            const routeParts = m.route.split('/').filter(Boolean);
            return routeParts.every((part) => modSegments.includes(part));
          });
          if (mod) this._activeModuleId.set(mod.id);
        }
      });
  }

  // ── Persistence ───────────────────────────────────────
  private loadFromStorage(key: string, fallback: string): string {
    if (!isPlatformBrowser(this.platformId)) return fallback;
    return localStorage.getItem(`${STORAGE_PREFIX}-${key}`) ?? fallback;
  }

  private saveToStorage(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(`${STORAGE_PREFIX}-${key}`, value);
    }
  }
}
