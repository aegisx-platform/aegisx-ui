import { ActivityLogsService } from '../activity-logs.service';
import { ActivityLogsRepository } from '../activity-logs.repository';
import { ActivityLog, ActivityStats } from '../activity-logs.schemas';

// Mock Redis
const mockRedis = {
  get: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
};

// Mock Knex
const mockKnex = jest.fn() as any;

// Mock ActivityLogsRepository
jest.mock('../activity-logs.repository');

const mockRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  getStats: jest.fn(),
  getStatsByAction: jest.fn(),
  getStatsBySeverity: jest.fn(),
  findByAction: jest.fn(),
  findByResourceId: jest.fn(),
  cleanup: jest.fn(),
};

describe('ActivityLogsService', () => {
  let service: ActivityLogsService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the ActivityLogsRepository constructor
    (
      ActivityLogsRepository as jest.MockedClass<typeof ActivityLogsRepository>
    ).mockImplementation(() => mockRepository as any);

    service = new ActivityLogsService(mockKnex, mockRedis as any);
    service['repository'] = mockRepository as any;
  });

  describe('getStats', () => {
    const mockStats: any = {
      total: 200,
      recent24h: 20,
      byAction: {
        create: 50,
        read: 30,
        update: 20,
        delete: 10,
        login: 40,
        logout: 30,
        export: 10,
        import: 10,
      },
      bySeverity: { info: 100, warning: 50, error: 30, critical: 20 },
      topResources: [],
      topUsers: [],
      trend: [],
    };

    it('should return stats from cache if available', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify(mockStats));

      const result = await service.getStats(7);

      expect(mockRedis.get).toHaveBeenCalledWith('activity-logs:stats:7');
      expect(mockRepository.getStats).not.toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });

    it('should fetch stats from database and cache them on cache miss', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockRepository.getStats.mockResolvedValue(mockStats);

      const result = await service.getStats(7);

      expect(mockRedis.get).toHaveBeenCalledWith('activity-logs:stats:7');
      expect(mockRepository.getStats).toHaveBeenCalledWith(7);
      expect(mockRedis.setex).toHaveBeenCalledWith(
        'activity-logs:stats:7',
        300,
        JSON.stringify(mockStats),
      );
      expect(result).toEqual(mockStats);
    });

    it('should fetch from database when Redis is not available', async () => {
      const serviceWithoutRedis = new ActivityLogsService(mockKnex, null);
      serviceWithoutRedis['repository'] = mockRepository as any;
      mockRepository.getStats.mockResolvedValue(mockStats);

      const result = await serviceWithoutRedis.getStats(7);

      expect(mockRepository.getStats).toHaveBeenCalledWith(7);
      expect(result).toEqual(mockStats);
    });
  });

  describe('invalidateStatsCache', () => {
    it('should invalidate all stats cache keys', async () => {
      mockRedis.keys.mockResolvedValue([
        'activity-logs:stats:7',
        'activity-logs:stats:30',
      ]);

      await service.invalidateStatsCache();

      expect(mockRedis.keys).toHaveBeenCalledWith('activity-logs:stats:*');
      expect(mockRedis.del).toHaveBeenCalledWith(
        'activity-logs:stats:7',
        'activity-logs:stats:30',
      );
    });

    it('should not call del if no cache keys found', async () => {
      mockRedis.keys.mockResolvedValue([]);

      await service.invalidateStatsCache();

      expect(mockRedis.keys).toHaveBeenCalledWith('activity-logs:stats:*');
      expect(mockRedis.del).not.toHaveBeenCalled();
    });

    it('should do nothing when Redis is not available', async () => {
      const serviceWithoutRedis = new ActivityLogsService(mockKnex, null);

      await serviceWithoutRedis.invalidateStatsCache();

      // Should not throw error
      expect(true).toBe(true);
    });
  });

  describe('create', () => {
    it('should create activity log and invalidate cache', async () => {
      const newLog: Partial<ActivityLog> = {
        action: 'create',
        description: 'Created user',
        userId: 'user-1',
        severity: 'info',
      };

      mockRepository.create.mockResolvedValue('new-id');
      mockRedis.keys.mockResolvedValue(['activity-logs:stats:7']);

      const result = await service.create(newLog);

      expect(mockRepository.create).toHaveBeenCalledWith(newLog);
      expect(mockRedis.keys).toHaveBeenCalledWith('activity-logs:stats:*');
      expect(mockRedis.del).toHaveBeenCalled();
      expect(result).toBe('new-id');
    });

    it('should throw error if action is missing', async () => {
      const invalidLog: Partial<ActivityLog> = {
        description: 'Test activity',
        userId: 'user-1',
        severity: 'info',
      };

      await expect(service.create(invalidLog)).rejects.toThrow(
        'ACTIVITY_ACTION_REQUIRED',
      );
    });

    it('should throw error if description is missing', async () => {
      const invalidLog: Partial<ActivityLog> = {
        action: 'create',
        userId: 'user-1',
        severity: 'info',
      };

      await expect(service.create(invalidLog)).rejects.toThrow(
        'ACTIVITY_DESCRIPTION_REQUIRED',
      );
    });

    it('should throw error if userId is missing', async () => {
      const invalidLog: Partial<ActivityLog> = {
        action: 'create',
        description: 'Test activity',
        severity: 'info',
      };

      await expect(service.create(invalidLog)).rejects.toThrow(
        'ACTIVITY_USER_ID_REQUIRED',
      );
    });

    it('should throw error if severity is missing', async () => {
      const invalidLog: Partial<ActivityLog> = {
        action: 'create',
        description: 'Test activity',
        userId: 'user-1',
      };

      await expect(service.create(invalidLog)).rejects.toThrow(
        'ACTIVITY_SEVERITY_REQUIRED',
      );
    });

    it('should throw error for invalid action', async () => {
      const invalidLog: Partial<ActivityLog> = {
        action: 'invalid' as any,
        description: 'Test activity',
        userId: 'user-1',
        severity: 'info',
      };

      await expect(service.create(invalidLog)).rejects.toThrow(
        'ACTIVITY_INVALID_ACTION',
      );
    });

    it('should throw error for invalid severity', async () => {
      const invalidLog: Partial<ActivityLog> = {
        action: 'create',
        description: 'Test activity',
        userId: 'user-1',
        severity: 'invalid' as any,
      };

      await expect(service.create(invalidLog)).rejects.toThrow(
        'ACTIVITY_INVALID_SEVERITY',
      );
    });

    it('should throw error if description is too long', async () => {
      const longDescription = 'a'.repeat(5001);
      const invalidLog: Partial<ActivityLog> = {
        action: 'create',
        description: longDescription,
        userId: 'user-1',
        severity: 'info',
      };

      await expect(service.create(invalidLog)).rejects.toThrow(
        'ACTIVITY_DESCRIPTION_TOO_LONG',
      );
    });
  });

  describe('getStatsByAction', () => {
    it('should return statistics grouped by action', async () => {
      const mockActionStats = {
        create: 50,
        read: 30,
        update: 20,
        delete: 10,
        login: 40,
        logout: 30,
        export: 10,
        import: 10,
      };

      mockRepository.getStatsByAction.mockResolvedValue(mockActionStats);

      const result = await service.getStatsByAction();

      expect(mockRepository.getStatsByAction).toHaveBeenCalled();
      expect(result).toEqual(mockActionStats);
    });
  });

  describe('getStatsBySeverity', () => {
    it('should return statistics grouped by severity', async () => {
      const mockSeverityStats = {
        info: 100,
        warning: 50,
        error: 30,
        critical: 20,
      };

      mockRepository.getStatsBySeverity.mockResolvedValue(mockSeverityStats);

      const result = await service.getStatsBySeverity();

      expect(mockRepository.getStatsBySeverity).toHaveBeenCalled();
      expect(result).toEqual(mockSeverityStats);
    });
  });

  describe('findByAction', () => {
    it('should return activity logs by action type', async () => {
      const mockLogs = [
        {
          id: '1',
          action: 'create',
          description: 'Created user',
        },
      ] as ActivityLog[];

      mockRepository.findByAction.mockResolvedValue(mockLogs);

      const result = await service.findByAction('create');

      expect(mockRepository.findByAction).toHaveBeenCalledWith('create');
      expect(result).toEqual(mockLogs);
    });
  });

  describe('findByResourceId', () => {
    it('should return activity logs by resource ID', async () => {
      const mockLogs = [
        {
          id: '1',
          resourceId: 'res-123',
          description: 'Updated resource',
        },
      ] as ActivityLog[];

      mockRepository.findByResourceId.mockResolvedValue(mockLogs);

      const result = await service.findByResourceId('res-123');

      expect(mockRepository.findByResourceId).toHaveBeenCalledWith('res-123');
      expect(result).toEqual(mockLogs);
    });
  });

  describe('getExportHeaders', () => {
    it('should return CSV export headers', () => {
      const headers = service['getExportHeaders']();

      expect(headers).toContain('ID');
      expect(headers).toContain('Timestamp');
      expect(headers).toContain('Action');
      expect(headers).toContain('Description');
      expect(headers).toContain('Severity');
    });
  });

  describe('getExportRow', () => {
    it('should convert activity log to CSV row', () => {
      const mockLog: any = {
        id: '1',
        timestamp: '2024-01-01T00:00:00Z',
        action: 'create',
        description: 'Created user',
        resourceType: 'user',
        resourceId: 'user-123',
        severity: 'info',
        userId: 'user-1',
        sessionId: 'sess-1',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        serverTimestamp: '2024-01-01T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        metadata: null,
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const row = service['getExportRow'](mockLog);

      expect(row[0]).toBe('1'); // ID
      expect(row[2]).toBe('create'); // Action
      expect(row[6]).toBe('info'); // Severity
    });
  });
});
