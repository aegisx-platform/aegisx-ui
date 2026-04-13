import { ErrorMessageConfig, ErrorSeverity } from './error-message.model';
import { ERROR_MESSAGES } from './error-messages.config';

export interface ErrorConfigOverrides {
  readonly severity?: ErrorSeverity;
  readonly icon?: string;
  readonly featuredIcon?: string;
  readonly title?: string;
  readonly description?: string;
}

/**
 * Resolve an error code to a full ErrorMessageConfig.
 * Overrides take precedence over config defaults.
 * Falls back to DEFAULT if code is not found.
 */
export function resolveErrorConfig(
  code: number | string | undefined,
  overrides?: ErrorConfigOverrides,
): ErrorMessageConfig {
  const base =
    (code != null && ERROR_MESSAGES[code]) || ERROR_MESSAGES['DEFAULT'];

  if (!overrides) return base;

  return {
    ...base,
    ...(overrides.severity != null && { severity: overrides.severity }),
    ...(overrides.icon != null && { icon: overrides.icon }),
    ...(overrides.featuredIcon != null && {
      featuredIcon: overrides.featuredIcon,
    }),
    ...(overrides.title != null && { title: overrides.title }),
    ...(overrides.description != null && {
      description: overrides.description,
    }),
  };
}
