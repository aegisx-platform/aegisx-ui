// Import and re-export types from schemas for convenience
import {
  type DrugComponents,
  type CreateDrugComponents,
  type UpdateDrugComponents,
  type DrugComponentsIdParam,
  type GetDrugComponentsQuery,
  type ListDrugComponentsQuery,
} from '../schemas/drug-components.schemas';

export {
  type DrugComponents,
  type CreateDrugComponents,
  type UpdateDrugComponents,
  type DrugComponentsIdParam,
  type GetDrugComponentsQuery,
  type ListDrugComponentsQuery,
};

// Additional type definitions
export interface DrugComponentsRepository {
  create(data: CreateDrugComponents): Promise<DrugComponents>;
  findById(id: number | string): Promise<DrugComponents | null>;
  findMany(query: ListDrugComponentsQuery): Promise<{
    data: DrugComponents[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  update(
    id: number | string,
    data: UpdateDrugComponents,
  ): Promise<DrugComponents | null>;
  delete(id: number | string): Promise<boolean>;
}

// Database entity type (matches database table structure exactly)
export interface DrugComponentsEntity {
  id: number;
  generic_id: number;
  component_name: string;
  strength: string | null;
  strength_value: number | null;
  strength_unit: string | null;
  is_active: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

// ===== ERROR HANDLING: ERROR CODES =====
/**
 * Error codes for DrugComponents module
 * Auto-generated based on database constraints and business rules
 */
export enum DrugComponentsErrorCode {
  // Standard errors
  NOT_FOUND = 'DRUG_COMPONENTS_NOT_FOUND',
  VALIDATION_ERROR = 'DRUG_COMPONENTS_VALIDATION_ERROR',
}

/**
 * Error messages mapped to error codes
 */
export const DrugComponentsErrorMessages: Record<
  DrugComponentsErrorCode,
  string
> = {
  [DrugComponentsErrorCode.NOT_FOUND]: 'DrugComponents not found',
  [DrugComponentsErrorCode.VALIDATION_ERROR]:
    'DrugComponents validation failed',
};
