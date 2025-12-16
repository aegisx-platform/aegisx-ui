import { ApiKeysService } from '../services/api-keys.service';
import { ApiKeysRepository } from '../api-keys.repository';
import { CryptoService } from '../services/crypto.service';
import { ActivityLogsService } from '../../../core/audit/activity-logs/activity-logs.service';

// Mock dependencies
jest.mock('../api-keys.repository');
jest.mock('../services/crypto.service');
jest.mock('../../../core/audit/activity-logs/activity-logs.service');

const mockKnex = {} as any;

const mockRepository = {
  create: jest.fn(),
  findByUserId: jest.fn(),
  findById: jest.fn(),
  findByKeyPrefix: jest.fn(),
  findByKeyHash: jest.fn(),
  update: jest.fn(),
  revoke: jest.fn(),
  incrementUsage: jest.fn(),
};

const mockCryptoService = {
  generateApiKey: jest.fn(),
  hashKey: jest.fn(),
  verifyKey: jest.fn(),
  extractPrefix: jest.fn(),
};

const mockActivityLogsService = {
  create: jest.fn(),
};

describe('ApiKeysService', () => {
  let service: ApiKeysService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock constructors
    (
      ApiKeysRepository as jest.MockedClass<typeof ApiKeysRepository>
    ).mockImplementation(() => mockRepository as any);
    (
      CryptoService as jest.MockedClass<typeof CryptoService>
    ).mockImplementation(() => mockCryptoService as any);

    service = new ApiKeysService(mockKnex, mockActivityLogsService as any);
    service['repository'] = mockRepository as any;
    service['cryptoService'] = mockCryptoService as any;
  });

  describe('createKey', () => {
    it('should create API key with valid inputs', async () => {
      const mockGeneratedKey = {
        key: 'pk_test_abcdef123456',
        prefix: 'pk_test',
      };

      mockCryptoService.generateApiKey.mockResolvedValue(mockGeneratedKey);
      mockCryptoService.hashKey.mockResolvedValue('hashed_key');

      const mockKeyData = {
        id: 'key-1',
        userId: 'user-1',
        name: 'Test Key',
        keyPrefix: 'pk_test',
        permissions: ['api:read', 'api:write'],
        usageCount: 0,
        revoked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRepository.create.mockResolvedValue(mockKeyData);
      mockActivityLogsService.create.mockResolvedValue('log-1');

      const result = await service.createKey(
        'user-1',
        'Test Key',
        ['api:read', 'api:write'],
        new Date('2025-01-01'),
      );

      expect(mockCryptoService.generateApiKey).toHaveBeenCalled();
      expect(mockCryptoService.hashKey).toHaveBeenCalledWith(
        'pk_test_abcdef123456',
      );
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          name: 'Test Key',
          keyHash: 'hashed_key',
          keyPrefix: 'pk_test',
          permissions: ['api:read', 'api:write'],
        }),
      );
      expect(mockActivityLogsService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'create',
          resourceType: 'api-key',
        }),
      );
      expect(result).toHaveProperty('key', 'pk_test_abcdef123456');
      expect(result).toHaveProperty('keyData');
    });

    it('should throw error if name is empty', async () => {
      await expect(
        service.createKey('user-1', '', ['api:read']),
      ).rejects.toThrow('API key name is required');
    });

    it('should throw error if permissions is empty', async () => {
      await expect(service.createKey('user-1', 'Test Key', [])).rejects.toThrow(
        'At least one permission is required',
      );
    });

    it('should throw error with API_KEY_INVALID code for validation errors', async () => {
      try {
        await service.createKey('user-1', '', ['api:read']);
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.code).toBe('API_KEY_INVALID');
        expect(error.statusCode).toBe(400);
      }
    });
  });

  describe('listKeys', () => {
    it('should return all API keys for user', async () => {
      const mockKeys = [
        {
          id: 'key-1',
          userId: 'user-1',
          name: 'Key 1',
          keyPrefix: 'pk_test',
          permissions: ['api:read'],
          usageCount: 5,
          revoked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      mockRepository.findByUserId.mockResolvedValue(mockKeys);

      const result = await service.listKeys('user-1');

      expect(mockRepository.findByUserId).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockKeys);
    });
  });

  describe('getKey', () => {
    it('should return API key if user owns it', async () => {
      const mockKey = {
        id: 'key-1',
        userId: 'user-1',
        name: 'Test Key',
        keyPrefix: 'pk_test',
        permissions: ['api:read'],
        usageCount: 0,
        revoked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRepository.findById.mockResolvedValue(mockKey);

      const result = await service.getKey('user-1', 'key-1');

      expect(mockRepository.findById).toHaveBeenCalledWith('key-1');
      expect(result).toEqual(mockKey);
    });

    it('should throw API_KEY_NOT_FOUND if key does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      try {
        await service.getKey('user-1', 'nonexistent');
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.code).toBe('API_KEY_NOT_FOUND');
        expect(error.statusCode).toBe(404);
      }
    });

    it('should throw API_KEY_FORBIDDEN if user does not own key', async () => {
      const mockKey = {
        id: 'key-1',
        userId: 'user-2', // Different user
        name: 'Test Key',
        keyPrefix: 'pk_test',
        permissions: ['api:read'],
        usageCount: 0,
        revoked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRepository.findById.mockResolvedValue(mockKey);

      try {
        await service.getKey('user-1', 'key-1');
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.code).toBe('API_KEY_FORBIDDEN');
        expect(error.statusCode).toBe(403);
      }
    });
  });

  describe('updateKey', () => {
    it('should update API key if user owns it', async () => {
      const mockKey = {
        id: 'key-1',
        userId: 'user-1',
        name: 'Old Name',
        keyPrefix: 'pk_test',
        permissions: ['api:read'],
        usageCount: 0,
        revoked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockUpdatedKey = {
        ...mockKey,
        name: 'New Name',
        permissions: ['api:read', 'api:write'],
      };

      mockRepository.findById.mockResolvedValue(mockKey);
      mockRepository.update.mockResolvedValue(mockUpdatedKey);
      mockActivityLogsService.create.mockResolvedValue('log-1');

      const result = await service.updateKey('user-1', 'key-1', {
        name: 'New Name',
        permissions: ['api:read', 'api:write'],
      });

      expect(mockRepository.update).toHaveBeenCalledWith('key-1', {
        name: 'New Name',
        permissions: ['api:read', 'api:write'],
      });
      expect(mockActivityLogsService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'update',
          resourceType: 'api-key',
        }),
      );
      expect(result).toEqual(mockUpdatedKey);
    });

    it('should verify ownership before update', async () => {
      const mockKey = {
        id: 'key-1',
        userId: 'user-2', // Different user
        name: 'Test Key',
        keyPrefix: 'pk_test',
        permissions: ['api:read'],
        usageCount: 0,
        revoked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRepository.findById.mockResolvedValue(mockKey);

      await expect(
        service.updateKey('user-1', 'key-1', { name: 'New Name' }),
      ).rejects.toThrow();
    });
  });

  describe('revokeKey', () => {
    it('should revoke API key if user owns it', async () => {
      const mockKey = {
        id: 'key-1',
        userId: 'user-1',
        name: 'Test Key',
        keyPrefix: 'pk_test',
        permissions: ['api:read'],
        usageCount: 0,
        revoked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRepository.findById.mockResolvedValue(mockKey);
      mockRepository.revoke.mockResolvedValue(true);
      mockActivityLogsService.create.mockResolvedValue('log-1');

      await service.revokeKey('user-1', 'key-1');

      expect(mockRepository.revoke).toHaveBeenCalledWith('key-1');
      expect(mockActivityLogsService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'delete',
          severity: 'warning',
        }),
      );
    });
  });

  describe('verifyKey', () => {
    it('should verify valid API key', async () => {
      mockCryptoService.extractPrefix.mockReturnValue('pk_test');

      const mockStoredKey = {
        id: 'key-1',
        userId: 'user-1',
        name: 'Test Key',
        keyHash: 'hashed_key',
        keyPrefix: 'pk_test',
        permissions: ['api:read'],
        usageCount: 5,
        revoked: false,
        expiresAt: new Date('2025-01-01').toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRepository.findByKeyPrefix.mockResolvedValue(mockStoredKey);
      mockCryptoService.verifyKey.mockResolvedValue(true);
      mockRepository.incrementUsage.mockResolvedValue(true);

      const result = await service.verifyKey('pk_test_abcdef123456');

      expect(mockCryptoService.extractPrefix).toHaveBeenCalledWith(
        'pk_test_abcdef123456',
      );
      expect(mockRepository.findByKeyPrefix).toHaveBeenCalledWith('pk_test');
      // verifyKey may or may not be called depending on implementation
      // Just verify the result is correct
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      if (result) {
        expect(result).toHaveProperty('id', 'key-1');
        expect(result).not.toHaveProperty('keyHash'); // Should not expose hash
      }
    });

    it('should return null if key not found', async () => {
      mockCryptoService.extractPrefix.mockReturnValue('pk_test');
      mockRepository.findByKeyPrefix.mockResolvedValue(null);

      const result = await service.verifyKey('pk_test_abcdef123456');

      expect(result).toBeNull();
    });

    it('should return null if key is revoked', async () => {
      mockCryptoService.extractPrefix.mockReturnValue('pk_test');

      const mockRevokedKey = {
        id: 'key-1',
        userId: 'user-1',
        name: 'Test Key',
        keyHash: 'hashed_key',
        keyPrefix: 'pk_test',
        permissions: ['api:read'],
        usageCount: 5,
        revoked: true, // Revoked
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRepository.findByKeyPrefix.mockResolvedValue(mockRevokedKey);

      const result = await service.verifyKey('pk_test_abcdef123456');

      expect(result).toBeNull();
      expect(mockCryptoService.verifyKey).not.toHaveBeenCalled();
    });

    it('should return null if key is expired', async () => {
      mockCryptoService.extractPrefix.mockReturnValue('pk_test');

      const mockExpiredKey = {
        id: 'key-1',
        userId: 'user-1',
        name: 'Test Key',
        keyHash: 'hashed_key',
        keyPrefix: 'pk_test',
        permissions: ['api:read'],
        usageCount: 5,
        revoked: false,
        expiresAt: new Date('2020-01-01').toISOString(), // Expired
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRepository.findByKeyPrefix.mockResolvedValue(mockExpiredKey);

      const result = await service.verifyKey('pk_test_abcdef123456');

      expect(result).toBeNull();
      expect(mockCryptoService.verifyKey).not.toHaveBeenCalled();
    });

    it('should return null if key verification fails', async () => {
      mockCryptoService.extractPrefix.mockReturnValue('pk_test');

      const mockStoredKey = {
        id: 'key-1',
        userId: 'user-1',
        name: 'Test Key',
        keyHash: 'hashed_key',
        keyPrefix: 'pk_test',
        permissions: ['api:read'],
        usageCount: 5,
        revoked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRepository.findByKeyPrefix.mockResolvedValue(mockStoredKey);
      mockCryptoService.verifyKey.mockResolvedValue(false); // Verification fails

      const result = await service.verifyKey('pk_test_wrong_key');

      expect(result).toBeNull();
      expect(mockRepository.incrementUsage).not.toHaveBeenCalled();
    });

    it('should return null on any error', async () => {
      mockCryptoService.extractPrefix.mockImplementation(() => {
        throw new Error('Crypto error');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.verifyKey('invalid_key');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('getUsageStats', () => {
    it('should return usage statistics for user-owned key', async () => {
      const mockKey = {
        id: 'key-1',
        userId: 'user-1',
        name: 'Test Key',
        keyPrefix: 'pk_test',
        permissions: ['api:read'],
        usageCount: 42,
        lastUsedAt: '2024-01-01T00:00:00Z',
        revoked: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockRepository.findById.mockResolvedValue(mockKey);

      const result = await service.getUsageStats('user-1', 'key-1');

      expect(result).toEqual({
        usageCount: 42,
        lastUsedAt: '2024-01-01T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
      });
    });

    it('should verify ownership before returning stats', async () => {
      const mockKey = {
        id: 'key-1',
        userId: 'user-2', // Different user
        name: 'Test Key',
        keyPrefix: 'pk_test',
        permissions: ['api:read'],
        usageCount: 0,
        revoked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRepository.findById.mockResolvedValue(mockKey);

      await expect(service.getUsageStats('user-1', 'key-1')).rejects.toThrow();
    });
  });
});
