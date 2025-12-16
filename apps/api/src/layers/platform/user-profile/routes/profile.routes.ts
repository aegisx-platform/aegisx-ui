import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import {
  PaginationQuerySchema,
  ApiSuccessResponseSchema,
  ValidationErrorResponseSchema,
  UnauthorizedResponseSchema,
  UnprocessableEntityResponseSchema,
  ServerErrorResponseSchema,
} from '../../../../schemas/base.schemas';
import {
  ProfileResponseSchema,
  UpdateProfileSchema,
  PreferencesResponseSchema,
  UpdatePreferencesSchema,
  AvatarUploadResponseSchema,
  ProfileDeleteResponseSchema,
  GetProfileQuerySchema,
  ChangePasswordSchema,
  ChangePasswordResponseSchema,
  type UpdateProfile,
  type UpdatePreferences,
  type GetProfileQuery,
  type ChangePassword,
} from '../schemas/profile.schemas';

/**
 * User Profile Routes
 *
 * Registers REST API routes for user profile management.
 * All routes require JWT authentication.
 *
 * Routes:
 * - GET    /profile                 - Get user profile
 * - PUT    /profile                 - Update profile
 * - POST   /profile/avatar          - Upload avatar (multipart)
 * - DELETE /profile/avatar          - Delete avatar
 * - GET    /profile/preferences     - Get preferences
 * - PUT    /profile/preferences     - Update preferences
 * - GET    /profile/activity        - Get user activity logs
 * - DELETE /profile                 - Delete profile (account deletion)
 */
export async function registerProfileRoutes(
  fastify: FastifyInstance,
  controllers: {
    profile: any;
    avatar: any;
    preferences: any;
    activity: any;
  },
): Promise<void> {
  /**
   * GET /profile
   * Get user profile
   */
  fastify.get(
    '/',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Get user profile',
        tags: ['User Profile'],
        summary: 'Retrieve current user profile',
        security: [{ bearerAuth: [] }],
        querystring: GetProfileQuerySchema,
        response: {
          200: ProfileResponseSchema,
        },
      },
    },
    async (
      req: FastifyRequest<{ Querystring: GetProfileQuery }>,
      reply: FastifyReply,
    ) => controllers.profile.getProfile(req, reply),
  );

  /**
   * PUT /profile
   * Update profile
   */
  fastify.put(
    '/',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Update user profile',
        tags: ['User Profile'],
        summary: 'Update current user profile information',
        security: [{ bearerAuth: [] }],
        body: UpdateProfileSchema,
        response: {
          200: ProfileResponseSchema,
        },
      },
    },
    async (req: FastifyRequest<{ Body: UpdateProfile }>, reply: FastifyReply) =>
      controllers.profile.updateProfile(req, reply),
  );

  /**
   * POST /profile/password
   * Change password
   */
  fastify.post(
    '/password',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Change user password',
        tags: ['User Profile'],
        summary: 'Change current user password',
        security: [{ bearerAuth: [] }],
        body: ChangePasswordSchema,
        response: {
          200: ChangePasswordResponseSchema,
          400: ValidationErrorResponseSchema,
          401: UnauthorizedResponseSchema,
          422: UnprocessableEntityResponseSchema,
          500: ServerErrorResponseSchema,
        },
      },
    },
    async (
      req: FastifyRequest<{ Body: ChangePassword }>,
      reply: FastifyReply,
    ) => controllers.profile.changePassword(req, reply),
  );

  /**
   * POST /profile/avatar
   * Upload avatar (multipart)
   */
  fastify.post(
    '/avatar',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Upload user avatar',
        tags: ['User Profile'],
        summary: 'Upload or replace user avatar image',
        security: [{ bearerAuth: [] }],
        consumes: ['multipart/form-data'],
        response: {
          200: AvatarUploadResponseSchema,
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) =>
      controllers.avatar.uploadAvatar(req, reply),
  );

  /**
   * DELETE /profile/avatar
   * Delete avatar
   */
  fastify.delete(
    '/avatar',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Delete user avatar',
        tags: ['User Profile'],
        summary: 'Remove user avatar image',
        security: [{ bearerAuth: [] }],
        response: {
          200: ApiSuccessResponseSchema(
            Object.create({
              message: { type: 'string', description: 'Deletion confirmation' },
            }),
          ),
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) =>
      controllers.avatar.deleteAvatar(req, reply),
  );

  /**
   * GET /profile/preferences
   * Get preferences
   */
  fastify.get(
    '/preferences',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Get user preferences',
        tags: ['User Profile'],
        summary: 'Retrieve current user preferences',
        security: [{ bearerAuth: [] }],
        response: {
          200: PreferencesResponseSchema,
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) =>
      controllers.preferences.getPreferences(req, reply),
  );

  /**
   * PUT /profile/preferences
   * Update preferences
   */
  fastify.put(
    '/preferences',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Update user preferences',
        tags: ['User Profile'],
        summary: 'Update current user preferences',
        security: [{ bearerAuth: [] }],
        body: UpdatePreferencesSchema,
        response: {
          200: PreferencesResponseSchema,
        },
      },
    },
    async (
      req: FastifyRequest<{ Body: UpdatePreferences }>,
      reply: FastifyReply,
    ) => controllers.preferences.updatePreferences(req, reply),
  );

  /**
   * GET /profile/activity
   * Get user activity logs
   */
  fastify.get(
    '/activity',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Get user activity logs',
        tags: ['User Profile'],
        summary: 'Retrieve user activity history with pagination',
        security: [{ bearerAuth: [] }],
        querystring: PaginationQuerySchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean', const: true },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    action: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' },
                    details: { type: 'object', additionalProperties: true },
                  },
                },
              },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'number', minimum: 1 },
                  limit: { type: 'number', minimum: 1, maximum: 1000 },
                  total: { type: 'number', minimum: 0 },
                  totalPages: { type: 'number', minimum: 0 },
                },
              },
            },
          },
        },
      },
    },
    async (
      req: FastifyRequest<{
        Querystring: Static<typeof PaginationQuerySchema>;
      }>,
      reply: FastifyReply,
    ) => controllers.activity.getActivity(req, reply),
  );

  /**
   * DELETE /profile
   * Delete profile (account deletion)
   */
  fastify.delete(
    '/',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Delete user profile',
        tags: ['User Profile'],
        summary: 'Permanently delete current user account',
        security: [{ bearerAuth: [] }],
        response: {
          200: ProfileDeleteResponseSchema,
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) =>
      controllers.profile.deleteProfile(req, reply),
  );
}
