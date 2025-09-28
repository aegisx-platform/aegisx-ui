// Import and re-export types from schemas for convenience
import {
  type UserRoles,
  type CreateUserRoles,
  type UpdateUserRoles,
  type UserRolesIdParam,
  type GetUserRolesQuery,
  type ListUserRolesQuery,
} from '../schemas/userRoles.schemas';

export {
  type UserRoles,
  type CreateUserRoles,
  type UpdateUserRoles,
  type UserRolesIdParam,
  type GetUserRolesQuery,
  type ListUserRolesQuery,
};

// Additional type definitions
export interface UserRolesRepository {
  create(data: CreateUserRoles): Promise<UserRoles>;
  findById(id: number | string): Promise<UserRoles | null>;
  findMany(query: ListUserRolesQuery): Promise<{
    data: UserRoles[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  update(id: number | string, data: UpdateUserRoles): Promise<UserRoles | null>;
  delete(id: number | string): Promise<boolean>;
}

// Database entity type (matches database table structure exactly)
export interface UserRolesEntity {
  user_id: string;
  role_id: string;
  created_at: Date;
  updated_at: Date;
  id: string;
  is_active: boolean | null;
  assigned_at: Date | null;
  assigned_by: string | null;
  expires_at: Date | null;
}
