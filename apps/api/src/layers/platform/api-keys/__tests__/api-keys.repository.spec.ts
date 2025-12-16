import { ApiKeysRepository } from '../api-keys.repository';
import { ApiKeyResponse } from '../api-keys.schemas';

// Mock Knex chain
const mockKnexChain = {
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  increment: jest.fn().mockReturnThis(),
  first: jest.fn(),
};

// Mock Knex function
const mockKnex = jest.fn().mockReturnValue(mockKnexChain) as any;
mockKnex.fn = {
  now: jest.fn().mockReturnValue('mocked_now'),
};

describe('ApiKeysRepository', () => {
  let repository: ApiKeysRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new ApiKeysRepository(mockKnex as any);
  });

  describe('create', () => {
    it('should create API key and return mapped response', async () => {
      const keyData = {
        userId: 'user-1',
        name: 'Test Key',
        keyHash: 'hashed_key',
        keyPrefix: 'pk_test',
        permissions: ['api:read', 'api:write'],
        expiresAt: new Date('2025-01-01'),
      };

      const mockDbResult = {
        id: 'key-1',
        user_id: 'user-1',
        name: 'Test Key',
        key_prefix: 'pk_test',
        permissions: '["api:read","api:write"]',
        last_used_at: null,
        usage_count: 0,
        expires_at: new Date('2025-01-01'),
        revoked: false,
        revoked_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockKnexChain.returning.mockResolvedValue([mockDbResult]);

      const result = await repository.create(keyData);

      expect(mockKnex).toHaveBeenCalledWith('api_keys');
      expect(mockKnexChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-1',
          name: 'Test Key',
          key_hash: 'hashed_key',
          key_prefix: 'pk_test',
          permissions: JSON.stringify(keyData.permissions),
        }),
      );
      expect(result).toHaveProperty('id', 'key-1');
      expect(result).toHaveProperty('userId', 'user-1');
      expect(result).toHaveProperty('keyPrefix', 'pk_test');
      expect(result.permissions).toEqual(['api:read', 'api:write']);
    });
  });

  describe('findByUserId', () => {
    it('should return active API keys for user', async () => {
      const mockDbResults = [
        {
          id: 'key-1',
          user_id: 'user-1',
          name: 'Key 1',
          key_prefix: 'pk_test',
          permissions: '["api:read"]',
          last_used_at: null,
          usage_count: 0,
          expires_at: null,
          revoked: false,
          revoked_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockKnexChain.orderBy.mockResolvedValue(mockDbResults);

      const result = await repository.findByUserId('user-1');

      expect(mockKnex).toHaveBeenCalledWith('api_keys');
      expect(mockKnexChain.where).toHaveBeenCalledWith('user_id', 'user-1');
      expect(mockKnexChain.where).toHaveBeenCalledWith('revoked', false);
      expect(mockKnexChain.orderBy).toHaveBeenCalledWith('created_at', 'desc');
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 'key-1');
    });

    it('should return empty array if no keys found', async () => {
      mockKnexChain.orderBy.mockResolvedValue([]);

      const result = await repository.findByUserId('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return API key by ID', async () => {
      const mockDbResult = {
        id: 'key-1',
        user_id: 'user-1',
        name: 'Test Key',
        key_prefix: 'pk_test',
        permissions: '["api:read"]',
        last_used_at: null,
        usage_count: 0,
        expires_at: null,
        revoked: false,
        revoked_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockKnexChain.first.mockResolvedValue(mockDbResult);

      const result = await repository.findById('key-1');

      expect(mockKnex).toHaveBeenCalledWith('api_keys');
      expect(mockKnexChain.where).toHaveBeenCalledWith('id', 'key-1');
      expect(result).toHaveProperty('id', 'key-1');
      expect(result).toHaveProperty('name', 'Test Key');
    });

    it('should return null if key not found', async () => {
      mockKnexChain.first.mockResolvedValue(null);

      const result = await repository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findByKeyPrefix', () => {
    it('should return API key with hash by prefix', async () => {
      const mockDbResult = {
        id: 'key-1',
        user_id: 'user-1',
        name: 'Test Key',
        key_hash: 'hashed_key',
        key_prefix: 'pk_test',
        permissions: '["api:read"]',
        last_used_at: null,
        usage_count: 0,
        expires_at: null,
        revoked: false,
        revoked_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockKnexChain.first.mockResolvedValue(mockDbResult);

      const result = await repository.findByKeyPrefix('pk_test');

      expect(mockKnex).toHaveBeenCalledWith('api_keys');
      expect(mockKnexChain.where).toHaveBeenCalledWith('key_prefix', 'pk_test');
      expect(result).toHaveProperty('keyHash', 'hashed_key');
      expect(result).toHaveProperty('id', 'key-1');
    });

    it('should return null if key not found', async () => {
      mockKnexChain.first.mockResolvedValue(null);

      const result = await repository.findByKeyPrefix('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findByKeyHash', () => {
    it('should return API key with hash by exact hash match', async () => {
      const mockDbResult = {
        id: 'key-1',
        user_id: 'user-1',
        name: 'Test Key',
        key_hash: 'exact_hash',
        key_prefix: 'pk_test',
        permissions: '["api:read"]',
        last_used_at: null,
        usage_count: 0,
        expires_at: null,
        revoked: false,
        revoked_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockKnexChain.first.mockResolvedValue(mockDbResult);

      const result = await repository.findByKeyHash('exact_hash');

      expect(mockKnex).toHaveBeenCalledWith('api_keys');
      expect(mockKnexChain.where).toHaveBeenCalledWith(
        'key_hash',
        'exact_hash',
      );
      expect(result).toHaveProperty('keyHash', 'exact_hash');
    });

    it('should return null if no matching hash found', async () => {
      mockKnexChain.first.mockResolvedValue(null);

      const result = await repository.findByKeyHash('nonexistent_hash');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update API key name and permissions', async () => {
      const updatedData = {
        name: 'Updated Key',
        permissions: ['api:read', 'api:write', 'api:delete'],
      };

      const mockDbResult = {
        id: 'key-1',
        user_id: 'user-1',
        name: 'Updated Key',
        key_prefix: 'pk_test',
        permissions: '["api:read","api:write","api:delete"]',
        last_used_at: null,
        usage_count: 0,
        expires_at: null,
        revoked: false,
        revoked_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockKnexChain.returning.mockResolvedValue([mockDbResult]);

      const result = await repository.update('key-1', updatedData);

      expect(mockKnex).toHaveBeenCalledWith('api_keys');
      expect(mockKnexChain.where).toHaveBeenCalledWith('id', 'key-1');
      expect(mockKnexChain.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Key',
          permissions: JSON.stringify(updatedData.permissions),
        }),
      );
      expect(result).toHaveProperty('name', 'Updated Key');
      expect(result?.permissions).toEqual([
        'api:read',
        'api:write',
        'api:delete',
      ]);
    });

    it('should return null if key not found', async () => {
      mockKnexChain.returning.mockResolvedValue([]);

      const result = await repository.update('nonexistent', {
        name: 'New Name',
      });

      expect(result).toBeNull();
    });
  });

  describe('revoke', () => {
    it('should revoke API key', async () => {
      mockKnexChain.update.mockResolvedValue(1);

      const result = await repository.revoke('key-1');

      expect(mockKnex).toHaveBeenCalledWith('api_keys');
      expect(mockKnexChain.where).toHaveBeenCalledWith('id', 'key-1');
      expect(mockKnexChain.update).toHaveBeenCalledWith(
        expect.objectContaining({
          revoked: true,
        }),
      );
      expect(result).toBe(true);
    });

    it('should return false if key not found', async () => {
      mockKnexChain.update.mockResolvedValue(0);

      const result = await repository.revoke('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('incrementUsage', () => {
    it('should increment usage count and update last_used_at', async () => {
      mockKnexChain.update.mockResolvedValue(1);

      const result = await repository.incrementUsage('key-1');

      expect(mockKnex).toHaveBeenCalledWith('api_keys');
      expect(mockKnexChain.where).toHaveBeenCalledWith('id', 'key-1');
      expect(mockKnexChain.increment).toHaveBeenCalledWith('usage_count', 1);
      expect(result).toBe(true);
    });

    it('should return false if key not found', async () => {
      mockKnexChain.update.mockResolvedValue(0);

      const result = await repository.incrementUsage('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('deleteExpired', () => {
    it('should delete expired API keys', async () => {
      mockKnexChain.delete.mockResolvedValue(5);

      const result = await repository.deleteExpired();

      expect(mockKnex).toHaveBeenCalledWith('api_keys');
      expect(mockKnexChain.where).toHaveBeenCalledWith(
        'expires_at',
        '<',
        'mocked_now',
      );
      expect(mockKnexChain.delete).toHaveBeenCalled();
      expect(result).toBe(5);
    });

    it('should return 0 if no expired keys', async () => {
      mockKnexChain.delete.mockResolvedValue(0);

      const result = await repository.deleteExpired();

      expect(result).toBe(0);
    });
  });

  describe('mapToApiKeyResponse', () => {
    it('should correctly map snake_case to camelCase', async () => {
      const mockDbResult = {
        id: 'key-1',
        user_id: 'user-1',
        name: 'Test Key',
        key_prefix: 'pk_test',
        permissions: JSON.stringify(['api:read']),
        last_used_at: new Date('2024-01-01'),
        usage_count: 10,
        expires_at: new Date('2025-01-01'),
        revoked: false,
        revoked_at: null,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
      };

      mockKnexChain.first.mockResolvedValue(mockDbResult);

      const result = await repository.findById('key-1');

      expect(result).toHaveProperty('userId', 'user-1');
      expect(result).toHaveProperty('keyPrefix', 'pk_test');
      expect(result).toHaveProperty('lastUsedAt');
      expect(result).toHaveProperty('usageCount', 10);
      expect(result).toHaveProperty('expiresAt');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should handle permissions as array', async () => {
      const mockDbResult = {
        id: 'key-1',
        user_id: 'user-1',
        name: 'Test Key',
        key_prefix: 'pk_test',
        permissions: ['api:read', 'api:write'], // Already an array
        last_used_at: null,
        usage_count: 0,
        expires_at: null,
        revoked: false,
        revoked_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockKnexChain.first.mockResolvedValue(mockDbResult);

      const result = await repository.findById('key-1');

      expect(result?.permissions).toEqual(['api:read', 'api:write']);
    });

    it('should handle null optional fields', async () => {
      const mockDbResult = {
        id: 'key-1',
        user_id: 'user-1',
        name: 'Test Key',
        key_prefix: 'pk_test',
        permissions: '[]',
        last_used_at: null,
        usage_count: 0,
        expires_at: null,
        revoked: false,
        revoked_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockKnexChain.first.mockResolvedValue(mockDbResult);

      const result = await repository.findById('key-1');

      expect(result).toHaveProperty('lastUsedAt', undefined);
      expect(result).toHaveProperty('expiresAt', undefined);
      expect(result).toHaveProperty('revokedAt', undefined);
    });
  });
});
