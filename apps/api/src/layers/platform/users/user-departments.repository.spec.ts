import { UserDepartmentsRepository } from './user-departments.repository';

/**
 * Helper to create a thenable mock that resolves to a value
 */
function createMockQuery<T>(resolveValue: T) {
  const chain: any = {};

  chain.select = jest.fn().mockReturnValue(chain);
  chain.where = jest.fn().mockReturnValue(chain);
  chain.whereRaw = jest.fn().mockReturnValue(chain);
  chain.whereIn = jest.fn().mockReturnValue(chain);
  chain.orderBy = jest.fn().mockReturnValue(chain);
  chain.first = jest.fn().mockReturnValue(chain);
  chain.count = jest.fn().mockReturnValue(chain);
  chain.insert = jest.fn().mockReturnValue(chain);
  chain.update = jest.fn().mockReturnValue(chain);
  chain.returning = jest.fn().mockReturnValue(chain);
  chain.then = jest.fn((resolve) => resolve(resolveValue));

  return chain;
}

describe('UserDepartmentsRepository - Permission Field Removal', () => {
  let repository: UserDepartmentsRepository;
  let mockDb: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock Knex instance
    mockDb = jest.fn() as any;
    (mockDb as any).fn = {
      now: jest.fn().mockReturnValue('mocked_now'),
    };

    repository = new UserDepartmentsRepository(mockDb as any);
  });

  // =========================================================================
  // Tests: Verify permission fields are NOT returned
  // =========================================================================

  describe('Permission Field Removal - Response Verification', () => {
    it('should not return permission fields from findByUserId()', async () => {
      // Arrange: Mock database query to return user department data
      const mockDepartments = [
        {
          id: 'dept-assign-1',
          user_id: 'user-123',
          department_id: 1,
          hospital_id: null,
          is_primary: true,
          assigned_role: 'staff',
          valid_from: null,
          valid_until: null,
          assigned_by: 'admin-1',
          assigned_at: new Date('2024-01-01'),
          notes: 'Primary department',
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01'),
        },
      ];

      mockDb.mockReturnValue(createMockQuery(mockDepartments));

      // Act: Call the method
      const result = await repository.findByUserId('user-123');

      // Assert: Verify permission fields are NOT present
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);

      // Verify permission fields are absent
      expect(result[0]).not.toHaveProperty('canCreateRequests');
      expect(result[0]).not.toHaveProperty('can_create_requests');
      expect(result[0]).not.toHaveProperty('canEditRequests');
      expect(result[0]).not.toHaveProperty('can_edit_requests');
      expect(result[0]).not.toHaveProperty('canSubmitRequests');
      expect(result[0]).not.toHaveProperty('can_submit_requests');
      expect(result[0]).not.toHaveProperty('canApproveRequests');
      expect(result[0]).not.toHaveProperty('can_approve_requests');
      expect(result[0]).not.toHaveProperty('canViewReports');
      expect(result[0]).not.toHaveProperty('can_view_reports');

      // Verify organizational fields ARE present
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('userId');
      expect(result[0]).toHaveProperty('departmentId');
      expect(result[0]).toHaveProperty('isPrimary');
      expect(result[0]).toHaveProperty('assignedRole');
    });

    it('should not return permission fields from findByDepartmentId()', async () => {
      // Arrange: Mock database query
      const mockDepartments = [
        {
          id: 'dept-assign-2',
          user_id: 'user-456',
          department_id: 2,
          hospital_id: null,
          is_primary: false,
          assigned_role: 'manager',
          valid_from: null,
          valid_until: null,
          assigned_by: 'admin-1',
          assigned_at: new Date('2024-01-02'),
          notes: null,
          created_at: new Date('2024-01-02'),
          updated_at: new Date('2024-01-02'),
        },
      ];

      mockDb.mockReturnValue(createMockQuery(mockDepartments));

      // Act: Call the method
      const result = await repository.findByDepartmentId(2);

      // Assert: Verify permission fields are NOT present
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).not.toHaveProperty('canCreateRequests');
      expect(result[0]).not.toHaveProperty('canEditRequests');
      expect(result[0]).not.toHaveProperty('canSubmitRequests');
      expect(result[0]).not.toHaveProperty('canApproveRequests');
      expect(result[0]).not.toHaveProperty('canViewReports');
    });

    it('should not return permission fields from getPrimaryDepartment()', async () => {
      // Arrange: Mock database query for primary department
      const mockPrimaryDept = {
        id: 'dept-assign-3',
        user_id: 'user-789',
        department_id: 3,
        hospital_id: null,
        is_primary: true,
        assigned_role: 'supervisor',
        valid_from: null,
        valid_until: null,
        assigned_by: 'admin-1',
        assigned_at: new Date('2024-01-03'),
        notes: 'Primary assignment',
        created_at: new Date('2024-01-03'),
        updated_at: new Date('2024-01-03'),
      };

      mockDb.mockReturnValue(createMockQuery(mockPrimaryDept));

      // Act: Call the method
      const result = await repository.getPrimaryDepartment('user-789');

      // Assert: Verify it's not null and has no permission fields
      expect(result).not.toBeNull();
      expect(result).not.toHaveProperty('canCreateRequests');
      expect(result).not.toHaveProperty('canEditRequests');
      expect(result).not.toHaveProperty('canSubmitRequests');
      expect(result).not.toHaveProperty('canApproveRequests');
      expect(result).not.toHaveProperty('canViewReports');

      // Verify organizational fields are present
      expect(result?.userId).toBe('user-789');
      expect(result?.isPrimary).toBe(true);
    });

    it('should return null when no primary department exists', async () => {
      // Arrange: Mock database query returning no result
      mockDb.mockReturnValue(createMockQuery(null));

      // Act: Call the method
      const result = await repository.getPrimaryDepartment('user-no-primary');

      // Assert: Should return null safely
      expect(result).toBeNull();
    });

    it('should not return permission fields from getActiveDepartments()', async () => {
      // Arrange: Mock active departments
      const mockActiveDepts = [
        {
          id: 'dept-assign-4',
          user_id: 'user-999',
          department_id: 4,
          hospital_id: null,
          is_primary: true,
          assigned_role: 'staff',
          valid_from: null,
          valid_until: null,
          assigned_by: 'admin-1',
          assigned_at: new Date('2024-01-04'),
          notes: null,
          created_at: new Date('2024-01-04'),
          updated_at: new Date('2024-01-04'),
        },
        {
          id: 'dept-assign-5',
          user_id: 'user-999',
          department_id: 5,
          hospital_id: null,
          is_primary: false,
          assigned_role: 'analyst',
          valid_from: null,
          valid_until: null,
          assigned_by: 'admin-1',
          assigned_at: new Date('2024-01-05'),
          notes: null,
          created_at: new Date('2024-01-05'),
          updated_at: new Date('2024-01-05'),
        },
      ];

      mockDb.mockReturnValue(createMockQuery(mockActiveDepts));

      // Act: Call the method
      const result = await repository.getActiveDepartments('user-999');

      // Assert: Verify all results have no permission fields
      expect(result).toBeDefined();
      expect(result.length).toBe(2);

      result.forEach((dept) => {
        expect(dept).not.toHaveProperty('canCreateRequests');
        expect(dept).not.toHaveProperty('canEditRequests');
        expect(dept).not.toHaveProperty('canSubmitRequests');
        expect(dept).not.toHaveProperty('canApproveRequests');
        expect(dept).not.toHaveProperty('canViewReports');

        // Verify organizational fields are present
        expect(dept).toHaveProperty('userId');
        expect(dept).toHaveProperty('departmentId');
        expect(dept).toHaveProperty('isPrimary');
      });
    });

    it('should not return permission fields from getAssignment()', async () => {
      // Arrange: Mock a specific assignment
      const mockAssignment = {
        id: 'dept-assign-6',
        user_id: 'user-333',
        department_id: 6,
        hospital_id: null,
        is_primary: false,
        assigned_role: 'viewer',
        valid_from: null,
        valid_until: null,
        assigned_by: 'admin-1',
        assigned_at: new Date('2024-01-06'),
        notes: 'Test assignment',
        created_at: new Date('2024-01-06'),
        updated_at: new Date('2024-01-06'),
      };

      mockDb.mockReturnValue(createMockQuery(mockAssignment));

      // Act: Call the method
      const result = await repository.getAssignment('user-333', 6);

      // Assert: Verify no permission fields
      expect(result).not.toBeNull();
      expect(result).not.toHaveProperty('canCreateRequests');
      expect(result).not.toHaveProperty('canEditRequests');
      expect(result).not.toHaveProperty('canSubmitRequests');
      expect(result).not.toHaveProperty('canApproveRequests');
      expect(result).not.toHaveProperty('canViewReports');
    });
  });

  // =========================================================================
  // Tests: Verify assignment methods work without permission parameters
  // =========================================================================

  describe('Assignment Methods - No Permission Parameters', () => {
    it('should not accept permission parameters in assignUserToDepartment()', async () => {
      // Arrange: Prepare assignment data WITHOUT permission fields
      const assignmentData = {
        userId: 'user-new',
        departmentId: 7,
        hospitalId: null,
        isPrimary: true,
        assignedRole: 'staff',
        validFrom: null,
        validUntil: null,
        assignedBy: 'admin-1',
        notes: 'New assignment',
      };

      // Verify the assignment data does NOT include permission fields
      expect(assignmentData).not.toHaveProperty('canCreateRequests');
      expect(assignmentData).not.toHaveProperty('canEditRequests');
      expect(assignmentData).not.toHaveProperty('canSubmitRequests');
      expect(assignmentData).not.toHaveProperty('canApproveRequests');
      expect(assignmentData).not.toHaveProperty('canViewReports');

      const mockResult = {
        id: 'new-assign-id',
        user_id: 'user-new',
        department_id: 7,
        hospital_id: null,
        is_primary: true,
        assigned_role: 'staff',
        valid_from: null,
        valid_until: null,
        assigned_by: 'admin-1',
        assigned_at: new Date(),
        notes: 'New assignment',
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Setup mock: first call for unset-primary, second for insert
      let callCount = 0;
      mockDb.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call: unset other primaries (update call)
          return createMockQuery(undefined);
        } else {
          // Second call: insert new assignment
          const chain = createMockQuery(undefined);
          chain.returning = jest
            .fn()
            .mockReturnValue(createMockQuery([mockResult]));
          return chain;
        }
      });

      // Act: Call the method with assignment data (no permissions)
      const result = await repository.assignUserToDepartment(assignmentData);

      // Assert: Verify the result has no permission fields
      expect(result).not.toHaveProperty('canCreateRequests');
      expect(result).not.toHaveProperty('canEditRequests');
      expect(result).not.toHaveProperty('canSubmitRequests');
      expect(result).not.toHaveProperty('canApproveRequests');
      expect(result).not.toHaveProperty('canViewReports');

      // Verify organizational fields are present
      expect(result.userId).toBe('user-new');
      expect(result.departmentId).toBe(7);
      expect(result.isPrimary).toBe(true);
    });

    it('should set other primaries to false when assigning as primary', async () => {
      // Arrange: Mock update to unset other primaries
      const assignmentData = {
        userId: 'user-existing',
        departmentId: 8,
        isPrimary: true,
      };

      const mockResult = {
        id: 'new-assign',
        user_id: 'user-existing',
        department_id: 8,
        hospital_id: null,
        is_primary: true,
        assigned_role: null,
        valid_from: null,
        valid_until: null,
        assigned_by: null,
        assigned_at: new Date(),
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Setup mock: first call for unset-primary, second for insert
      let callCount = 0;
      mockDb.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call: unset other primaries (update call)
          return createMockQuery(undefined);
        } else {
          // Second call: insert new assignment
          const chain = createMockQuery(undefined);
          chain.returning = jest
            .fn()
            .mockReturnValue(createMockQuery([mockResult]));
          return chain;
        }
      });

      // Act: Call the method
      const result = await repository.assignUserToDepartment(assignmentData);

      // Assert: Verify result was created
      expect(result.isPrimary).toBe(true);
      expect(result.userId).toBe('user-existing');
    });

    it('should not include permission columns in INSERT query', async () => {
      // Arrange: Prepare assignment data
      const assignmentData = {
        userId: 'user-insert-test',
        departmentId: 9,
        assignedRole: 'manager',
      };

      const mockResult = {
        id: 'insert-test-id',
        user_id: 'user-insert-test',
        department_id: 9,
        hospital_id: null,
        is_primary: false,
        assigned_role: 'manager',
        valid_from: null,
        valid_until: null,
        assigned_by: null,
        assigned_at: new Date(),
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      let insertedData: any = null;
      mockDb.mockImplementationOnce(() => {
        const chain = createMockQuery(undefined);
        chain.insert = jest.fn().mockImplementation((data) => {
          insertedData = data;
          return chain;
        });
        chain.returning = jest
          .fn()
          .mockReturnValue(createMockQuery([mockResult]));
        return chain;
      });

      // Act: Call the method
      const result = await repository.assignUserToDepartment(assignmentData);

      // Assert: Verify insert was called with correct parameters (no permission fields)
      expect(insertedData).toBeDefined();
      expect(insertedData).not.toHaveProperty('canCreateRequests');
      expect(insertedData).not.toHaveProperty('can_create_requests');
      expect(insertedData).not.toHaveProperty('canEditRequests');
      expect(insertedData).not.toHaveProperty('can_edit_requests');
      expect(insertedData).not.toHaveProperty('canSubmitRequests');
      expect(insertedData).not.toHaveProperty('can_submit_requests');
      expect(insertedData).not.toHaveProperty('canApproveRequests');
      expect(insertedData).not.toHaveProperty('can_approve_requests');
      expect(insertedData).not.toHaveProperty('canViewReports');
      expect(insertedData).not.toHaveProperty('can_view_reports');

      // Verify result has no permission fields
      expect(result).not.toHaveProperty('canCreateRequests');
      expect(result).not.toHaveProperty('canEditRequests');
      expect(result).not.toHaveProperty('canSubmitRequests');
      expect(result).not.toHaveProperty('canApproveRequests');
      expect(result).not.toHaveProperty('canViewReports');
    });

    it('should update assignment without permission fields', async () => {
      // Arrange: Prepare update data WITHOUT permission fields
      const updateData = {
        assignedRole: 'supervisor',
        validUntil: new Date('2025-12-31'),
      };

      const mockResult = {
        id: 'update-test-id',
        user_id: 'user-update',
        department_id: 10,
        hospital_id: null,
        is_primary: false,
        assigned_role: 'supervisor',
        valid_from: null,
        valid_until: new Date('2025-12-31'),
        assigned_by: 'admin-1',
        assigned_at: new Date('2024-01-10'),
        notes: null,
        created_at: new Date('2024-01-10'),
        updated_at: new Date(),
      };

      mockDb.mockImplementationOnce(() => {
        const chain = createMockQuery(undefined);
        chain.returning = jest
          .fn()
          .mockReturnValue(createMockQuery([mockResult]));
        return chain;
      });

      // Act: Call the method
      const result = await repository.updateAssignment(
        'user-update',
        10,
        updateData,
      );

      // Assert: Verify result has no permission fields
      expect(result).not.toHaveProperty('canCreateRequests');
      expect(result).not.toHaveProperty('canEditRequests');
      expect(result).not.toHaveProperty('canSubmitRequests');
      expect(result).not.toHaveProperty('canApproveRequests');
      expect(result).not.toHaveProperty('canViewReports');

      // Verify organizational fields were updated
      expect(result?.assignedRole).toBe('supervisor');
      expect(result?.validUntil).toEqual(new Date('2025-12-31'));
    });
  });

  // =========================================================================
  // Tests: Verify query methods work correctly
  // =========================================================================

  describe('Query Methods - Organizational Data Only', () => {
    it('should count active departments correctly', async () => {
      // Arrange: Mock count query
      mockDb.mockReturnValue(createMockQuery({ count: '3' }));

      // Act: Call the method
      const result = await repository.countActiveDepartments('user-count');

      // Assert: Verify count result
      expect(result).toBe(3);
    });

    it('should check assignment existence without permission checks', async () => {
      // Arrange: Mock assignment existence check
      const mockAssignment = {
        id: 'exists-check-id',
        user_id: 'user-exists',
        department_id: 12,
        hospital_id: null,
        is_primary: false,
        assigned_role: null,
        valid_from: null,
        valid_until: null,
        assigned_by: null,
        assigned_at: new Date(),
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.mockReturnValue(createMockQuery(mockAssignment));

      // Act: Call the method
      const result = await repository.isAssignedToDepartment('user-exists', 12);

      // Assert: Verify result is boolean
      expect(result).toBe(true);
    });

    it('should return false for assignment that does not exist', async () => {
      // Arrange: Mock no assignment found
      mockDb.mockReturnValue(createMockQuery(null));

      // Act: Call the method
      const result = await repository.isAssignedToDepartment(
        'user-not-exists',
        99,
      );

      // Assert: Verify result is false
      expect(result).toBe(false);
    });
  });

  // =========================================================================
  // Tests: Soft Delete Handling
  // =========================================================================

  describe('Soft Delete Handling', () => {
    it('should remove user from department by setting valid_until', async () => {
      // Arrange: Mock the update
      mockDb.mockReturnValue(createMockQuery(1));

      // Act: Call the method
      await repository.removeUserFromDepartment('user-remove', 13);

      // Assert: Verify the method completed without error
      expect(mockDb).toHaveBeenCalled();
    });

    it('should preserve all data when soft deleting', async () => {
      // Arrange: Mock the update
      mockDb.mockReturnValue(createMockQuery(1));

      // Act: Call the method
      await repository.removeUserFromDepartment('user-preserve', 14);

      // Assert: Verify the method completed without error
      expect(mockDb).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // Tests: Error Handling
  // =========================================================================

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Arrange: Mock a database error
      const mockChain = createMockQuery(null);
      mockChain.then = jest.fn().mockImplementation((resolve, reject) => {
        reject(new Error('Database connection failed'));
      });
      mockDb.mockReturnValue(mockChain);

      // Act & Assert: Verify error is propagated
      await expect(
        repository.getPrimaryDepartment('user-error'),
      ).rejects.toThrow('Database connection failed');
    });

    it('should handle null results safely', async () => {
      // Arrange: Mock null result
      mockDb.mockReturnValue(createMockQuery(null));

      // Act: Call the method
      const result = await repository.getPrimaryDepartment('user-null');

      // Assert: Verify null is returned safely
      expect(result).toBeNull();
    });

    it('should handle empty array results safely', async () => {
      // Arrange: Mock empty array
      mockDb.mockReturnValue(createMockQuery([]));

      // Act: Call the method
      const result = await repository.getActiveDepartments('user-empty');

      // Assert: Verify empty array is returned
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });
});
