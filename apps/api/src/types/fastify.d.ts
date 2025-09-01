import '@fastify/jwt';
import { Knex } from 'knex';
import { Redis } from 'ioredis';

declare module 'fastify' {
  interface FastifyInstance {
    knex: Knex;
    redis?: Redis;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      email: string;
      role: string;
    };
    user: {
      id: string;
      email: string;
      role: string;
    };
  }
}