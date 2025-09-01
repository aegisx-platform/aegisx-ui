import { FastifyInstance } from 'fastify';
import { UserProfileController } from './user-profile.controller';
import {
  userProfileResponseSchema,
  userProfileUpdateRequestSchema,
  userPreferencesUpdateRequestSchema,
  avatarUploadResponseSchema,
  avatarDeleteResponseSchema,
  errorResponseSchema,
  validationErrorResponseSchema
} from './user-profile.schemas';

export interface UserProfileRoutesOptions {
  controller: UserProfileController;
}

export async function userProfileRoutes(
  fastify: FastifyInstance,
  options: UserProfileRoutesOptions
) {
  const { controller } = options;

  // Get current user profile
  fastify.get('/users/profile', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Get current user profile',
      tags: ['User Profile'],
      security: [{ bearerAuth: [] }],
      response: {
        200: userProfileResponseSchema,
        401: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, controller.getUserProfile.bind(controller));

  // Update current user profile
  fastify.put('/users/profile', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Update current user profile',
      tags: ['User Profile'],
      security: [{ bearerAuth: [] }],
      body: userProfileUpdateRequestSchema,
      response: {
        200: userProfileResponseSchema,
        400: validationErrorResponseSchema,
        401: errorResponseSchema,
        404: errorResponseSchema,
        422: validationErrorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, controller.updateUserProfile.bind(controller));

  // Get user preferences
  fastify.get('/users/preferences', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Get current user preferences',
      tags: ['User Profile'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                theme: { type: 'string', enum: ['default', 'dark', 'light', 'auto'] },
                scheme: { type: 'string', enum: ['light', 'dark', 'auto'] },
                layout: { type: 'string', enum: ['classic', 'compact', 'enterprise', 'empty'] },
                language: { type: 'string' },
                timezone: { type: 'string' },
                dateFormat: { type: 'string', enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] },
                timeFormat: { type: 'string', enum: ['12h', '24h'] },
                notifications: {
                  type: 'object',
                  properties: {
                    email: { type: 'boolean' },
                    push: { type: 'boolean' },
                    desktop: { type: 'boolean' },
                    sound: { type: 'boolean' }
                  }
                },
                navigation: {
                  type: 'object',
                  properties: {
                    collapsed: { type: 'boolean' },
                    type: { type: 'string', enum: ['default', 'compact', 'horizontal'] },
                    position: { type: 'string', enum: ['left', 'right', 'top'] }
                  }
                }
              }
            }
          },
          required: ['success']
        },
        401: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, controller.getUserPreferences.bind(controller));

  // Update user preferences
  fastify.put('/users/preferences', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Update current user preferences',
      tags: ['User Profile'],
      security: [{ bearerAuth: [] }],
      body: userPreferencesUpdateRequestSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                theme: { type: 'string', enum: ['default', 'dark', 'light', 'auto'] },
                scheme: { type: 'string', enum: ['light', 'dark', 'auto'] },
                layout: { type: 'string', enum: ['classic', 'compact', 'enterprise', 'empty'] },
                language: { type: 'string' },
                timezone: { type: 'string' },
                dateFormat: { type: 'string', enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] },
                timeFormat: { type: 'string', enum: ['12h', '24h'] },
                notifications: {
                  type: 'object',
                  properties: {
                    email: { type: 'boolean' },
                    push: { type: 'boolean' },
                    desktop: { type: 'boolean' },
                    sound: { type: 'boolean' }
                  }
                },
                navigation: {
                  type: 'object',
                  properties: {
                    collapsed: { type: 'boolean' },
                    type: { type: 'string', enum: ['default', 'compact', 'horizontal'] },
                    position: { type: 'string', enum: ['left', 'right', 'top'] }
                  }
                }
              }
            }
          },
          required: ['success']
        },
        400: validationErrorResponseSchema,
        401: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, controller.updateUserPreferences.bind(controller));

  // Upload user avatar
  fastify.post('/users/avatar', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Upload user avatar',
      tags: ['User Profile'],
      security: [{ bearerAuth: [] }],
      consumes: ['multipart/form-data'],
      response: {
        200: avatarUploadResponseSchema,
        400: errorResponseSchema,
        401: errorResponseSchema,
        413: errorResponseSchema,
        415: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, controller.uploadUserAvatar.bind(controller));

  // Delete user avatar
  fastify.delete('/users/avatar', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Delete user avatar',
      tags: ['User Profile'],
      security: [{ bearerAuth: [] }],
      response: {
        200: avatarDeleteResponseSchema,
        401: errorResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, controller.deleteUserAvatar.bind(controller));
}