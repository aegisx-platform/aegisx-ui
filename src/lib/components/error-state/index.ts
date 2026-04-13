// Error State Component (upgraded v2 — severity-based, Thai messages, featured icons)
export { AxErrorStateComponent } from './error-state.component';

// Models & Config
export type {
  ErrorMessageConfig,
  ErrorAction,
  ErrorSeverity,
} from './error-message.model';
export { ERROR_MESSAGES } from './error-messages.config';
export { resolveErrorConfig } from './resolve-error-config';
export type { ErrorConfigOverrides } from './resolve-error-config';
