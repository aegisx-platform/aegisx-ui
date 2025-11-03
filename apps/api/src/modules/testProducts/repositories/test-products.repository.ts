import {
  BaseRepository,
  BaseListQuery,
  PaginatedListResult,
} from '../../../shared/repositories/base.repository';
import type { Knex } from 'knex';
import {
  type CreateTestProducts,
  type UpdateTestProducts,
  type TestProducts,
  type GetTestProductsQuery,
  type ListTestProductsQuery,
  type TestProductsEntity,
} from '../types/test-products.types';

export interface TestProductsListQuery extends BaseListQuery {
  // Smart field-based filters for TestProducts
  sku?: string;
  name?: string;
  barcode?: string;
  manufacturer?: string;
  description?: string;
  long_description?: string;
  specifications?: string;
  quantity?: number;
  quantity_min?: number;
  quantity_max?: number;
  min_quantity?: number;
  min_quantity_min?: number;
  min_quantity_max?: number;
  max_quantity?: number;
  max_quantity_min?: number;
  max_quantity_max?: number;
  price?: number;
  price_min?: number;
  price_max?: number;
  cost?: number;
  cost_min?: number;
  cost_max?: number;
  weight?: number;
  weight_min?: number;
  weight_max?: number;
  discount_percentage?: number;
  discount_percentage_min?: number;
  discount_percentage_max?: number;
  is_active?: boolean;
  is_featured?: boolean;
  is_taxable?: boolean;
  is_shippable?: boolean;
  allow_backorder?: boolean;
  status?: string;
  condition?: string;
  availability?: string;
  category_id?: string;
  parent_product_id?: string;
  supplier_id?: string;
  created_by?: string;
  updated_by?: string;
}

export class TestProductsRepository extends BaseRepository<
  TestProducts,
  CreateTestProducts,
  UpdateTestProducts
