import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest } from 'fastify';
import monitoringRoutes from './monitoring.routes';
import { monitoringSchemas } from './monitoring.schemas';
import metricsPlugin from './plugins/metrics.plugin';
import { createSessionTracker } from './services/session-tracker.service';

async function monitoringPlugin(fastify: FastifyInstance) {
  // Register metrics plugin FIRST (before routes, to collect metrics on all requests)
  await fastify.register(metricsPlugin);

  // Initialize session tracker
  const sessionTracker = createSessionTracker(fastify);

  // Note: errorQueue is initialized in plugins/monitoring.plugin.ts (early monitoring)
  // and is available here via decorator

  // Add hook to track user sessions on every authenticated request
  // Use onResponse instead of onRequest to ensure request.user is populated after JWT verification
  // Using synchronous hook with done() callback for better performance (no async overhead)
  fastify.addHook('onResponse', async (request: FastifyRequest) => {
    // Check if request has authenticated user
    if (request.user?.id) {
      // Fire-and-forget: Call updateActivity without awaiting
      // Error handling is built into updateActivity() method
      sessionTracker.updateActivity(
        request.user.id,
        request.user.email,
        request.id, // Use request ID as session ID
      );
    }
    // Return immediately without waiting for updateActivity to complete
  });

  // Register monitoring schemas
  fastify.schemaRegistry.registerModuleSchemas('monitoring', monitoringSchemas);

  // Register monitoring routes under /monitoring
  await fastify.register(monitoringRoutes, { prefix: '/monitoring' });
}

export default fp(monitoringPlugin, {
  name: 'monitoring-module',
  dependencies: [
    'logging-plugin',
    'schemas-plugin',
    'redis-plugin',
    'knex-plugin',
  ],
  fastify: '>=4.x',
  // Note: encapsulate is default (true) since errorQueue is now in early monitoring plugin
});
