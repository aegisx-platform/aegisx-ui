/**
 * Authentication State Management Interface
 *
 * Defines the comprehensive authentication state structure for the application.
 * This replaces scattered boolean flags with a centralized state management approach.
 */

export enum AuthStatus {
  LOADING = 'LOADING', // Initial state or async auth operations in progress
  AUTHENTICATING = 'AUTHENTICATING', // Login/register process in progress
  AUTHENTICATED = 'AUTHENTICATED', // User is authenticated with valid token
  UNAUTHENTICATED = 'UNAUTHENTICATED', // User is not authenticated
  TOKEN_EXPIRED = 'TOKEN_EXPIRED', // Token has expired, needs refresh
  REFRESHING_TOKEN = 'REFRESHING_TOKEN', // Token refresh in progress
  ERROR = 'ERROR', // Authentication error occurred
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  name?: string;
  role?: string;
  permissions?: string[];
  avatar?: string;
  bio?: string;
  status?: 'active' | 'inactive' | 'suspended';
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string | number;
  tokenType?: string;
  issuedAt?: Date;
  expiresAt?: Date;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
  timestamp?: Date;
  recoverable?: boolean;
}

export interface AuthState {
  // Core Authentication Status
  status: AuthStatus;

  // User Information
  user: User | null;

  // Token Management
  tokens: AuthTokens | null;

  // Loading States
  isLoading: boolean;
  isAuthenticating: boolean;
  isRefreshingToken: boolean;
  isLoadingProfile: boolean;

  // Error Management
  error: AuthError | null;
  lastError: AuthError | null;

  // Session Information
  sessionId: string | null;
  lastActivity: Date | null;
  sessionExpiry: Date | null;

  // Feature Flags
  rememberMe: boolean;
  autoRefreshEnabled: boolean;

  // Metadata
  initialized: boolean;
  lastStateChange: Date;
}

/**
 * Initial authentication state
 */
export const initialAuthState: AuthState = {
  status: AuthStatus.LOADING,
  user: null,
  tokens: null,
  isLoading: true,
  isAuthenticating: false,
  isRefreshingToken: false,
  isLoadingProfile: false,
  error: null,
  lastError: null,
  sessionId: null,
  lastActivity: null,
  sessionExpiry: null,
  rememberMe: false,
  autoRefreshEnabled: true,
  initialized: false,
  lastStateChange: new Date(),
};

/**
 * Type guards for auth state validation
 */
export const AuthStateGuards = {
  isAuthenticated: (state: AuthState): boolean =>
    state.status === AuthStatus.AUTHENTICATED &&
    state.user !== null &&
    state.tokens !== null,

  isUnauthenticated: (state: AuthState): boolean =>
    state.status === AuthStatus.UNAUTHENTICATED &&
    state.user === null &&
    state.tokens === null,

  isLoading: (state: AuthState): boolean =>
    state.status === AuthStatus.LOADING || state.isLoading,

  hasValidToken: (state: AuthState): boolean =>
    state.tokens !== null &&
    state.tokens.accessToken !== null &&
    (state.tokens.expiresAt ? new Date() < state.tokens.expiresAt : true),

  needsTokenRefresh: (state: AuthState): boolean =>
    state.status === AuthStatus.TOKEN_EXPIRED ||
    (state.tokens?.expiresAt ? new Date() > state.tokens.expiresAt : false),

  canRefreshToken: (state: AuthState): boolean =>
    state.tokens !== null && state.tokens.refreshToken !== null,

  isInErrorState: (state: AuthState): boolean =>
    state.status === AuthStatus.ERROR || state.error !== null,

  isInitialized: (state: AuthState): boolean =>
    state.initialized && state.status !== AuthStatus.LOADING,
};

/**
 * Auth state transition events
 */
export enum AuthStateEvent {
  INITIALIZE = 'INITIALIZE',
  LOGIN_START = 'LOGIN_START',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  TOKEN_REFRESH_START = 'TOKEN_REFRESH_START',
  TOKEN_REFRESH_SUCCESS = 'TOKEN_REFRESH_SUCCESS',
  TOKEN_REFRESH_FAILED = 'TOKEN_REFRESH_FAILED',
  PROFILE_LOAD_START = 'PROFILE_LOAD_START',
  PROFILE_LOAD_SUCCESS = 'PROFILE_LOAD_SUCCESS',
  PROFILE_LOAD_FAILED = 'PROFILE_LOAD_FAILED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  ERROR_CLEARED = 'ERROR_CLEARED',
  RESET = 'RESET',
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

/**
 * Registration data interface
 */
export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms?: boolean;
}

/**
 * Auth service configuration
 */
export interface AuthConfig {
  apiUrl: string;
  tokenStorageKey: string;
  refreshTokenStorageKey: string;
  sessionStorageKey: string;
  tokenRefreshThreshold: number; // Minutes before expiry to refresh
  maxRetryAttempts: number;
  retryDelay: number; // Milliseconds
  sessionTimeout: number; // Minutes
  enableAutoRefresh: boolean;
  enableLogging: boolean;
}

export const defaultAuthConfig: AuthConfig = {
  apiUrl: '',
  tokenStorageKey: 'accessToken',
  refreshTokenStorageKey: 'refreshToken',
  sessionStorageKey: 'sessionId',
  tokenRefreshThreshold: 5,
  maxRetryAttempts: 3,
  retryDelay: 1000,
  sessionTimeout: 30,
  enableAutoRefresh: true,
  enableLogging: true,
};