> {
  constructor(knex: Knex) {
    super(
      knex,
      'test_products',
      [
        // Define searchable fields based on intelligent detection
        'test_products.name',
        'test_products.description',
        'test_products.long_description',
      ],
      [], // explicitUUIDFields
      {
        // Field configuration for automatic timestamp and audit field management
        hasCreatedAt: true,
        hasUpdatedAt: true,
        hasCreatedBy: true,
        hasUpdatedBy: true,
      },
    );
  }

  // Transform database row to entity
  transformToEntity(dbRow: any): TestProducts {
    if (!dbRow) throw new Error('Cannot transform null database row');

    return {
      id: dbRow.id,
      sku: dbRow.sku,
      name: dbRow.name,
      barcode: dbRow.barcode,
      manufacturer: dbRow.manufacturer,
      description: dbRow.description,
      long_description: dbRow.long_description,
      specifications: dbRow.specifications,
      quantity: dbRow.quantity,
      min_quantity: dbRow.min_quantity,
      max_quantity: dbRow.max_quantity,
      price: dbRow.price,
      cost: dbRow.cost,
      weight: dbRow.weight,
      discount_percentage: dbRow.discount_percentage,
      is_active: dbRow.is_active,
      is_featured: dbRow.is_featured,
      is_taxable: dbRow.is_taxable,
      is_shippable: dbRow.is_shippable,
      allow_backorder: dbRow.allow_backorder,
      status: dbRow.status,
      condition: dbRow.condition,
      availability: dbRow.availability,
      launch_date: dbRow.launch_date,
      discontinued_date: dbRow.discontinued_date,
      last_stock_check: dbRow.last_stock_check,
      next_restock_date: dbRow.next_restock_date,
      attributes: dbRow.attributes,
      tags: dbRow.tags,
      images: dbRow.images,
      pricing_tiers: dbRow.pricing_tiers,
      dimensions: dbRow.dimensions,
      seo_metadata: dbRow.seo_metadata,
      category_id: dbRow.category_id,
      parent_product_id: dbRow.parent_product_id,
      supplier_id: dbRow.supplier_id,
      created_by: dbRow.created_by,
      updated_by: dbRow.updated_by,
      deleted_at: dbRow.deleted_at,
      created_at: dbRow.created_at,
      updated_at: dbRow.updated_at,
    };
  }

  // Transform DTO to database format
  transformToDb(
    dto: CreateTestProducts | UpdateTestProducts,
  ): Partial<TestProductsEntity> {
    const transformed: Partial<TestProductsEntity> = {};

    if ('sku' in dto && dto.sku !== undefined) {
      transformed.sku = dto.sku;
    }
    if ('name' in dto && dto.name !== undefined) {
      transformed.name = dto.name;
    }
    if ('barcode' in dto && dto.barcode !== undefined) {
      transformed.barcode = dto.barcode;
    }
    if ('manufacturer' in dto && dto.manufacturer !== undefined) {
      transformed.manufacturer = dto.manufacturer;
    }
    if ('description' in dto && dto.description !== undefined) {
      transformed.description = dto.description;
    }
    if ('long_description' in dto && dto.long_description !== undefined) {
      transformed.long_description = dto.long_description;
    }
    if ('specifications' in dto && dto.specifications !== undefined) {
      transformed.specifications = dto.specifications;
    }
    if ('quantity' in dto && dto.quantity !== undefined) {
      transformed.quantity = dto.quantity;
    }
    if ('min_quantity' in dto && dto.min_quantity !== undefined) {
      transformed.min_quantity = dto.min_quantity;
    }
    if ('max_quantity' in dto && dto.max_quantity !== undefined) {
      transformed.max_quantity = dto.max_quantity;
    }
    if ('price' in dto && dto.price !== undefined) {
      transformed.price = dto.price;
    }
    if ('cost' in dto && dto.cost !== undefined) {
      transformed.cost = dto.cost;
    }
    if ('weight' in dto && dto.weight !== undefined) {
      transformed.weight = dto.weight;
    }
    if ('discount_percentage' in dto && dto.discount_percentage !== undefined) {
      transformed.discount_percentage = dto.discount_percentage;
    }
    if ('is_active' in dto && dto.is_active !== undefined) {
      transformed.is_active = dto.is_active;
    }
    if ('is_featured' in dto && dto.is_featured !== undefined) {
      transformed.is_featured = dto.is_featured;
    }
    if ('is_taxable' in dto && dto.is_taxable !== undefined) {
      transformed.is_taxable = dto.is_taxable;
    }
    if ('is_shippable' in dto && dto.is_shippable !== undefined) {
      transformed.is_shippable = dto.is_shippable;
    }
    if ('allow_backorder' in dto && dto.allow_backorder !== undefined) {
      transformed.allow_backorder = dto.allow_backorder;
    }
    if ('status' in dto && dto.status !== undefined) {
      transformed.status = dto.status;
    }
    if ('condition' in dto && dto.condition !== undefined) {
      transformed.condition = dto.condition;
    }
    if ('availability' in dto && dto.availability !== undefined) {
      transformed.availability = dto.availability;
    }
    if ('launch_date' in dto && dto.launch_date !== undefined) {
      transformed.launch_date =
        typeof dto.launch_date === 'string'
          ? new Date(dto.launch_date)
          : dto.launch_date;
    }
    if ('discontinued_date' in dto && dto.discontinued_date !== undefined) {
      transformed.discontinued_date =
        typeof dto.discontinued_date === 'string'
          ? new Date(dto.discontinued_date)
          : dto.discontinued_date;
    }
    if ('last_stock_check' in dto && dto.last_stock_check !== undefined) {
      transformed.last_stock_check =
        typeof dto.last_stock_check === 'string'
          ? new Date(dto.last_stock_check)
          : dto.last_stock_check;
    }
    if ('next_restock_date' in dto && dto.next_restock_date !== undefined) {
      transformed.next_restock_date =
        typeof dto.next_restock_date === 'string'
          ? new Date(dto.next_restock_date)
          : dto.next_restock_date;
    }
    if ('attributes' in dto && dto.attributes !== undefined) {
      transformed.attributes = dto.attributes;
    }
    if ('tags' in dto && dto.tags !== undefined) {
      transformed.tags = dto.tags;
    }
    if ('images' in dto && dto.images !== undefined) {
      transformed.images = dto.images;
    }
    if ('pricing_tiers' in dto && dto.pricing_tiers !== undefined) {
      transformed.pricing_tiers = dto.pricing_tiers;
    }
    if ('dimensions' in dto && dto.dimensions !== undefined) {
      transformed.dimensions = dto.dimensions;
    }
    if ('seo_metadata' in dto && dto.seo_metadata !== undefined) {
      transformed.seo_metadata = dto.seo_metadata;
    }
    if ('category_id' in dto && dto.category_id !== undefined) {
      transformed.category_id = dto.category_id;
    }
    if ('parent_product_id' in dto && dto.parent_product_id !== undefined) {
      transformed.parent_product_id = dto.parent_product_id;
    }
    if ('supplier_id' in dto && dto.supplier_id !== undefined) {
      transformed.supplier_id = dto.supplier_id;
    }
    if ('created_by' in dto && dto.created_by !== undefined) {
      transformed.created_by = dto.created_by;
    }
    if ('updated_by' in dto && dto.updated_by !== undefined) {
      transformed.updated_by = dto.updated_by;
    }
    if ('deleted_at' in dto && dto.deleted_at !== undefined) {
      transformed.deleted_at =
        typeof dto.deleted_at === 'string'
          ? new Date(dto.deleted_at)
          : dto.deleted_at;
    }
    // updated_at is handled automatically by database

    return transformed;
  }

  // Custom query with joins if needed
  getJoinQuery() {
    return this.knex('test_products').select('test_products.*');
    // Add joins here if needed
    // .leftJoin('other_table', 'test_products.foreign_key', 'other_table.id')
  }

  // Apply custom filters
  protected applyCustomFilters(
    query: any,
    filters: TestProductsListQuery,
  ): void {
    // Apply base filters first
    super.applyCustomFilters(query, filters);

    // Apply specific TestProducts filters based on intelligent field categorization
    if (filters.sku !== undefined) {
      query.where('test_products.sku', filters.sku);
    }
    if (filters.name !== undefined) {
      query.where('test_products.name', filters.name);
    }
    if (filters.barcode !== undefined) {
      query.where('test_products.barcode', filters.barcode);
    }
    if (filters.manufacturer !== undefined) {
      query.where('test_products.manufacturer', filters.manufacturer);
    }
    if (filters.description !== undefined) {
      query.where('test_products.description', filters.description);
    }
    if (filters.long_description !== undefined) {
      query.where('test_products.long_description', filters.long_description);
    }
    if (filters.specifications !== undefined) {
      query.where('test_products.specifications', filters.specifications);
    }
    if (filters.quantity !== undefined) {
      query.where('test_products.quantity', filters.quantity);
    }
    if (filters.quantity_min !== undefined) {
      query.where('test_products.quantity', '>=', filters.quantity_min);
    }
    if (filters.quantity_max !== undefined) {
      query.where('test_products.quantity', '<=', filters.quantity_max);
    }
    if (filters.min_quantity !== undefined) {
      query.where('test_products.min_quantity', filters.min_quantity);
    }
    if (filters.min_quantity_min !== undefined) {
      query.where('test_products.min_quantity', '>=', filters.min_quantity_min);
    }
    if (filters.min_quantity_max !== undefined) {
      query.where('test_products.min_quantity', '<=', filters.min_quantity_max);
    }
    if (filters.max_quantity !== undefined) {
      query.where('test_products.max_quantity', filters.max_quantity);
    }
    if (filters.max_quantity_min !== undefined) {
      query.where('test_products.max_quantity', '>=', filters.max_quantity_min);
    }
    if (filters.max_quantity_max !== undefined) {
      query.where('test_products.max_quantity', '<=', filters.max_quantity_max);
    }
    if (filters.price !== undefined) {
      query.where('test_products.price', filters.price);
    }
    if (filters.price_min !== undefined) {
      query.where('test_products.price', '>=', filters.price_min);
    }
    if (filters.price_max !== undefined) {
      query.where('test_products.price', '<=', filters.price_max);
    }
    if (filters.cost !== undefined) {
      query.where('test_products.cost', filters.cost);
    }
    if (filters.cost_min !== undefined) {
      query.where('test_products.cost', '>=', filters.cost_min);
    }
    if (filters.cost_max !== undefined) {
      query.where('test_products.cost', '<=', filters.cost_max);
    }
    if (filters.weight !== undefined) {
      query.where('test_products.weight', filters.weight);
    }
    if (filters.weight_min !== undefined) {
      query.where('test_products.weight', '>=', filters.weight_min);
    }
    if (filters.weight_max !== undefined) {
      query.where('test_products.weight', '<=', filters.weight_max);
    }
    if (filters.discount_percentage !== undefined) {
      query.where(
        'test_products.discount_percentage',
        filters.discount_percentage,
      );
    }
    if (filters.discount_percentage_min !== undefined) {
      query.where(
        'test_products.discount_percentage',
        '>=',
        filters.discount_percentage_min,
      );
    }
    if (filters.discount_percentage_max !== undefined) {
      query.where(
        'test_products.discount_percentage',
        '<=',
        filters.discount_percentage_max,
      );
    }
    if (filters.is_active !== undefined) {
      query.where('test_products.is_active', filters.is_active);
    }
    if (filters.is_featured !== undefined) {
      query.where('test_products.is_featured', filters.is_featured);
    }
    if (filters.is_taxable !== undefined) {
      query.where('test_products.is_taxable', filters.is_taxable);
    }
    if (filters.is_shippable !== undefined) {
      query.where('test_products.is_shippable', filters.is_shippable);
    }
    if (filters.allow_backorder !== undefined) {
      query.where('test_products.allow_backorder', filters.allow_backorder);
    }
    if (filters.status !== undefined) {
      query.where('test_products.status', filters.status);
    }
    if (filters.condition !== undefined) {
      query.where('test_products.condition', filters.condition);
    }
    if (filters.availability !== undefined) {
      query.where('test_products.availability', filters.availability);
    }
    if (filters.category_id !== undefined) {
      query.where('test_products.category_id', filters.category_id);
    }
    if (filters.parent_product_id !== undefined) {
      query.where('test_products.parent_product_id', filters.parent_product_id);
    }
    if (filters.supplier_id !== undefined) {
      query.where('test_products.supplier_id', filters.supplier_id);
    }
    if (filters.created_by !== undefined) {
      query.where('test_products.created_by', filters.created_by);
    }
    if (filters.updated_by !== undefined) {
      query.where('test_products.updated_by', filters.updated_by);
    }
  }

  // Apply multiple sort parsing
  protected applyMultipleSort(query: any, sort?: string): void {
    if (sort) {
      if (sort.includes(',')) {
        // Multiple sort format: field1:desc,field2:asc,field3:desc
        const sortPairs = sort.split(',');
        sortPairs.forEach((pair) => {
          const [field, direction] = pair.split(':');
          const mappedField = this.getSortField(field.trim());
          const sortDirection =
            direction?.trim().toLowerCase() === 'asc' ? 'asc' : 'desc';
          query.orderBy(mappedField, sortDirection);
        });
      } else {
        // Single sort field
        const [field, direction] = sort.split(':');
        const mappedField = this.getSortField(field.trim());
        const sortDirection =
          direction?.trim().toLowerCase() === 'asc' ? 'asc' : 'desc';
        query.orderBy(mappedField, sortDirection);
      }
    } else {
      // Default sort
      query.orderBy(this.getSortField('created_at'), 'desc');
    }
  }

  // Custom sort fields mapping
  protected getSortField(sortBy: string): string {
    const sortFields: Record<string, string> = {
      id: 'test_products.id',
      sku: 'test_products.sku',
      name: 'test_products.name',
      barcode: 'test_products.barcode',
      manufacturer: 'test_products.manufacturer',
      description: 'test_products.description',
      longDescription: 'test_products.long_description',
      specifications: 'test_products.specifications',
      quantity: 'test_products.quantity',
      minQuantity: 'test_products.min_quantity',
      maxQuantity: 'test_products.max_quantity',
      price: 'test_products.price',
      cost: 'test_products.cost',
      weight: 'test_products.weight',
      discountPercentage: 'test_products.discount_percentage',
      isActive: 'test_products.is_active',
      isFeatured: 'test_products.is_featured',
      isTaxable: 'test_products.is_taxable',
      isShippable: 'test_products.is_shippable',
      allowBackorder: 'test_products.allow_backorder',
      status: 'test_products.status',
      condition: 'test_products.condition',
      availability: 'test_products.availability',
      launchDate: 'test_products.launch_date',
      discontinuedDate: 'test_products.discontinued_date',
      lastStockCheck: 'test_products.last_stock_check',
      nextRestockDate: 'test_products.next_restock_date',
      attributes: 'test_products.attributes',
      tags: 'test_products.tags',
      images: 'test_products.images',
      pricingTiers: 'test_products.pricing_tiers',
      dimensions: 'test_products.dimensions',
      seoMetadata: 'test_products.seo_metadata',
      categoryId: 'test_products.category_id',
      parentProductId: 'test_products.parent_product_id',
      supplierId: 'test_products.supplier_id',
      createdBy: 'test_products.created_by',
      updatedBy: 'test_products.updated_by',
      deletedAt: 'test_products.deleted_at',
      createdAt: 'test_products.created_at',
      updatedAt: 'test_products.updated_at',
    };

    return sortFields[sortBy] || 'test_products.id';
  }

  // Extended find method with options
  async findById(
    id: number | string,
    options: GetTestProductsQuery = {},
  ): Promise<TestProducts | null> {
    let query = this.getJoinQuery();
    query = query.where('test_products.id', id);

    // Handle include options
    if (options.include) {
      const includes = Array.isArray(options.include)
        ? options.include
        : [options.include];
      includes.forEach((relation) => {
        // TODO: Add join logic for relationships
        // Example: if (relation === 'category') query.leftJoin('categories', 'items.category_id', 'categories.id');
      });
    }

    const row = await query.first();
    return row ? this.transformToEntity(row) : null;
  }

  // Extended list method with specific query type
  async list(
    query: TestProductsListQuery = {},
  ): Promise<PaginatedListResult<TestProducts>> {
    return super.list(query);
  }

  // Business-specific methods for unique/important fields

  async findByName(name: string): Promise<TestProducts | null> {
    const query = this.getJoinQuery();
    const row = await query.where('test_products.name', name).first();
    return row ? this.transformToEntity(row) : null;
  }

  // ===== ERROR HANDLING: DUPLICATE DETECTION METHODS =====

  /**
   * Find by unique field: sku
   * Used for duplicate detection before insert/update
   */
  async findBySku(sku: string | number): Promise<TestProducts | null> {
    const query = this.getJoinQuery();
    const row = await query.where('test_products.sku', sku).first();
    return row ? this.transformToEntity(row) : null;
  }

  // ===== ERROR HANDLING: DELETE VALIDATION METHODS =====

  /**
   * Check if record can be deleted
   * Returns foreign key references that would prevent deletion
   */
  async canBeDeleted(id: string | number): Promise<{
    canDelete: boolean;
    blockedBy: Array<{
      table: string;
      field: string;
      count: number;
      cascade: boolean;
    }>;
  }> {
    const blockedBy: Array<{
      table: string;
      field: string;
      count: number;
      cascade: boolean;
    }> = [];

    // Check test_products references
    const testProductsCount = await this.knex('test_products')
      .where('parent_product_id', id)
      .count('* as count')
      .first();

    if (parseInt((testProductsCount?.count as string) || '0') > 0) {
      blockedBy.push({
        table: 'test_products',
        field: 'parent_product_id',
        count: parseInt((testProductsCount?.count as string) || '0'),
        cascade: false,
      });
    }

    return {
      canDelete:
        blockedBy.length === 0 || blockedBy.every((ref) => ref.cascade),
      blockedBy,
    };
  }

  // Basic Statistics - count only
  async getStats(): Promise<{
    total: number;
  }> {
    const stats: any = await this.knex('test_products')
      .select([this.knex.raw('COUNT(*) as total')])
      .first();

    return {
      total: parseInt(stats?.total || '0'),
    };
  }

  // Bulk operations with better type safety
  async createMany(data: CreateTestProducts[]): Promise<TestProducts[]> {
    const transformedData = data.map((item) => this.transformToDb(item));
    const rows = await this.knex('test_products')
      .insert(transformedData)
      .returning('*');
    return rows.map((row) => this.transformToEntity(row));
  }

  // Transaction support for complex operations
  async createWithTransaction(data: CreateTestProducts): Promise<TestProducts> {
    return this.withTransaction(async (trx) => {
      const transformedData = this.transformToDb(data);
      const [row] = await trx('test_products')
        .insert(transformedData)
        .returning('*');
      return this.transformToEntity(row);
    });
  }
}
