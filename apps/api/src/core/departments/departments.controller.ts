import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { DepartmentsService } from './departments.service';
import { EventService } from '../../shared/websocket/event.service';
import { CrudEventHelper } from '../../shared/websocket/crud-event-helper';
import {
  CreateDepartmentsSchema,
  UpdateDepartmentsSchema,
  DepartmentsIdParamSchema,
  GetDepartmentsQuerySchema,
  ListDepartmentsQuerySchema,
  type Departments,
} from './departments.schemas';
import { DropdownQuery } from '../../schemas/base.schemas';

/**
 * Core Departments Controller
 *
 * Handles HTTP request/response for department operations.
 * Includes CRUD operations, hierarchy management, and real-time WebSocket events.
 *
 * Endpoints:
 * - GET /core/departments - List departments (paginated)
 * - GET /core/departments/:id - Get single department
 * - POST /core/departments - Create department (201)
 * - PUT /core/departments/:id - Update department
 * - DELETE /core/departments/:id - Delete department
 * - GET /core/departments/dropdown - Dropdown list
 * - GET /core/departments/hierarchy - Hierarchical tree structure
 */
export class DepartmentsController {
  private departmentEvents: CrudEventHelper;

  constructor(
    private departmentsService: DepartmentsService,
    private eventService: EventService,
  ) {
    // Create CRUD event helper for departments
    this.departmentEvents = this.eventService.for('departments', 'department');
  }

  // ===== CORE CRUD OPERATIONS =====

