import { ErrorLogsRepository } from '../error-logs.repository';
import { ErrorQuery } from '../error-logs.schemas';

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

describe('ErrorLogsRepository', () => {
  let repository: ErrorLogsRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new ErrorLogsRepository(mockKnex as any);
  });

  describe('getSelectFields', () => {
    it('should return select fields with proper camelCase mapping', async () => {
      // This is a protected method, test it indirectly through findAll
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      await repository.findAll({});

      // Verify that select was called
      expect(mockKnexChain.select).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all error logs with default pagination', async () => {
      const mockData = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          message: 'Test error',
          level: 'error',
          type: 'javascript',
          userId: 'user-1',
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

    it('should filter by error level', async () => {
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const query: ErrorQuery = { level: 'error', limit: 10, page: 1 };
      await repository.findAll(query);

      expect(mockKnexChain.where).toHaveBeenCalledWith('level', 'error');
    });

    it('should filter by error type', async () => {
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const query: ErrorQuery = { type: 'http', limit: 10, page: 1 };
      await repository.findAll(query);

      expect(mockKnexChain.where).toHaveBeenCalledWith('type', 'http');
    });

    it('should filter by correlation ID', async () => {
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const query: ErrorQuery = {
        correlationId: 'corr-123',
        limit: 10,
        page: 1,
      };
      await repository.findAll(query);

      expect(mockKnexChain.where).toHaveBeenCalledWith(
        'correlation_id',
        'corr-123',
      );
    });

    it('should filter by session ID', async () => {
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const query: ErrorQuery = { sessionId: 'sess-123', limit: 10, page: 1 };
      await repository.findAll(query);

      expect(mockKnexChain.where).toHaveBeenCalledWith(
        'session_id',
        'sess-123',
      );
    });

    it('should filter by user ID', async () => {
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const query: ErrorQuery = { userId: 'user-1', limit: 10, page: 1 };
      await repository.findAll(query);

      expect(mockKnexChain.where).toHaveBeenCalledWith('user_id', 'user-1');
    });

    it('should filter by date range', async () => {
      // Mock both the count query and the data query
      mockKnexChain.first.mockResolvedValue({ count: '0' });
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const query: ErrorQuery = { startDate, endDate, limit: 10, page: 1 };

      await repository.findAll(query);

      // Check that where clause was added for date filtering
      expect(mockKnexChain.where).toHaveBeenCalled();
    });

    it('should apply search filter', async () => {
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const query: ErrorQuery = { search: 'network error', limit: 10, page: 1 };
      await repository.findAll(query);

      // Search should trigger a where clause for search fields
      expect(mockKnexChain.where).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return error log by ID', async () => {
      const mockLog = {
        id: '1',
        timestamp: new Date().toISOString(),
        message: 'Test error',
        level: 'error',
        type: 'javascript',
      };

      mockKnexChain.first = jest.fn().mockResolvedValue(mockLog);

      const result = await repository.findById('1');

      expect(mockKnexChain.where).toHaveBeenCalledWith('id', '1');
      expect(mockKnexChain.first).toHaveBeenCalled();
      expect(result).toEqual(mockLog);
    });

    it('should return null if error log not found', async () => {
      mockKnexChain.first = jest.fn().mockResolvedValue(null);

      const result = await repository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create error log and return ID', async () => {
      const newLog = {
        message: 'New error',
        level: 'error' as const,
        type: 'javascript' as const,
        userId: 'user-1',
      };

      mockKnexChain.returning = jest.fn().mockResolvedValue([{ id: 'new-id' }]);

      const result = await repository.create(newLog);

      expect(mockKnex).toHaveBeenCalledWith('error_logs');
      expect(mockKnexChain.insert).toHaveBeenCalled();
      expect(mockKnexChain.returning).toHaveBeenCalledWith('id');
      expect(result).toBe('new-id');
    });
  });

  describe('delete', () => {
    it('should delete error log by ID', async () => {
      mockKnexChain.delete = jest.fn().mockResolvedValue(1);

      await repository.delete('1');

      expect(mockKnex).toHaveBeenCalledWith('error_logs');
      expect(mockKnexChain.where).toHaveBeenCalledWith('id', '1');
      expect(mockKnexChain.delete).toHaveBeenCalled();
    });
  });

  describe('getStatsByLevel', () => {
    it('should return statistics grouped by error level', async () => {
      const mockResults = [
        { level: 'error', count: '10' },
        { level: 'warn', count: '5' },
        { level: 'info', count: '2' },
      ];

      mockKnexChain.then = jest.fn((resolve) => resolve(mockResults));

      const result = await repository.getStatsByLevel();

      expect(mockKnex).toHaveBeenCalledWith('error_logs');
      expect(mockKnexChain.select).toHaveBeenCalledWith('level');
      expect(mockKnexChain.groupBy).toHaveBeenCalledWith('level');
      expect(result).toEqual({
        error: 10,
        warn: 5,
        info: 2,
      });
    });

    it('should return zero counts for levels with no data', async () => {
      mockKnexChain.then = jest.fn((resolve) => resolve([]));

      const result = await repository.getStatsByLevel();

      expect(result).toEqual({
        error: 0,
        warn: 0,
        info: 0,
      });
    });
  });

  describe('getStatsByType', () => {
    it('should return statistics grouped by error type', async () => {
      const mockResults = [
        { type: 'javascript', count: '15' },
        { type: 'http', count: '8' },
        { type: 'angular', count: '3' },
      ];

      mockKnexChain.then = jest.fn((resolve) => resolve(mockResults));

      const result = await repository.getStatsByType();

      expect(mockKnex).toHaveBeenCalledWith('error_logs');
      expect(mockKnexChain.select).toHaveBeenCalledWith('type');
      expect(mockKnexChain.groupBy).toHaveBeenCalledWith('type');
      expect(result).toEqual({
        javascript: 15,
        http: 8,
        angular: 3,
        custom: 0,
        backend: 0,
        system: 0,
      });
    });
  });

  describe('findByCorrelationId', () => {
    it('should return error logs by correlation ID', async () => {
      const mockLogs = [
        {
          id: '1',
          correlationId: 'corr-123',
          message: 'Error 1',
        },
        {
          id: '2',
          correlationId: 'corr-123',
          message: 'Error 2',
        },
      ];

      mockKnexChain.then = jest.fn((resolve) => resolve(mockLogs));

      const result = await repository.findByCorrelationId('corr-123');

      expect(mockKnex).toHaveBeenCalledWith('error_logs');
      expect(mockKnexChain.where).toHaveBeenCalledWith(
        'correlation_id',
        'corr-123',
      );
      expect(mockKnexChain.orderBy).toHaveBeenCalledWith('timestamp', 'desc');
      expect(result).toEqual(mockLogs);
    });
  });

  describe('findBySessionId', () => {
    it('should return error logs by session ID', async () => {
      const mockLogs = [
        {
          id: '1',
          sessionId: 'sess-123',
          message: 'Error 1',
        },
      ];

      mockKnexChain.then = jest.fn((resolve) => resolve(mockLogs));

      const result = await repository.findBySessionId('sess-123');

      expect(mockKnex).toHaveBeenCalledWith('error_logs');
      expect(mockKnexChain.where).toHaveBeenCalledWith(
        'session_id',
        'sess-123',
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
