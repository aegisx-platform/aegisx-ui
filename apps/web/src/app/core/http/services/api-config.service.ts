import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

/**
 * API Configuration Service
 *
 * Provides centralized configuration for API endpoints that don't go through
 * HTTP interceptors, such as WebSocket connections.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  /**
   * Get the WebSocket URL based on environment
   */
  getWebSocketUrl(): string {
    // If environment has explicit apiUrl, use it
    if (environment.apiUrl && environment.apiUrl !== '/api') {
      return environment.apiUrl;
    }

    // Get current domain and protocol
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const hostname = window.location.hostname;

    // In development, WebSocket must connect to API server, not dev server
    if (!environment.production) {
      // In dev, connect directly to API port (3333)
      // Check if we're on localhost dev server (port 4200)
      if (window.location.port === '4200') {
        return `${protocol}//${hostname}:3333`;
      }
      // Otherwise use current host
      return `${protocol}//${window.location.host}`;
    }

    // In production, use same domain
    return `${protocol}//${window.location.host}`;
  }

  /**
   * Get WebSocket path from configuration
   */
  getWebSocketPath(): string {
    // Support custom WebSocket path from environment
    const wsConfig = (environment as any).websocket;
    if (wsConfig?.path) {
      return wsConfig.path;
    }

    // Default path that matches backend configuration
    return '/api/ws/';
  }

  /**
   * Get WebSocket configuration options
   */
  getWebSocketConfig() {
    const wsConfig = (environment as any).websocket;

    return {
      timeout: wsConfig?.timeout || 20000,
      reconnectionAttempts: wsConfig?.reconnectionAttempts || 5,
      forceSecure: wsConfig?.forceSecure || false,
      transports: wsConfig?.transports || ['websocket', 'polling'], // Default to both transports
      upgrade: wsConfig?.upgrade !== false, // Allow upgrade by default
    };
  }

  /**
   * Get the HTTP API base URL
   * (mainly for debugging, actual HTTP calls go through interceptor)
   */
  getApiBaseUrl(): string {
    return environment.apiUrl || '';
  }

  /**
   * Check if we're in development mode
   */
  isDevelopment(): boolean {
    return !environment.production;
  }

  /**
   * Check if we're in production mode
   */
  isProduction(): boolean {
    return environment.production;
  }

  /**
   * Get feature flags from environment
   */
  getFeatures() {
    return environment.features || {};
  }
}
