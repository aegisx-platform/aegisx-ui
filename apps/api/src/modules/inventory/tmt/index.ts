import { FastifyInstance } from 'fastify';
import { tmtController } from './tmt.controller';

export async function tmtRoutes(fastify: FastifyInstance) {
  // Register TMT routes under /tmt prefix
  await fastify.register(tmtController, { prefix: '/tmt' });
}

export * from './tmt.schemas';
export * from './tmt.service';
export * from './tmt.repository';
