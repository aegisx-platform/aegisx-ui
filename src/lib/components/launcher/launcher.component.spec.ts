import { TestBed } from '@angular/core/testing';
import { AxLauncherComponent } from './launcher.component';
import { LauncherApp, LauncherUserContext } from './launcher.types';

describe('AxLauncherComponent - Permission Matcher', () => {
  let component: AxLauncherComponent;

  const createApp = (
    permission?: LauncherApp['permission'],
    overrides?: Partial<LauncherApp>,
  ): LauncherApp => ({
    id: 'app-1',
    name: 'App 1',
    icon: 'apps',
    color: 'blue',
    status: 'active',
    enabled: true,
    permission,
    ...overrides,
  });

  const createUser = (
    permissions: string[],
    overrides?: Partial<LauncherUserContext>,
  ): LauncherUserContext => ({
    roles: ['user'],
    permissions,
    isAdmin: false,
    ...overrides,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AxLauncherComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AxLauncherComponent);
    component = fixture.componentInstance;
  });

  it('should match exact permission across dot and colon notation', () => {
    const app = createApp({ viewPermissions: ['users.read'] });
    const user = createUser(['users:read']);

    expect(component.canViewApp(app, user)).toBe(true);
  });

  it('should match resource wildcard permission', () => {
    const app = createApp({ viewPermissions: ['rbac:stats:read'] });
    const user = createUser(['rbac:*']);

    expect(component.canViewApp(app, user)).toBe(true);
  });

  it('should match action wildcard for multi-segment action', () => {
    const app = createApp({ viewPermissions: ['rbac.stats.read'] });
    const user = createUser(['*:stats:read']);

    expect(component.canViewApp(app, user)).toBe(true);
  });

  it('should not match incomplete wildcard action against multi-segment action', () => {
    const app = createApp({ viewPermissions: ['rbac:stats:read'] });
    const user = createUser(['*:read']);

    expect(component.canViewApp(app, user)).toBe(false);
  });

  it('should allow admin when permission is missing', () => {
    const app = createApp({ viewPermissions: ['users:delete'] });
    const user = createUser([], { roles: ['admin'], isAdmin: true });

    expect(component.canViewApp(app, user)).toBe(true);
  });
});
