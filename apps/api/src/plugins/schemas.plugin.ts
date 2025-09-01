import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { createSchemaRegistry } from '../schemas/registry';

/**
 * Schemas Plugin
 * Registers TypeBox type provider and all base schemas
 */
async function schemasPlugin(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  // Set up TypeBox type provider for enhanced type safety
  fastify.withTypeProvider<TypeBoxTypeProvider>();

  // Create and initialize schema registry
  const schemaRegistry = createSchemaRegistry(fastify);

  // Decorate fastify with schema registry for module access
  fastify.decorate('schemaRegistry', schemaRegistry);

  fastify.log.info('Schema registry initialized with base schemas');
}

// Augment FastifyInstance type to include schemaRegistry
declare module 'fastify' {
  interface FastifyInstance {
    schemaRegistry: import('../schemas/registry').SchemaRegistry;
  }
}

export default fp(schemasPlugin, {
  name: 'schemas-plugin'
});