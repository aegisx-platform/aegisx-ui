import { Type, Static } from '@sinclair/typebox';
import { ApiSuccessResponseSchema } from '../../schemas/base.schemas';

/**
 * Default Module Schemas
 * Using TypeBox for type safety and runtime validation
 */

// API Info Schema
export const ApiInfoSchema = Type.Object({
  name: Type.String({ description: 'API name', example: 'AegisX API' }),
  version: Type.String({ pattern: '^\\d+\\.\\d+\\.\\d+$', description: 'API version following semver', example: '1.0.0' }),
  description: Type.String({ description: 'API description', example: 'Enterprise-grade API for AegisX Platform' }),
  environment: Type.Union([
    Type.Literal('development'),
    Type.Literal('staging'),
    Type.Literal('production')
  ], { description: 'Current environment', example: 'production' }),
  uptime: Type.Number({ description: 'Server uptime in seconds', example: 3600 }),
  timestamp: Type.String({ format: 'date-time', description: 'Current server time', example: new Date().toISOString() })
});

// System Status Schema
export const SystemStatusSchema = Type.Object({
  status: Type.Union([
    Type.Literal('healthy'),
    Type.Literal('degraded'),
    Type.Literal('unhealthy')
  ], { description: 'Overall system status', example: 'healthy' }),
  services: Type.Object({
    database: Type.Object({
      status: Type.Union([Type.Literal('connected'), Type.Literal('disconnected')]),
      latency: Type.Optional(Type.Number({ description: 'Database latency in ms' }))
    }),
    redis: Type.Object({
      status: Type.Union([Type.Literal('connected'), Type.Literal('disconnected')]),
      latency: Type.Optional(Type.Number({ description: 'Redis latency in ms' }))
    }),
    auth: Type.Object({
      status: Type.Union([Type.Literal('operational'), Type.Literal('down')]),
      provider: Type.String({ description: 'Authentication provider' })
    })
  }),
  memory: Type.Object({
    used: Type.Number({ description: 'Used memory in MB' }),
    total: Type.Number({ description: 'Total memory in MB' }),
    percentage: Type.Number({ description: 'Memory usage percentage' })
  }),
  cpu: Type.Object({
    usage: Type.Number({ description: 'CPU usage percentage' }),
    cores: Type.Number({ description: 'Number of CPU cores' })
  }),
  timestamp: Type.String({ format: 'date-time' })
});

// Health Check Schema
export const HealthCheckSchema = Type.Object({
  status: Type.Union([
    Type.Literal('ok'),
    Type.Literal('error')
  ], { description: 'Health check status', example: 'ok' }),
  timestamp: Type.String({ format: 'date-time', description: 'Health check timestamp', example: new Date().toISOString() }),
  version: Type.String({ description: 'API version', example: '1.0.0' }),
  checks: Type.Optional(Type.Array(Type.Object({
    name: Type.String({ description: 'Check name' }),
    status: Type.Union([Type.Literal('pass'), Type.Literal('fail')]),
    message: Type.Optional(Type.String())
  })))
});

// Ping Response Schema
export const PingResponseSchema = Type.Object({
  message: Type.Literal('pong', { description: 'Ping response message', example: 'pong' }),
  timestamp: Type.String({ format: 'date-time', description: 'Response timestamp', example: new Date().toISOString() })
});

// Response Schemas
export const ApiInfoResponseSchema = ApiSuccessResponseSchema(ApiInfoSchema);
export const SystemStatusResponseSchema = ApiSuccessResponseSchema(SystemStatusSchema);
export const HealthCheckResponseSchema = ApiSuccessResponseSchema(HealthCheckSchema);
export const PingResponseDataSchema = ApiSuccessResponseSchema(PingResponseSchema);

// TypeScript Types
export type ApiInfo = Static<typeof ApiInfoSchema>;
export type SystemStatus = Static<typeof SystemStatusSchema>;
export type HealthCheck = Static<typeof HealthCheckSchema>;
export type PingResponse = Static<typeof PingResponseSchema>;
export type ApiInfoResponse = Static<typeof ApiInfoResponseSchema>;
export type SystemStatusResponse = Static<typeof SystemStatusResponseSchema>;
export type HealthCheckResponse = Static<typeof HealthCheckResponseSchema>;
export type PingResponseData = Static<typeof PingResponseDataSchema>;

// Export schemas for registration
export const defaultSchemas = {
  'api-info': ApiInfoSchema,
  'system-status': SystemStatusSchema,
  'health-check': HealthCheckSchema,
  'ping-response': PingResponseSchema,
  'api-info-response': ApiInfoResponseSchema,
  'system-status-response': SystemStatusResponseSchema,
  'health-check-response': HealthCheckResponseSchema,
  'ping-response-data': PingResponseDataSchema,
  
  // Legacy compatibility
  'apiInfoResponse': ApiInfoResponseSchema,
  'apiStatusResponse': SystemStatusResponseSchema,
  'healthResponse': HealthCheckResponseSchema,
  'pingResponse': PingResponseDataSchema
};