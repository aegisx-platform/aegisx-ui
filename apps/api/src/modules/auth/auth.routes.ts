import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { authController } from './auth.controller';
import { SchemaRefs } from '../../schemas/registry';

export default async function authRoutes(fastify: FastifyInstance) {
  const typedFastify = fastify.withTypeProvider<TypeBoxTypeProvider>();
  
  // POST /api/auth/register
  typedFastify.route({
    method: 'POST',
    url: '/api/auth/register',
    schema: {
      body: SchemaRefs.module('auth', 'registerRequest'),
      response: {
        201: SchemaRefs.module('auth', 'registerResponse'),
        400: SchemaRefs.ValidationError,
        409: SchemaRefs.Conflict,
        500: SchemaRefs.ServerError
      }
    },
    handler: authController.register
  });

  // POST /api/auth/login
  typedFastify.route({
    method: 'POST',
    url: '/api/auth/login',
    schema: {
      body: SchemaRefs.module('auth', 'loginRequest'),
      response: {
        200: SchemaRefs.module('auth', 'authResponse'),
        401: SchemaRefs.Unauthorized,
        500: SchemaRefs.ServerError
      }
    },
    handler: authController.login
  });

  // POST /api/auth/refresh
  typedFastify.route({
    method: 'POST',
    url: '/api/auth/refresh',
    schema: {
      body: SchemaRefs.module('auth', 'refreshRequest'),
      response: {
        200: SchemaRefs.module('auth', 'refreshResponse'),
        401: SchemaRefs.Unauthorized,
        500: SchemaRefs.ServerError
      }
    },
    handler: authController.refresh
  });

  // TODO: Implement profile and logout endpoints
  // GET /api/auth/profile - Requires authController.profile implementation
  // POST /api/auth/logout - Requires authController.logout implementation
}