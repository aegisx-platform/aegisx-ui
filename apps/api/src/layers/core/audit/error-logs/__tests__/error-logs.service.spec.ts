import { ErrorLogsService } from '../error-logs.service';
import { ErrorLogsRepository } from '../error-logs.repository';
import { ErrorLog, ErrorStats } from '../error-logs.schemas';

// Mock Redis
const mockRedis = {
  get: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
};

// Mock Knex
const mockKnex = jest.fn() as any;

// Mock ErrorLogsRepository
jest.mock('../error-logs.repository');

const mockRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  getStats: jest.fn(),
  getStatsByLevel: jest.fn(),
  getStatsByType: jest.fn(),
  findByCorrelationId: jest.fn(),
  findBySessionId: jest.fn(),
  cleanup: jest.fn(),
};

describe('ErrorLogsService', () => {
  let service: ErrorLogsService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the ErrorLogsRepository constructor
    (
      ErrorLogsRepository as jest.MockedClass<typeof ErrorLogsRepository>
    ).mockImplementation(() => mockRepository as any);

    service = new ErrorLogsService(mockKnex, mockRedis as any);
    service['repository'] = mockRepository as any;
  });

  describe('getStats', () => {
    const mockStats: any = {
      total: 100,
      recent24h: 10,
      byLevel: { error: 50, warn: 30, info: 20 },
      byType: {
        javascript: 40,
        http: 30,
        angular: 10,
        custom: 10,
        backend: 5,
        system: 5,
      },
      topMessages: [],
      topUrls: [],
      trend: [],
    };

    it('should return stats from cache if available', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify(mockStats));

      const result = await service.getStats(7);

      expect(mockRedis.get).toHaveBeenCalledWith('error-logs:stats:7');
      expect(mockRepository.getStats).not.toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });

    it('should fetch stats from database and cache them on cache miss', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockRepository.getStats.mockResolvedValue(mockStats);

      const result = await service.getStats(7);

      expect(mockRedis.get).toHaveBeenCalledWith('error-logs:stats:7');
      expect(mockRepository.getStats).toHaveBeenCalledWith(7);
      expect(mockRedis.setex).toHaveBeenCalledWith(
        'error-logs:stats:7',
        300,
        JSON.stringify(mockStats),
      );
      expect(result).toEqual(mockStats);
    });

    it('should fetch from database when Redis is not available', async () => {
      const serviceWithoutRedis = new ErrorLogsService(mockKnex, null);
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
        'error-logs:stats:7',
        'error-logs:stats:30',
      ]);

      await service.invalidateStatsCache();

      expect(mockRedis.keys).toHaveBeenCalledWith('error-logs:stats:*');
      expect(mockRedis.del).toHaveBeenCalledWith(
        'error-logs:stats:7',
        'error-logs:stats:30',
      );
    });

    it('should not call del if no cache keys found', async () => {
      mockRedis.keys.mockResolvedValue([]);

      await service.invalidateStatsCache();

      expect(mockRedis.keys).toHaveBeenCalledWith('error-logs:stats:*');
      expect(mockRedis.del).not.toHaveBeenCalled();
    });

    it('should do nothing when Redis is not available', async () => {
      const serviceWithoutRedis = new ErrorLogsService(mockKnex, null);

      await serviceWithoutRedis.invalidateStatsCache();

      // Should not throw error
      expect(true).toBe(true);
    });
  });

  describe('create', () => {
    it('should create error log and invalidate cache', async () => {
      const newLog: Partial<ErrorLog> = {
        message: 'Test error',
        level: 'error',
        type: 'javascript',
      };

      mockRepository.create.mockResolvedValue('new-id');
      mockRedis.keys.mockResolvedValue(['error-logs:stats:7']);

      const result = await service.create(newLog);

      expect(mockRepository.create).toHaveBeenCalledWith(newLog);
      expect(mockRedis.keys).toHaveBeenCalledWith('error-logs:stats:*');
      expect(mockRedis.del).toHaveBeenCalled();
      expect(result).toBe('new-id');
    });

    it('should throw error if message is missing', async () => {
      const invalidLog: Partial<ErrorLog> = {
        level: 'error',
        type: 'javascript',
      };

      await expect(service.create(invalidLog)).rejects.toThrow(
        'ERROR_MESSAGE_REQUIRED',
      );
    });

    it('should throw error if level is missing', async () => {
      const invalidLog: Partial<ErrorLog> = {
        message: 'Test error',
        type: 'javascript',
      };

      await expect(service.create(invalidLog)).rejects.toThrow(
        'ERROR_LEVEL_REQUIRED',
      );
    });

    it('should throw error if type is missing', async () => {
      const invalidLog: Partial<ErrorLog> = {
        message: 'Test error',
        level: 'error',
      };

      await expect(service.create(invalidLog)).rejects.toThrow(
        'ERROR_TYPE_REQUIRED',
      );
    });

    it('should throw error for invalid level', async () => {
      const invalidLog: Partial<ErrorLog> = {
        message: 'Test error',
        level: 'invalid' as any,
        type: 'javascript',
      };

      await expect(service.create(invalidLog)).rejects.toThrow(
        'ERROR_INVALID_LEVEL',
      );
    });

    it('should throw error for invalid type', async () => {
      const invalidLog: Partial<ErrorLog> = {
        message: 'Test error',
        level: 'error',
        type: 'invalid' as any,
      };

      await expect(service.create(invalidLog)).rejects.toThrow(
        'ERROR_INVALID_TYPE',
      );
    });

    it('should throw error if message is too long', async () => {
      const longMessage = 'a'.repeat(5001);
      const invalidLog: Partial<ErrorLog> = {
        message: longMessage,
        level: 'error',
        type: 'javascript',
      };

      await expect(service.create(invalidLog)).rejects.toThrow(
        'ERROR_MESSAGE_TOO_LONG',
      );
    });
  });

  describe('getStatsByLevel', () => {
    it('should return statistics grouped by error level', async () => {
      const mockLevelStats = {
        error: 50,
        warn: 30,
        info: 20,
      };

      mockRepository.getStatsByLevel.mockResolvedValue(mockLevelStats);

      const result = await service.getStatsByLevel();

      expect(mockRepository.getStatsByLevel).toHaveBeenCalled();
      expect(result).toEqual(mockLevelStats);
    });
  });

  describe('getStatsByType', () => {
    it('should return statistics grouped by error type', async () => {
      const mockTypeStats = {
        javascript: 40,
        http: 30,
        angular: 10,
        custom: 10,
        backend: 5,
        system: 5,
      };

      mockRepository.getStatsByType.mockResolvedValue(mockTypeStats);

      const result = await service.getStatsByType();

      expect(mockRepository.getStatsByType).toHaveBeenCalled();
      expect(result).toEqual(mockTypeStats);
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
      ] as ErrorLog[];

      mockRepository.findByCorrelationId.mockResolvedValue(mockLogs);

      const result = await service.findByCorrelationId('corr-123');

      expect(mockRepository.findByCorrelationId).toHaveBeenCalledWith(
        'corr-123',
      );
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
      ] as ErrorLog[];

      mockRepository.findBySessionId.mockResolvedValue(mockLogs);

      const result = await service.findBySessionId('sess-123');

      expect(mockRepository.findBySessionId).toHaveBeenCalledWith('sess-123');
      expect(result).toEqual(mockLogs);
    });
  });

  describe('findAll', () => {
    it('should return paginated error logs', async () => {
      const mockLogs = [
        {
          id: '1',
          message: 'Error 1',
        },
      ] as any[];

      const paginatedResult = {
        data: mockLogs,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockRepository.findAll.mockResolvedValue(paginatedResult);

      const result = await service.findAll({ limit: 10, page: 1 });

      expect(mockRepository.findAll).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
      });
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findById', () => {
    it('should return error log by ID', async () => {
      const mockLog = {
        id: '1',
        message: 'Error 1',
      } as ErrorLog;

      mockRepository.findById.mockResolvedValue(mockLog);

      const result = await service.findById('1');

      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockLog);
    });
  });

  describe('getExportHeaders', () => {
    it('should return CSV export headers', () => {
      const headers = service['getExportHeaders']();

      expect(headers).toContain('ID');
      expect(headers).toContain('Timestamp');
      expect(headers).toContain('Level');
      expect(headers).toContain('Type');
      expect(headers).toContain('Message');
    });
  });

  describe('getExportRow', () => {
    it('should convert error log to CSV row', () => {
      const mockLog: any = {
        id: '1',
        timestamp: '2024-01-01T00:00:00Z',
        message: 'Test error',
        level: 'error',
        type: 'javascript',
        userId: 'user-1',
        sessionId: 'sess-1',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        correlationId: 'corr-1',
        serverTimestamp: '2024-01-01T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        url: '/test',
        stack: 'Error stack trace',
        referer: '/previous',
        context: null,
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const row = service['getExportRow'](mockLog);

      expect(row[0]).toBe('1'); // ID
      expect(row[2]).toBe('error'); // Level
      expect(row[3]).toBe('javascript'); // Type
    });
  });
});
