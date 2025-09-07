import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { container } from 'tsyringe';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { usersRoutes } from './users.routes';
import { usersSchemas } from './users.schemas';

export default fp(
  async function usersPlugin(
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
  ) {
    // Register module schemas using the schema registry
    if ((fastify as any).schemaRegistry) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'users',
        usersSchemas,
      );
    }

    // Register dependencies in the container
    container.register(UsersRepository, {
      useFactory: () => new UsersRepository(fastify.knex),
    });

    // Get instances from container
    const usersService = container.resolve(UsersService);
    const usersController = container.resolve(UsersController);

    // Register routes
    await fastify.register(usersRoutes, {
      controller: usersController,
    });
  },
  {
    name: 'users-plugin',
    dependencies: ['knex-plugin', 'jwt-auth-plugin'],
  },
);
