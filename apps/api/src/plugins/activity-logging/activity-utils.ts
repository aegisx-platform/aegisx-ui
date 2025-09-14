import { FastifyRequest, FastifyReply } from 'fastify';
import { ActivityLogConfig, presetConfigs } from './activity-config';

/**
 * Utility functions for common activity logging scenarios
 */
export class ActivityUtils {
  
  /**
   * Create activity config for authentication routes
   */
  static auth(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      ...presetConfigs.auth,
      ...customConfig,
    };
  }

  /**
   * Create activity config for profile management routes
   */
  static profile(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      ...presetConfigs.profile,
      ...customConfig,
    };
  }

  /**
   * Create activity config for security-sensitive routes
   */
  static security(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      ...presetConfigs.security,
      ...customConfig,
    };
  }

  /**
   * Create activity config for administrative routes
   */
  static admin(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      ...presetConfigs.admin,
      ...customConfig,
    };
  }

  /**
   * Create activity config for general API access
   */
  static api(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      ...presetConfigs.api,
      ...customConfig,
    };
  }

  /**
   * Create activity config that only logs errors
   */
  static errorOnly(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      ...presetConfigs.errorOnly,
      ...customConfig,
    };
  }

  /**
   * Create custom activity config with specific action and description
   */
  static custom(
    action: string,
    description: string,
    customConfig?: Partial<ActivityLogConfig>
  ): ActivityLogConfig {
    return {
      enabled: true,
      action,
      description,
      severity: 'info',
      ...customConfig,
    };
  }

  /**
   * Create activity config for login attempts
   */
  static loginAttempt(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      enabled: true,
      action: 'login_attempt',
      description: 'User attempted to log in',
      severity: 'info',
      includeRequestData: false, // Never log passwords
      async: false, // Ensure login events are logged synchronously
      shouldLog: (request: FastifyRequest, reply: FastifyReply) => {
        // Log both successful and failed login attempts
        return true;
      },
      ...customConfig,
    };
  }

  /**
   * Create activity config for successful login
   */
  static loginSuccess(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      enabled: true,
      action: 'login',
      description: 'User successfully logged in',
      severity: 'info',
      async: false,
      metadata: { success: true },
      ...customConfig,
    };
  }

  /**
   * Create activity config for failed login
   */
  static loginFailure(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      enabled: true,
      action: 'login_failed',
      description: 'Failed login attempt',
      severity: 'warning',
      async: false,
      metadata: { success: false },
      shouldLog: (request: FastifyRequest, reply: FastifyReply) => {
        // Only log if login failed
        return reply.statusCode >= 400;
      },
      ...customConfig,
    };
  }

  /**
   * Create activity config for logout
   */
  static logout(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      enabled: true,
      action: 'logout',
      description: 'User logged out',
      severity: 'info',
      async: true,
      ...customConfig,
    };
  }

  /**
   * Create activity config for profile updates
   */
  static profileUpdate(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      enabled: true,
      action: 'profile_update',
      description: 'Profile information updated',
      severity: 'info',
      includeRequestData: true,
      shouldLog: (request: FastifyRequest, reply: FastifyReply) => {
        // Only log successful updates
        return reply.statusCode < 300;
      },
      ...customConfig,
    };
  }

  /**
   * Create activity config for password changes
   */
  static passwordChange(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      enabled: true,
      action: 'password_change',
      description: 'Password changed successfully',
      severity: 'warning', // Password changes are security events
      includeRequestData: false, // Never log passwords
      async: false, // Ensure security events are logged synchronously
      shouldLog: (request: FastifyRequest, reply: FastifyReply) => {
        // Only log successful password changes
        return reply.statusCode < 300;
      },
      ...customConfig,
    };
  }

  /**
   * Create activity config for avatar uploads
   */
  static avatarUpload(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      enabled: true,
      action: 'avatar_upload',
      description: 'Profile avatar uploaded',
      severity: 'info',
      includeRequestData: false, // Don't log file data
      shouldLog: (request: FastifyRequest, reply: FastifyReply) => {
        return reply.statusCode < 300;
      },
      ...customConfig,
    };
  }

  /**
   * Create activity config for preferences updates
   */
  static preferencesUpdate(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      enabled: true,
      action: 'preferences_update',
      description: 'User preferences updated',
      severity: 'info',
      includeRequestData: true,
      shouldLog: (request: FastifyRequest, reply: FastifyReply) => {
        return reply.statusCode < 300;
      },
      ...customConfig,
    };
  }

  /**
   * Create activity config for theme changes
   */
  static themeChange(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      enabled: true,
      action: 'theme_change',
      description: 'Theme preference changed',
      severity: 'info',
      includeRequestData: true,
      ...customConfig,
    };
  }

  /**
   * Create activity config for suspicious activities
   */
  static suspiciousActivity(
    reason: string,
    customConfig?: Partial<ActivityLogConfig>
  ): ActivityLogConfig {
    return {
      enabled: true,
      action: 'suspicious_activity',
      description: `Suspicious activity detected: ${reason}`,
      severity: 'critical',
      includeRequestData: true,
      includeResponseData: false,
      async: false, // Critical events should be logged synchronously
      metadata: { 
        reason,
        requires_review: true,
        timestamp: new Date().toISOString(),
      },
      ...customConfig,
    };
  }

  /**
   * Create activity config for API errors
   */
  static apiError(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      enabled: true,
      action: 'api_error',
      severity: 'error',
      includeRequestData: true,
      shouldLog: (request: FastifyRequest, reply: FastifyReply) => {
        return reply.statusCode >= 400;
      },
      ...customConfig,
    };
  }

  /**
   * Create activity config for data access (GDPR/audit compliance)
   */
  static dataAccess(
    dataType: string,
    customConfig?: Partial<ActivityLogConfig>
  ): ActivityLogConfig {
    return {
      enabled: true,
      action: 'data_access',
      description: `Accessed ${dataType} data`,
      severity: 'info',
      includeRequestData: false,
      includeResponseData: false, // Don't log actual data for privacy
      async: false, // Audit logs should be synchronous
      metadata: {
        data_type: dataType,
        compliance: 'audit_trail',
      },
      ...customConfig,
    };
  }

  /**
   * Create activity config for data export (GDPR compliance)
   */
  static dataExport(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      enabled: true,
      action: 'data_export',
      description: 'User data exported',
      severity: 'warning', // Data exports are important events
      includeRequestData: true,
      includeResponseData: false, // Don't log exported data
      async: false,
      metadata: {
        compliance: 'gdpr_export',
        timestamp: new Date().toISOString(),
      },
      ...customConfig,
    };
  }

  /**
   * Create activity config for account deletion
   */
  static accountDeletion(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      enabled: true,
      action: 'account_deletion',
      description: 'User account deletion requested',
      severity: 'critical',
      includeRequestData: true,
      async: false, // Critical security events should be synchronous
      metadata: {
        compliance: 'gdpr_deletion',
        requires_review: true,
      },
      ...customConfig,
    };
  }

  /**
   * Create conditional activity config based on route method
   */
  static conditional(
    conditions: {
      GET?: ActivityLogConfig;
      POST?: ActivityLogConfig;
      PUT?: ActivityLogConfig;
      PATCH?: ActivityLogConfig;
      DELETE?: ActivityLogConfig;
    }
  ): ActivityLogConfig {
    return {
      enabled: true,
      shouldLog: (request: FastifyRequest, reply: FastifyReply) => {
        const method = request.method as keyof typeof conditions;
        const config = conditions[method];
        return config ? config.enabled !== false : false;
      },
      // This will be overridden by the middleware based on method
      action: 'api_access',
    };
  }

  /**
   * Create rate-limit specific activity config
   */
  static rateLimitHit(customConfig?: Partial<ActivityLogConfig>): ActivityLogConfig {
    return {
      enabled: true,
      action: 'rate_limit_hit',
      description: 'Rate limit exceeded',
      severity: 'warning',
      includeRequestData: true,
      async: false,
      shouldLog: (request: FastifyRequest, reply: FastifyReply) => {
        return reply.statusCode === 429;
      },
      ...customConfig,
    };
  }

  /**
   * Create bulk operation activity config
   */
  static bulkOperation(
    operation: string,
    customConfig?: Partial<ActivityLogConfig>
  ): ActivityLogConfig {
    return {
      enabled: true,
      action: `bulk_${operation}`,
      description: `Bulk ${operation} operation performed`,
      severity: 'info',
      includeRequestData: true,
      metadata: {
        operation_type: 'bulk',
        operation: operation,
      },
      ...customConfig,
    };
  }
}

