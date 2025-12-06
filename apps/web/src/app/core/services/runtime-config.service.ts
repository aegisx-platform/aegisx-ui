import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface RuntimeConfig {
  apiUrl: string;
  appName: string;
  version: string;
  features: {
    enableAnalytics: boolean;
    enableDebug: boolean;
  };
}

const DEFAULT_CONFIG: RuntimeConfig = {
  apiUrl: '/api',
  appName: 'AegisX Web',
  version: '1.0.0',
  features: {
    enableAnalytics: false,
    enableDebug: false,
  },
};

@Injectable({
  providedIn: 'root',
})
export class RuntimeConfigService {
  private config: RuntimeConfig = DEFAULT_CONFIG;
  private loaded = false;

  constructor(private http: HttpClient) {}

  /**
   * Load configuration from /assets/config.json
   * This file is generated at container startup from environment variables
   */
  async load(): Promise<RuntimeConfig> {
    if (this.loaded) {
      return this.config;
    }

    try {
      const config = await firstValueFrom(
        this.http.get<RuntimeConfig>('/assets/config.json'),
      );
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.loaded = true;

      if (this.config.features.enableDebug) {
        console.log('[RuntimeConfig] Loaded:', this.config);
      }
    } catch (error) {
      console.warn(
        '[RuntimeConfig] Failed to load config.json, using defaults:',
        error,
      );
      this.config = DEFAULT_CONFIG;
      this.loaded = true;
    }

    return this.config;
  }

  /**
   * Get current configuration
   */
  get(): RuntimeConfig {
    return this.config;
  }

  /**
   * Get API base URL
   */
  get apiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Get app name
   */
  get appName(): string {
    return this.config.appName;
  }

  /**
   * Get app version
   */
  get version(): string {
    return this.config.version;
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof RuntimeConfig['features']): boolean {
    return this.config.features[feature] ?? false;
  }
}

/**
 * Factory function for APP_INITIALIZER
 * Loads runtime config before app starts
 */
export function initializeRuntimeConfig(
  configService: RuntimeConfigService,
): () => Promise<RuntimeConfig> {
  return () => configService.load();
}
