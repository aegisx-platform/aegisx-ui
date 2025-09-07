import { Type, Static } from '@sinclair/typebox';

// User entity schema (matches database)
const UserEntitySchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  email: Type.String({ format: 'email' }),
  username: Type.String({ minLength: 3, maxLength: 100 }),
  firstName: Type.Optional(Type.String({ maxLength: 100 })),
  lastName: Type.Optional(Type.String({ maxLength: 100 })),
  isActive: Type.Boolean(),
  lastLoginAt: Type.Optional(Type.String({ format: 'date-time' })),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

// User with role information
const UserWithRoleSchema = Type.Intersect([
  UserEntitySchema,
  Type.Object({
    role: Type.String(), // Role name from joined table
  }),
]);

// List users query parameters
const ListUsersQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100, default: 10 })),
  search: Type.Optional(Type.String()),
  role: Type.Optional(Type.String()),
  status: Type.Optional(
    Type.Union([Type.Literal('active'), Type.Literal('inactive')]),
  ),
  sortBy: Type.Optional(Type.String()),
  sortOrder: Type.Optional(
    Type.Union([Type.Literal('asc'), Type.Literal('desc')]),
  ),
});

// List users response
const ListUsersResponseSchema = Type.Object({
  data: Type.Array(UserWithRoleSchema),
  pagination: Type.Object({
    page: Type.Number(),
    limit: Type.Number(),
    total: Type.Number(),
    totalPages: Type.Number(),
  }),
});

// Get user response
const GetUserResponseSchema = Type.Object({
  data: UserWithRoleSchema,
});

// Create user request
const CreateUserRequestSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  username: Type.String({ minLength: 3, maxLength: 100 }),
  password: Type.String({ minLength: 8 }),
  firstName: Type.Optional(Type.String({ maxLength: 100 })),
  lastName: Type.Optional(Type.String({ maxLength: 100 })),
  roleId: Type.String({ format: 'uuid' }),
  isActive: Type.Optional(Type.Boolean({ default: true })),
});

// Create user response
const CreateUserResponseSchema = Type.Object({
  data: UserWithRoleSchema,
});

// Update user request
const UpdateUserRequestSchema = Type.Object({
  email: Type.Optional(Type.String({ format: 'email' })),
  username: Type.Optional(Type.String({ minLength: 3, maxLength: 100 })),
  firstName: Type.Optional(Type.String({ maxLength: 100 })),
  lastName: Type.Optional(Type.String({ maxLength: 100 })),
  roleId: Type.Optional(Type.String({ format: 'uuid' })),
  isActive: Type.Optional(Type.Boolean()),
});

// Update user response
const UpdateUserResponseSchema = Type.Object({
  data: UserWithRoleSchema,
});

// Delete user response
const DeleteUserResponseSchema = Type.Object({
  data: Type.Object({
    id: Type.String({ format: 'uuid' }),
    message: Type.String(),
  }),
});

// Change password request (for admin to reset user password)
const ChangeUserPasswordRequestSchema = Type.Object({
  newPassword: Type.String({ minLength: 8 }),
});

// Success message response
const SuccessMessageResponseSchema = Type.Object({
  data: Type.Object({
    message: Type.String(),
  }),
});

// Export schemas for registration
export const usersSchemas = {
  'list-users-query': ListUsersQuerySchema,
  'list-users-response': ListUsersResponseSchema,
  'get-user-response': GetUserResponseSchema,
  'create-user-request': CreateUserRequestSchema,
  'create-user-response': CreateUserResponseSchema,
  'update-user-request': UpdateUserRequestSchema,
  'update-user-response': UpdateUserResponseSchema,
  'delete-user-response': DeleteUserResponseSchema,
  'change-user-password-request': ChangeUserPasswordRequestSchema,
  'success-message-response': SuccessMessageResponseSchema,
};

// Export types
export type UserEntity = Static<typeof UserEntitySchema>;
export type UserWithRole = Static<typeof UserWithRoleSchema>;
export type ListUsersQuery = Static<typeof ListUsersQuerySchema>;
export type ListUsersResponse = Static<typeof ListUsersResponseSchema>;
export type GetUserResponse = Static<typeof GetUserResponseSchema>;
export type CreateUserRequest = Static<typeof CreateUserRequestSchema>;
export type CreateUserResponse = Static<typeof CreateUserResponseSchema>;
export type UpdateUserRequest = Static<typeof UpdateUserRequestSchema>;
export type UpdateUserResponse = Static<typeof UpdateUserResponseSchema>;
export type DeleteUserResponse = Static<typeof DeleteUserResponseSchema>;
export type ChangeUserPasswordRequest = Static<
  typeof ChangeUserPasswordRequestSchema
>;
