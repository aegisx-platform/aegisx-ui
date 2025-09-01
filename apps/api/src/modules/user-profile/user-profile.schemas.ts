// Fastify JSON Schema definitions for user profile module

export const userProfileResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        avatar: { type: 'string', format: 'uri', nullable: true },
        role: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            permissions: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['id', 'name']
        },
        preferences: {
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
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
        status: { type: 'string', enum: ['active', 'inactive', 'suspended', 'pending'] },
        emailVerified: { type: 'boolean' },
        twoFactorEnabled: { type: 'boolean' }
      },
      required: ['id', 'email', 'name', 'role', 'status']
    },
    meta: {
      type: 'object',
      properties: {
        timestamp: { type: 'string', format: 'date-time' },
        version: { type: 'string' },
        requestId: { type: 'string' }
      }
    }
  },
  required: ['success']
} as const;

export const userProfileUpdateRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    firstName: { type: 'string', minLength: 1, maxLength: 50 },
    lastName: { type: 'string', minLength: 1, maxLength: 50 },
    preferences: {
      type: 'object',
      properties: {
        theme: { type: 'string', enum: ['default', 'dark', 'light', 'auto'] },
        scheme: { type: 'string', enum: ['light', 'dark', 'auto'] },
        layout: { type: 'string', enum: ['classic', 'compact', 'enterprise', 'empty'] },
        language: { type: 'string', pattern: '^[a-z]{2}$' },
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
          },
          additionalProperties: false
        },
        navigation: {
          type: 'object',
          properties: {
            collapsed: { type: 'boolean' },
            type: { type: 'string', enum: ['default', 'compact', 'horizontal'] },
            position: { type: 'string', enum: ['left', 'right', 'top'] }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
} as const;

export const userPreferencesUpdateRequestSchema = {
  type: 'object',
  properties: {
    theme: { type: 'string', enum: ['default', 'dark', 'light', 'auto'] },
    scheme: { type: 'string', enum: ['light', 'dark', 'auto'] },
    layout: { type: 'string', enum: ['classic', 'compact', 'enterprise', 'empty'] },
    language: { type: 'string', pattern: '^[a-z]{2}$' },
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
      },
      additionalProperties: false
    },
    navigation: {
      type: 'object',
      properties: {
        collapsed: { type: 'boolean' },
        type: { type: 'string', enum: ['default', 'compact', 'horizontal'] },
        position: { type: 'string', enum: ['left', 'right', 'top'] }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
} as const;

export const avatarUploadResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'uri' },
        thumbnails: {
          type: 'object',
          properties: {
            small: { type: 'string', format: 'uri' },
            medium: { type: 'string', format: 'uri' },
            large: { type: 'string', format: 'uri' }
          },
          required: ['small', 'medium', 'large']
        }
      },
      required: ['avatar', 'thumbnails']
    }
  },
  required: ['success', 'data']
} as const;

export const avatarDeleteResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      required: ['message']
    }
  },
  required: ['success', 'data']
} as const;

export const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        message: { type: 'string' },
        details: { type: 'object' },
        field: { type: 'string' }
      },
      required: ['code', 'message']
    }
  },
  required: ['success', 'error']
} as const;

export const validationErrorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        message: { type: 'string' },
        details: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string' },
              message: { type: 'string' },
              code: { type: 'string' }
            },
            required: ['field', 'message', 'code']
          }
        }
      },
      required: ['code', 'message']
    }
  },
  required: ['success', 'error']
} as const;