  /**
   * List departments with pagination and filtering
   * GET /core/departments?page=1&limit=20&sort=dept_code:asc
   */
  async list(
    request: FastifyRequest<{
      Querystring: Static<typeof ListDepartmentsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    try {
      request.log.info({ query: request.query }, 'Listing departments');
      const result = await this.departmentsService.findMany(request.query);
      request.log.info(
        { count: result.data.length, total: result.pagination.total },
        'Departments retrieved',
      );

      // Return paginated response
      return reply.paginated(
        result.data,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
      );
    } catch (error) {
      request.log.error(
        {
          error,
          errorMessage:
            error instanceof Error ? error.message : 'Unknown error',
          query: request.query,
        },
        'Error listing departments',
      );
      throw error;
    }
  }

  /**
   * Get single department by ID
   * GET /core/departments/:id
   */
  async getById(
    request: FastifyRequest<{
      Params: Static<typeof DepartmentsIdParamSchema>;
      Querystring: Static<typeof GetDepartmentsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    try {
      request.log.info(
        { departmentId: request.params.id },
        'Fetching department by ID',
      );
      const department = await this.departmentsService.findById(
        request.params.id,
        request.query,
      );

      if (!department) {
        return reply
          .code(404)
          .error(
            'NOT_FOUND',
            `Department with ID ${request.params.id} not found`,
          );
      }

      return reply.success(department);
    } catch (error) {
      request.log.error(
        { error, departmentId: request.params.id },
        'Error fetching department',
      );
      throw error;
    }
  }

  /**
   * Create new department
   * POST /core/departments
   * Returns 201 Created
   */
  async create(
    request: FastifyRequest<{
      Body: Static<typeof CreateDepartmentsSchema>;
    }>,
    reply: FastifyReply,
  ) {
    try {
      request.log.info({ body: request.body }, 'Creating department');
      const userId = request.user?.id;

      const department = await this.departmentsService.create(
        request.body,
        userId,
      );

      request.log.info(
        { departmentId: department.id },
        'Department created successfully',
      );

      // Emit real-time WebSocket event
      this.departmentEvents.emitCreated(department);

      return reply
        .code(201)
        .success(department, 'Department created successfully');
    } catch (error: any) {
      request.log.error(
        {
          error,
          errorMessage: error.message || 'Unknown error',
          body: request.body,
        },
        'Error creating department',
      );
      throw error;
    }
  }

  /**
   * Update existing department
   * PUT /core/departments/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof DepartmentsIdParamSchema>;
      Body: Static<typeof UpdateDepartmentsSchema>;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      request.log.info(
        { departmentId: id, body: request.body },
        'Updating department',
      );
      const userId = request.user?.id;

      const department = await this.departmentsService.update(
        id,
        request.body,
        userId,
      );

      if (!department) {
        return reply
          .code(404)
          .error('NOT_FOUND', `Department with ID ${id} not found`);
      }

      request.log.info({ departmentId: id }, 'Department updated successfully');

      // Emit real-time WebSocket event
      this.departmentEvents.emitUpdated(department);

      return reply.success(department, 'Department updated successfully');
    } catch (error: any) {
      request.log.error(
        {
          error,
          errorMessage: error.message || 'Unknown error',
          departmentId: request.params.id,
          body: request.body,
        },
        'Error updating department',
      );
      throw error;
    }
  }

  /**
   * Delete department
   * DELETE /core/departments/:id
   */
  async delete(
    request: FastifyRequest<{
      Params: Static<typeof DepartmentsIdParamSchema>;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      request.log.info({ departmentId: id }, 'Deleting department');
      const userId = request.user?.id;

      const deleted = await this.departmentsService.delete(id);

      if (!deleted) {
        return reply
          .code(404)
          .error('NOT_FOUND', `Department with ID ${id} not found`);
      }

      request.log.info({ departmentId: id }, 'Department deleted successfully');

      // Emit real-time WebSocket event
      this.departmentEvents.emitDeleted(String(id));

      return reply.success(
        {
          id,
          deleted: true,
        },
        'Department deleted successfully',
      );
    } catch (error: any) {
      request.log.error(
        {
          error,
          errorMessage: error.message || 'Unknown error',
          departmentId: request.params.id,
        },
        'Error deleting department',
      );
      throw error;
    }
  }

  // ===== SPECIALIZED ENDPOINTS =====

  /**
   * Get dropdown list of departments
   * GET /core/departments/dropdown?search=&limit=100
   * Returns simplified list for UI dropdowns
   */
  async dropdown(
    request: FastifyRequest<{
      Querystring: DropdownQuery;
    }>,
    reply: FastifyReply,
  ) {
    try {
      request.log.info(
        { query: request.query },
        'Fetching departments dropdown',
      );

      const dropdownItems = await this.departmentsService.getDropdown();

      request.log.info(
        { count: dropdownItems.length },
        'Departments dropdown retrieved',
      );

      return reply.success({
        options: dropdownItems,
        total: dropdownItems.length,
      });
    } catch (error) {
      request.log.error(
        { error, query: request.query },
        'Error fetching departments dropdown',
      );
      throw error;
    }
  }

  /**
   * Get department hierarchy tree
   * GET /core/departments/hierarchy?parentId=null
   * Returns nested hierarchical structure for organizational tree views
   */
  async hierarchy(
    request: FastifyRequest<{
      Querystring: { parentId?: string | number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const parentId = request.query.parentId
        ? Number(request.query.parentId)
        : undefined;

      request.log.info({ parentId }, 'Fetching departments hierarchy');

      const hierarchy = await this.departmentsService.getHierarchy(parentId);

      request.log.info(
        { count: hierarchy.length },
        'Departments hierarchy retrieved',
      );

      return reply.success({
        hierarchy,
        total: hierarchy.length,
      });
    } catch (error) {
      request.log.error(
        { error, parentId: request.query.parentId },
        'Error fetching departments hierarchy',
      );
      throw error;
    }
  }

  /**
   * Get department statistics
   * GET /core/departments/stats
   */
  async stats(request: FastifyRequest, reply: FastifyReply) {
    try {
      request.log.info({}, 'Fetching departments statistics');
      const stats = await this.departmentsService.getStats();

      request.log.info({ stats }, 'Departments statistics retrieved');

      return reply.success(stats);
    } catch (error) {
      request.log.error({ error }, 'Error fetching departments statistics');
      throw error;
    }
  }
}
