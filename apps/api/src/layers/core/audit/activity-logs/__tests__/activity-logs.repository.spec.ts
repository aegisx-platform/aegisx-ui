import { ActivityLogsRepository } from '../activity-logs.repository';
import { ActivityQuery } from '../activity-logs.schemas';

// Mock Knex chain
const mockKnexChain = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  whereRaw: jest.fn().mockReturnThis(),
  whereBetween: jest.fn().mockReturnThis(),
  whereIn: jest.fn().mockReturnThis(),
  whereNotNull: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  count: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  first: jest.fn(),
  then: jest.fn(),
  increment: jest.fn().mockReturnThis(),
  clone: jest.fn().mockReturnThis(),
};

// Mock Knex function
const mockKnex = jest.fn().mockReturnValue(mockKnexChain) as any;
mockKnex.raw = jest.fn().mockReturnValue('mocked_raw');
mockKnex.fn = {
  now: jest.fn().mockReturnValue('mocked_now'),
};

describe('ActivityLogsRepository', () => {
  let repository: ActivityLogsRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new ActivityLogsRepository(mockKnex as any);
  });

  describe('findAll', () => {
    it('should return all activity logs with default pagination', async () => {
      const mockData = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          action: 'create',
          description: 'Created user',
          userId: 'user-1',
          severity: 'info',
          createdAt: new Date().toISOString(),
        },
      ];

      // Mock count query
      mockKnexChain.first.mockResolvedValue({ count: '1' });
      // Mock data query
      mockKnexChain.then = jest.fn((resolve) => resolve(mockData));

      const result = await repository.findAll({ limit: 10, page: 1 });

      expect(mockKnexChain.select).toHaveBeenCalled();
      expect(mockKnexChain.limit).toHaveBeenCalledWith(10);
      expect(mockKnexChain.offset).toHaveBeenCalledWith(0);
      // findAll returns paginated response object
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result.data).toEqual(mockData);
    });

    it('should filter by action', async () => {
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const query: ActivityQuery = { action: 'create', limit: 10, page: 1 };
      await repository.findAll(query);

      expect(mockKnexChain.where).toHaveBeenCalledWith('action', 'create');
    });

    it('should filter by severity', async () => {
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const query: ActivityQuery = { severity: 'warning', limit: 10, page: 1 };
      await repository.findAll(query);

      expect(mockKnexChain.where).toHaveBeenCalledWith('severity', 'warning');
    });

    it('should filter by resource type', async () => {
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const query: ActivityQuery = { resourceType: 'user', limit: 10, page: 1 };
      await repository.findAll(query);

      expect(mockKnexChain.where).toHaveBeenCalledWith('resource_type', 'user');
    });

    it('should filter by resource ID', async () => {
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const query: ActivityQuery = {
        resourceId: 'res-123',
        limit: 10,
        page: 1,
      };
      await repository.findAll(query);

      expect(mockKnexChain.where).toHaveBeenCalledWith(
        'resource_id',
        'res-123',
      );
    });

    it('should filter by user ID', async () => {
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const query: ActivityQuery = { userId: 'user-1', limit: 10, page: 1 };
      await repository.findAll(query);

      expect(mockKnexChain.where).toHaveBeenCalledWith('user_id', 'user-1');
    });

    it('should filter by date range', async () => {
      // Mock both the count query and the data query
      mockKnexChain.first.mockResolvedValue({ count: '0' });
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const query: ActivityQuery = { startDate, endDate, limit: 10, page: 1 };

      await repository.findAll(query);

      // Check that where clause was added for date filtering
      expect(mockKnexChain.where).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return activity log by ID', async () => {
      const mockLog = {
        id: '1',
        timestamp: new Date().toISOString(),
        action: 'create',
        description: 'Created user',
      };

      mockKnexChain.first = jest.fn().mockResolvedValue(mockLog);

      const result = await repository.findById('1');

      expect(mockKnexChain.where).toHaveBeenCalledWith('id', '1');
      expect(mockKnexChain.first).toHaveBeenCalled();
      expect(result).toEqual(mockLog);
    });

    it('should return null if activity log not found', async () => {
      mockKnexChain.first = jest.fn().mockResolvedValue(null);

      const result = await repository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create activity log and return ID', async () => {
      const newLog = {
        action: 'create' as const,
        description: 'Created user',
        userId: 'user-1',
        severity: 'info' as const,
      };

      mockKnexChain.returning = jest.fn().mockResolvedValue([{ id: 'new-id' }]);

      const result = await repository.create(newLog);

      expect(mockKnex).toHaveBeenCalledWith('user_activity_logs');
      expect(mockKnexChain.insert).toHaveBeenCalled();
      expect(mockKnexChain.returning).toHaveBeenCalledWith('id');
      expect(result).toBe('new-id');
    });
  });

  describe('delete', () => {
    it('should delete activity log by ID', async () => {
      mockKnexChain.delete = jest.fn().mockResolvedValue(1);

      await repository.delete('1');

      expect(mockKnex).toHaveBeenCalledWith('user_activity_logs');
      expect(mockKnexChain.where).toHaveBeenCalledWith('id', '1');
      expect(mockKnexChain.delete).toHaveBeenCalled();
    });
  });

  describe('getStatsByAction', () => {
    it('should return statistics grouped by action', async () => {
      const mockResults = [
        { action: 'create', count: '10' },
        { action: 'update', count: '5' },
        { action: 'delete', count: '2' },
      ];

      mockKnexChain.then = jest.fn((resolve) => resolve(mockResults));

      const result = await repository.getStatsByAction();

      expect(mockKnex).toHaveBeenCalledWith('user_activity_logs');
      expect(mockKnexChain.select).toHaveBeenCalledWith('action');
      expect(mockKnexChain.groupBy).toHaveBeenCalledWith('action');
      expect(result).toEqual({
        create: 10,
        update: 5,
        delete: 2,
        read: 0,
        login: 0,
        logout: 0,
        export: 0,
        import: 0,
      });
    });

    it('should return zero counts for actions with no data', async () => {
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const result = await repository.getStatsByAction();

      expect(result).toEqual({
        create: 0,
        read: 0,
        update: 0,
        delete: 0,
        login: 0,
        logout: 0,
        export: 0,
        import: 0,
      });
    });
  });

  describe('getStatsBySeverity', () => {
    it('should return statistics grouped by severity', async () => {
      const mockResults = [
        { severity: 'info', count: '15' },
        { severity: 'warning', count: '8' },
        { severity: 'error', count: '3' },
      ];

      mockKnexChain.then = jest.fn((resolve) => resolve(mockResults));

      const result = await repository.getStatsBySeverity();

      expect(mockKnex).toHaveBeenCalledWith('user_activity_logs');
      expect(mockKnexChain.select).toHaveBeenCalledWith('severity');
      expect(mockKnexChain.groupBy).toHaveBeenCalledWith('severity');
      expect(result).toEqual({
        info: 15,
        warning: 8,
        error: 3,
        critical: 0,
      });
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
        {
          id: '2',
          action: 'create',
          description: 'Created role',
        },
      ];

      mockKnexChain.then = jest.fn((resolve) => resolve(mockLogs));

      const result = await repository.findByAction('create');

      expect(mockKnex).toHaveBeenCalledWith('user_activity_logs');
      expect(mockKnexChain.where).toHaveBeenCalledWith('action', 'create');
      expect(mockKnexChain.orderBy).toHaveBeenCalledWith('timestamp', 'desc');
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
      ];

      mockKnexChain.then = jest.fn((resolve) => resolve(mockLogs));

      const result = await repository.findByResourceId('res-123');

      expect(mockKnex).toHaveBeenCalledWith('user_activity_logs');
      expect(mockKnexChain.where).toHaveBeenCalledWith(
        'resource_id',
        'res-123',
      );
      expect(mockKnexChain.orderBy).toHaveBeenCalledWith('timestamp', 'desc');
      expect(result).toEqual(mockLogs);
    });
  });

  describe('getStats', () => {
    it('should return comprehensive statistics', async () => {
      // Mock count query
      mockKnexChain.first = jest.fn().mockResolvedValue({ count: '100' });

      // Mock other aggregations - need to return something
      mockKnexChain.then = jest.fn((resolve) => {
        // For aggregation queries, return empty arrays
        return resolve([]);
      });

      const result = await repository.getStats(7);

      expect(result).toBeDefined();
      // getStats is implemented in base class, just verify it runs
      expect(mockKnex).toHaveBeenCalled();
    });
  });
});
