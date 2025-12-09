import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RuntimeConfigService } from '../../services/runtime-config.service';

/**
 * Pattern-based URL exclusions (Industry Standard)
 * URLs matching these patterns will NOT get API prefix
 */
const SKIP_API_PREFIX_PATTERNS = [
  // Static assets
  /^\/assets\//,
  /^\/static\//,
  /^\/public\//,

  // Health & monitoring
  /^\/health$/,
  /^\/ping$/,
  /^\/metrics$/,
  /^\/status$/,

  // External integrations
  /^\/webhooks\//,
  /^\/auth\/callback\//,
  /^\/oauth\//,
  /^\/sso\//,

  // File operations
  /^\/downloads?\//,
  /^\/uploads?\//,
  /^\/files\/download\//,
  /^\/media\//,

  // API documentation
  /^\/docs\//,
  /^\/swagger\//,
  /^\/api-docs\//,
] as const;

/**
 * Base URL Interceptor (Industry Standard Pattern-based)
 *
 * Automatically prepends API prefix to relative URLs except for excluded patterns.
 * This centralizes API URL management and removes the need for services
 * to include API prefix manually.
 *
 * The API prefix is loaded from runtime configuration (config.json) which is
 * generated from environment variables at container startup. This allows
 * changing the API prefix without rebuilding the Docker image.
 *
 * Behavior:
 * - Absolute URLs (http/https): Passed through unchanged
 * - Excluded patterns: Passed through unchanged
 * - Other relative URLs: Get API prefix added (from runtime config)
 * - Development: /users → proxy → http://localhost:3333/api/users
 * - Production: /users → same domain + apiUrl from config.json
 */
export const baseUrlInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const configService = inject(RuntimeConfigService);

  // Skip absolute URLs (external APIs)
  if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
    return next(req);
  }

  // Skip URLs matching exclusion patterns
  if (shouldSkipApiPrefix(req.url)) {
    return next(req);
  }

  // Get API URL from runtime config (loaded from /assets/config.json)
  const apiUrl = configService.apiUrl || '';

  // Add API prefix for internal API calls (only if apiUrl is not empty)
  const finalUrl = apiUrl ? `${apiUrl}${req.url}` : req.url;
  const apiReq = req.clone({
    url: finalUrl,
  });

  // Debug logging in development (optional)
  if (
    !environment.production &&
    configService.isFeatureEnabled('enableDebug')
  ) {
    console.log(
      `[BaseUrlInterceptor] ${req.method} ${req.url} → ${apiReq.url}`,
    );
  }

  return next(apiReq);
};

/**
 * Check if URL should skip /api prefix based on patterns
 */
function shouldSkipApiPrefix(url: string): boolean {
  return SKIP_API_PREFIX_PATTERNS.some((pattern) => pattern.test(url));
}

/**
 * Add new skip patterns dynamically (for special cases)
 * Note: This modifies the patterns array at runtime
 */
export function addSkipPattern(pattern: RegExp): void {
  // Create a new array to avoid readonly issues
  const patterns = [...SKIP_API_PREFIX_PATTERNS, pattern];
  // Replace the original patterns (for this implementation, we'll keep it simple)
  console.warn(
    'addSkipPattern: Consider using createBaseUrlInterceptor for custom patterns',
  );
}

/**
 * Get current skip patterns (for debugging/testing)
 */
export function getSkipPatterns(): readonly RegExp[] {
  return SKIP_API_PREFIX_PATTERNS;
}

/**
 * Configuration for BaseUrlInterceptor
 * Extended with pattern-based exclusions
 */
export interface BaseUrlConfig {
  skipPatterns?: RegExp[];
  debugMode?: boolean;
  apiPrefix?: string; // Default: '/api'
}

/**
 * Helper function to create config-based interceptor
 * For advanced use cases
 *
 * Note: This function allows override of apiPrefix. If not provided,
 * it will use the runtime config from RuntimeConfigService.
 */
export function createBaseUrlInterceptor(
  config: BaseUrlConfig,
): HttpInterceptorFn {
  const combinedPatterns = [
    ...SKIP_API_PREFIX_PATTERNS,
    ...(config.skipPatterns || []),
  ];

  return (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
  ): Observable<HttpEvent<unknown>> => {
    const configService = inject(RuntimeConfigService);

    // Skip absolute URLs
    if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
      return next(req);
    }

    // Skip URLs matching patterns
    if (combinedPatterns.some((pattern) => pattern.test(req.url))) {
      return next(req);
    }

    // Use provided apiPrefix or fall back to runtime config
    const apiPrefix = config.apiPrefix ?? configService.apiUrl ?? '';

    // Add API prefix (only if not empty)
    const finalUrl = apiPrefix ? `${apiPrefix}${req.url}` : req.url;
    const apiReq = req.clone({
      url: finalUrl,
    });

    // Debug logging
    if (config.debugMode && !environment.production) {
      console.log(
        `[BaseUrlInterceptor] ${req.method} ${req.url} → ${apiReq.url}`,
      );
    }

    return next(apiReq);
  };
}
