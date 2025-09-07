import { FastifyRequest, FastifyReply } from 'fastify';
import { injectable } from 'tsyringe';
import { UsersService } from './users.service';
import {
  ListUsersQuery,
  CreateUserRequest,
  UpdateUserRequest,
  ChangeUserPasswordRequest,
} from './users.schemas';

@injectable()
export class UsersController {
  constructor(private usersService: UsersService) {}

  async listUsers(
    request: FastifyRequest<{ Querystring: ListUsersQuery }>,
    reply: FastifyReply,
  ) {
    const result = await this.usersService.listUsers(request.query);
    return reply.success(result);
  }

  async getUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const user = await this.usersService.getUserById(request.params.id);
    return reply.success({ data: user });
  }

  async createUser(
    request: FastifyRequest<{ Body: CreateUserRequest }>,
    reply: FastifyReply,
  ) {
    const user = await this.usersService.createUser(request.body);
    return reply.code(201).success({ data: user });
  }

  async updateUser(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateUserRequest;
    }>,
    reply: FastifyReply,
  ) {
    const user = await this.usersService.updateUser(
      request.params.id,
      request.body,
    );
    return reply.success({ data: user });
  }

  async changeUserPassword(
    request: FastifyRequest<{
      Params: { id: string };
      Body: ChangeUserPasswordRequest;
    }>,
    reply: FastifyReply,
  ) {
    await this.usersService.changeUserPassword(
      request.params.id,
      request.body.newPassword,
    );
    return reply.success({
      data: { message: 'Password changed successfully' },
    });
  }

  async deleteUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const currentUserId = request.user.id;
    await this.usersService.deleteUser(request.params.id, currentUserId);
    return reply.success({
      data: {
        id: request.params.id,
        message: 'User deleted successfully',
      },
    });
  }
}