/**
 * Helper function to merge multiple activity configs
 */
export function mergeActivityConfigs(...configs: Partial<ActivityLogConfig>[]): ActivityLogConfig {
  return configs.reduce((merged, config) => ({
    ...merged,
    ...config,
    metadata: {
      ...merged.metadata,
      ...config.metadata,
    },
  }), { enabled: false }) as ActivityLogConfig;
}

/**
 * Helper function to create time-based activity config
 */
export function timeBasedConfig(
  baseConfig: ActivityLogConfig,
  timeRanges: {
    start: string; // HH:MM format
    end: string;   // HH:MM format
    config: Partial<ActivityLogConfig>;
  }[]
): ActivityLogConfig {
  return {
    ...baseConfig,
    shouldLog: (request: FastifyRequest, reply: FastifyReply) => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      // Check if current time falls within any specified range
      for (const range of timeRanges) {
        if (currentTime >= range.start && currentTime <= range.end) {
          const mergedConfig = { ...baseConfig, ...range.config };
          return mergedConfig.shouldLog ? mergedConfig.shouldLog(request, reply) : mergedConfig.enabled;
        }
      }
      
      // Default behavior
      return baseConfig.shouldLog ? baseConfig.shouldLog(request, reply) : baseConfig.enabled;
    },
  };
}