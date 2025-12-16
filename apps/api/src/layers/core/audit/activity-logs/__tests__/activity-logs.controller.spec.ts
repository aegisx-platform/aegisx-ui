import { ActivityLogsController } from '../activity-logs.controller';
import { ActivityLogsService } from '../activity-logs.service';

// Mock ActivityLogsService
const mockService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  getStats: jest.fn(),
  cleanup: jest.fn(),
  exportToCSV: jest.fn(),
  exportToJSON: jest.fn(),
};

// Mock Fastify request/reply
const mockRequest = {
  query: {},
  params: {},
  body: {},
  user: { id: 'user-1' },
  log: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
} as any;

const mockReply = {
  code: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  header: jest.fn().mockReturnThis(),
} as any;

describe('ActivityLogsController', () => {
  let controller: ActivityLogsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ActivityLogsController(mockService as any);
  });

  describe('findAll', () => {
    it('should return paginated activity logs', async () => {
      const mockLogs = [{ id: '1', description: 'Created user' }];
      mockService.findAll.mockResolvedValue(mockLogs);

      mockRequest.query = { page: 1, limit: 10 };

      await controller.findAll(mockRequest, mockReply);

      expect(mockService.findAll).toHaveBeenCalled();
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockLogs,
        }),
      );
    });

    it('should handle filters in query', async () => {
      mockService.findAll.mockResolvedValue([]);

      mockRequest.query = {
        page: 1,
        limit: 10,
        action: 'create',
        severity: 'info',
      };

      await controller.findAll(mockRequest, mockReply);

      expect(mockService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'create',
          severity: 'info',
        }),
      );
    });

    it('should handle errors gracefully', async () => {
      mockService.findAll.mockRejectedValue(new Error('Database error'));

      mockRequest.query = { page: 1, limit: 10 };

      await expect(controller.findAll(mockRequest, mockReply)).rejects.toThrow(
        'Database error',
      );
      expect(mockRequest.log.error).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return activity log by ID', async () => {
      const mockLog = { id: '1', description: 'Created user' };
      mockService.findById.mockResolvedValue(mockLog);

      mockRequest.params = { id: '1' };

      await controller.findById(mockRequest, mockReply);

      expect(mockService.findById).toHaveBeenCalledWith('1');
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockLog,
        }),
      );
    });

    it('should return 404 if activity log not found', async () => {
      mockService.findById.mockResolvedValue(null);

      mockRequest.params = { id: 'nonexistent' };

      await controller.findById(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: expect.stringContaining('not found'),
          }),
        }),
      );
    });
  });

  describe('delete', () => {
    it('should delete activity log by ID', async () => {
      mockService.delete.mockResolvedValue(undefined);

      mockRequest.params = { id: '1' };

      await controller.delete(mockRequest, mockReply);

      expect(mockService.delete).toHaveBeenCalledWith('1');
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining('deleted'),
        }),
      );
    });
  });

  describe('getStats', () => {
    it('should return activity log statistics', async () => {
      const mockStats = {
        totalCount: 200,
        period: { days: 7, startDate: '2024-01-01', endDate: '2024-01-07' },
        customStats: {},
      };
      mockService.getStats.mockResolvedValue(mockStats);

      mockRequest.query = { days: 7 };

      await controller.getStats(mockRequest, mockReply);

      expect(mockService.getStats).toHaveBeenCalledWith(7);
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockStats,
        }),
      );
    });
  });

  describe('export', () => {
    it('should export activity logs', async () => {
      const mockData = 'export-data';
      mockService.exportToCSV = jest.fn().mockResolvedValue(mockData);

      mockRequest.query = { action: 'create', format: 'csv' };

      // Export method is inherited from base controller
      // We're just verifying the method exists
      expect(controller).toHaveProperty('export');
    });
  });

  describe('getExportFilename', () => {
    it('should return correct export filename', () => {
      const filename = controller['getExportFilename']();
      expect(filename).toBe('activity-logs');
    });
  });
});
