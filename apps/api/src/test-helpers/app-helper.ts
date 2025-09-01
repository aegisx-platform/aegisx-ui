import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import fastifyAuth from '@fastify/auth';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';

// Import plugins
import knexPlugin from '../plugins/knex.plugin';
import responseHandlerPlugin from '../plugins/response-handler.plugin';
import errorHandlerPlugin from '../plugins/error-handler.plugin';
import schemasPlugin from '../plugins/schemas.plugin';
import authStrategiesPlugin from '../modules/auth/strategies/auth.strategies';
import authPlugin from '../modules/auth/auth.plugin';
import navigationPlugin from '../modules/navigation/navigation.plugin';
import userProfilePlugin from '../modules/user-profile/user-profile.plugin';

/**
 * Build a Fastify app instance for testing
 * @param options Fastify server options
 * @returns Promise<FastifyInstance>
 */
export async function build(options: FastifyServerOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false,
    ...options
  });

  // 1. Essential utilities and sensible defaults
  await app.register(fastifySensible);

  // 2. Infrastructure plugins
  await app.register(fastifyCors, {
    origin: true,
    credentials: true
  });

  // 3. Database connection
  await app.register(knexPlugin);

  // 4. Authentication
  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'test-secret',
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    },
    cookie: {
      cookieName: 'refreshToken',
      signed: false,
    },
  });

  // 5. Cookie support (for refresh tokens)
  await app.register(fastifyCookie, {
    secret: process.env.SESSION_SECRET || 'test-secret',
    parseOptions: {
      httpOnly: true,
      secure: false, // Disable for tests
      sameSite: 'strict'
    }
  });

  // 6. Authentication strategies
  await app.register(fastifyAuth);

  // 7. Response handler
  await app.register(responseHandlerPlugin);

  // 8. Error handler
  await app.register(errorHandlerPlugin);

  // 9. Common schemas
  await app.register(schemasPlugin);

  // 10. Auth strategies
  await app.register(authStrategiesPlugin);

  // 11. Feature modules
  await app.register(authPlugin);
  await app.register(navigationPlugin);
  await app.register(userProfilePlugin);

  // Health check
  app.get('/health', async () => {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: 'test'
    };
  });

  // Wait for app to be ready
  await app.ready();

  return app;
}