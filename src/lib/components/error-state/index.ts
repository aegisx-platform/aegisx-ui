// Error State Components (upgraded v2 — severity-based, Thai messages, featured icons)
export { AxErrorStateComponent } from './error-state.component';
/** @deprecated Use retry/navigate outputs instead of callback-based actions */
export type { ErrorStateAction } from './error-state.component';
export { AxErrorBannerComponent } from './error-banner.component';

// Models & Config
export type {
  ErrorMessageConfig,
  ErrorAction,
  ErrorSeverity,
} from './error-message.model';
export { ERROR_MESSAGES } from './error-messages.config';
export { resolveErrorConfig } from './resolve-error-config';
export type { ErrorConfigOverrides } from './resolve-error-config';
