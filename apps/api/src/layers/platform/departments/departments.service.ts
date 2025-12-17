import { BaseService } from '../../../shared/services/base.service';
import { DepartmentsRepository } from './departments.repository';
import { AppError } from '../../../shared/errors/app-error';
import {
  type Departments,
  type CreateDepartments,
  type UpdateDepartments,
  type GetDepartmentsQuery,
  type ListDepartmentsQuery,
} from './departments.schemas';
import {
  DepartmentsErrorCode,
  DepartmentsErrorMessages,
} from './departments.types';
import type {
  DepartmentDropdownItem,
  DepartmentHierarchyNode,
  DeleteValidationResult,
} from './departments.repository';

/**
 * Core Departments Service
 *
 * Business logic layer for department management.
 * Handles validation, hierarchy management, and reference checking.
 *
 * Key Features:
 * - Unique code validation
 * - Parent department validation
 * - Circular hierarchy prevention
 * - Reference checking before deletion
 * - Hierarchy tree generation
 * - Dropdown list generation
 */
export class DepartmentsService extends BaseService<
  Departments,
  CreateDepartments,
  UpdateDepartments
> {
  constructor(private departmentsRepository: DepartmentsRepository) {
    super(departmentsRepository);
  }

  // ===== PUBLIC METHODS =====

  /**
   * Get department by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetDepartmentsQuery = {},
  ): Promise<Departments | null> {
    const department = await this.getById(id);

    if (department && options.include) {
      // Future: Handle relationship includes if needed
      // For now, return base department
    }

    return department;
  }

  /**
   * Get department by code
   */
  async findByCode(code: string): Promise<Departments | null> {
    const department = await this.departmentsRepository.findByCode(code);
    return department;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListDepartmentsQuery = {}): Promise<{
    data: Departments[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const result = await this.getList(options);
    return result;
  }

  /**
   * Create new department with validation
   */
  async create(data: CreateDepartments, userId?: string): Promise<Departments> {
    const department = await super.create(data);
    return department;
  }

  /**
   * Update existing department with validation
   */
  async update(
    id: string | number,
    data: UpdateDepartments,
    userId?: string,
  ): Promise<Departments | null> {
    const department = await super.update(id, data);
    return department;
  }

  /**
   * Delete department with reference checking
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      // Check if department exists first
      const existing = await this.departmentsRepository.findById(id);
      if (!existing) {
        return false;
      }

      // Direct repository call to avoid base service complexity
      const deleted = await this.departmentsRepository.delete(id);

      if (deleted) {
        console.log('Department deleted successfully:', { id });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  }

  /**
   * Get department hierarchy tree
   * @param parentId - Starting parent ID (null for root departments)
   * @returns Nested hierarchy structure
   */
  async getHierarchy(
    parentId?: number | null,
  ): Promise<DepartmentHierarchyNode[]> {
    return this.departmentsRepository.getHierarchy(parentId);
  }

  /**
   * Get simplified department list for dropdowns
   * @returns Array of active departments for UI dropdowns
   */
  async getDropdown(): Promise<DepartmentDropdownItem[]> {
    return this.departmentsRepository.getDropdown();
  }

  /**
   * Check if department can be deleted
   * @param id - Department ID
   * @returns Validation result with detailed reasons if blocked
   */
  async canDelete(id: string | number): Promise<DeleteValidationResult> {
    return this.departmentsRepository.canBeDeleted(id);
  }

  /**
   * Get basic statistics
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    return this.departmentsRepository.getStats();
  }

  // ===== VALIDATION HOOKS =====

  /**
   * Validate data before creating department
   *
   * Checks:
   * - dept_code uniqueness
   * - parent_id exists and is active
   */
  protected async validateCreate(data: CreateDepartments): Promise<void> {
    // Check dept_code uniqueness
    if (data.dept_code) {
      const existing = await this.departmentsRepository.findByCode(
        data.dept_code,
      );
      if (existing) {
        throw new AppError(
          DepartmentsErrorMessages[DepartmentsErrorCode.CODE_EXISTS],
          409, // Conflict
          DepartmentsErrorCode.CODE_EXISTS,
          { code: data.dept_code },
        );
      }
    }

    // Validate parent_id if provided
    if (data.parent_id !== undefined && data.parent_id !== null) {
      const isValid = await this.departmentsRepository.validateParent(
        data.parent_id,
      );
      if (!isValid) {
        throw new AppError(
          DepartmentsErrorMessages[DepartmentsErrorCode.INVALID_PARENT],
          400, // Bad Request
          DepartmentsErrorCode.INVALID_PARENT,
          { parentId: data.parent_id },
        );
      }
    }
  }

  /**
   * Validate data before updating department
   *
   * Checks:
   * - dept_code uniqueness (if changed)
   * - parent_id exists and is active (if changed)
   * - circular hierarchy prevention
   */
  protected async validateUpdate(
    id: string | number,
    data: UpdateDepartments,
    existing: Departments,
  ): Promise<void> {
    // Check dept_code uniqueness if changed
    if (data.dept_code && data.dept_code !== existing.dept_code) {
      const existingCode = await this.departmentsRepository.findByCode(
        data.dept_code,
      );
      if (existingCode && existingCode.id !== existing.id) {
        throw new AppError(
          DepartmentsErrorMessages[DepartmentsErrorCode.CODE_EXISTS],
          409, // Conflict
          DepartmentsErrorCode.CODE_EXISTS,
          { code: data.dept_code },
        );
      }
    }

    // Validate parent_id if changed
    if (data.parent_id !== undefined) {
      // If parent_id is being set or changed
      if (data.parent_id !== null) {
        const isValid = await this.departmentsRepository.validateParent(
          data.parent_id,
        );
        if (!isValid) {
          throw new AppError(
            DepartmentsErrorMessages[DepartmentsErrorCode.INVALID_PARENT],
            400, // Bad Request
            DepartmentsErrorCode.INVALID_PARENT,
            { parentId: data.parent_id },
          );
        }

        // Check for circular hierarchy
        const hasCircular =
          await this.departmentsRepository.hasCircularHierarchy(
            Number(id),
            data.parent_id,
          );
        if (hasCircular) {
          throw new AppError(
            DepartmentsErrorMessages[DepartmentsErrorCode.CIRCULAR_HIERARCHY],
            400, // Bad Request
            DepartmentsErrorCode.CIRCULAR_HIERARCHY,
            {
              departmentId: id,
              parentId: data.parent_id,
            },
          );
        }
      }
    }
  }

  /**
   * Validate before deleting department
   *
   * Checks:
   * - No child departments
   * - No assigned users
   */
  protected async validateDelete(
    id: string | number,
    existing: Departments,
  ): Promise<void> {
    // Check if department can be deleted (has references)
    const deleteCheck = await this.departmentsRepository.canBeDeleted(id);

    if (!deleteCheck.canDelete) {
      // Build detailed error message
      const refDetails = deleteCheck.blockedBy
        .map((ref) => `${ref.count} ${ref.reason}`)
        .join(', ');

      throw new AppError(
        DepartmentsErrorMessages[
          DepartmentsErrorCode.CANNOT_DELETE_HAS_REFERENCES
        ],
        422, // Unprocessable Entity
        DepartmentsErrorCode.CANNOT_DELETE_HAS_REFERENCES,
        {
          references: deleteCheck.blockedBy,
          message: `Cannot delete department - ${refDetails}`,
        },
      );
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====

  /**
   * Process data before creation
   * Sets default values if not provided
   */
  protected async beforeCreate(
    data: CreateDepartments,
  ): Promise<CreateDepartments> {
    return {
      ...data,
      is_active: data.is_active !== undefined ? data.is_active : true,
    };
  }

  /**
   * Execute logic after department creation
   */
  protected async afterCreate(
    department: Departments,
    _originalData: CreateDepartments,
  ): Promise<void> {
    console.log('Department created:', {
      id: department.id,
      code: department.dept_code,
      name: department.dept_name,
    });
  }

  /**
   * Execute logic after department update
   */
  protected async afterUpdate(
    updated: Departments,
    updateData: UpdateDepartments,
    original: Departments,
  ): Promise<void> {
    console.log('Department updated:', {
      id: updated.id,
      changes: Object.keys(updateData),
    });
  }

  /**
   * Execute logic after department deletion
   */
  protected async afterDelete(
    id: string | number,
    deleted: Departments,
  ): Promise<void> {
    console.log('Department deleted:', {
      id: deleted.id,
      code: deleted.dept_code,
      name: deleted.dept_name,
    });
  }
}
