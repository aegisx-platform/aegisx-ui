const { knex } = require('./knex-connection');

/**
 * Get database schema for a specific table
 */
async function getDatabaseSchema(tableName) {
  try {
    // Check if table exists
    const tableExists = await knex.schema.hasTable(tableName);
    if (!tableExists) {
      return null;
    }

    // Get column information
    const columns = await knex.raw(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        udt_name
      FROM information_schema.columns 
      WHERE table_name = ? 
      ORDER BY ordinal_position
    `, [tableName]);

    // Get primary key information
    const primaryKeys = await knex.raw(`
      SELECT column_name
      FROM information_schema.key_column_usage kcu
      JOIN information_schema.table_constraints tc
        ON kcu.constraint_name = tc.constraint_name
      WHERE tc.table_name = ? 
        AND tc.constraint_type = 'PRIMARY KEY'
    `, [tableName]);

    // Get foreign key information
    const foreignKeys = await knex.raw(`
      SELECT 
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        tc.constraint_name
      FROM information_schema.key_column_usage kcu
      JOIN information_schema.constraint_column_usage ccu
        ON kcu.constraint_name = ccu.constraint_name
      JOIN information_schema.table_constraints tc
        ON kcu.constraint_name = tc.constraint_name
      WHERE kcu.table_name = ? 
        AND tc.constraint_type = 'FOREIGN KEY'
    `, [tableName]);

    // Get enum types and values
    const enumInfo = await knex.raw(`
      SELECT 
        c.column_name,
        t.typname as enum_name,
        array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values
      FROM information_schema.columns c
      JOIN pg_type t ON c.udt_name = t.typname
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE c.table_name = ?
        AND t.typtype = 'e'
      GROUP BY c.column_name, t.typname
    `, [tableName]);

    // Get check constraints that might define enum-like values
    const checkConstraints = await knex.raw(`
      SELECT 
        kcu.column_name,
        cc.check_clause
      FROM information_schema.check_constraints cc
      JOIN information_schema.constraint_column_usage kcu
        ON cc.constraint_name = kcu.constraint_name
      WHERE kcu.table_name = ?
        AND cc.check_clause LIKE '%IN (%'
    `, [tableName]);

    // Process columns with enhanced metadata
    const processedColumns = columns.rows.map(col => {
      const isFK = foreignKeys.rows.some(fk => fk.column_name === col.column_name);
      const fkInfo = foreignKeys.rows.find(fk => fk.column_name === col.column_name);
      const enumData = enumInfo.rows.find(e => e.column_name === col.column_name);
      const checkConstraint = checkConstraints.rows.find(c => c.column_name === col.column_name);

      // Extract enum values from check constraints
      let constraintValues = null;
      if (checkConstraint) {
        const match = checkConstraint.check_clause.match(/IN\s*\(([^)]+)\)/i);
        if (match) {
          constraintValues = match[1]
            .split(',')
            .map(val => val.trim().replace(/['"]/g, ''))
            .filter(val => val.length > 0);
        }
      }

      return {
        name: col.column_name,
        type: col.data_type,
        udtName: col.udt_name,
        isNullable: col.is_nullable === 'YES',
        defaultValue: col.column_default,
        maxLength: col.character_maximum_length,
        precision: col.numeric_precision,
        scale: col.numeric_scale,
        isPrimaryKey: primaryKeys.rows.some(pk => pk.column_name === col.column_name),
        isForeignKey: isFK,
        foreignKeyInfo: fkInfo ? {
          referencedTable: fkInfo.foreign_table_name,
          referencedColumn: fkInfo.foreign_column_name,
          constraintName: fkInfo.constraint_name
        } : null,
        isEnum: !!enumData || !!constraintValues,
        enumInfo: enumData ? {
          typeName: enumData.enum_name,
          values: enumData.enum_values
        } : null,
        constraintValues: constraintValues,
        // Smart field detection
        fieldType: determineFieldType(col, isFK, !!enumData || !!constraintValues),
        tsType: mapPostgresToTypeScript(col.data_type, col.udt_name),
        typeboxType: mapPostgresToTypeBox(col.data_type, col.udt_name, col.is_nullable === 'YES')
      };
    });

    return {
      tableName,
      columns: processedColumns,
      primaryKey: primaryKeys.rows.map(pk => pk.column_name),
      foreignKeys: foreignKeys.rows.map(fk => ({
        column: fk.column_name,
        referencedTable: fk.foreign_table_name,
        referencedColumn: fk.foreign_column_name
      }))
    };
  } catch (error) {
    throw new Error(`Failed to get schema for table ${tableName}: ${error.message}`);
  }
}

/**
 * List all tables in the database
 */
async function listTables() {
  try {
    const result = await knex.raw(`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    return result.rows.map(row => ({
      name: row.table_name,
      columns: parseInt(row.column_count)
    }));
  } catch (error) {
    throw new Error(`Failed to list tables: ${error.message}`);
  }
}

/**
 * Determine smart field type based on database metadata and conventions
 */
function determineFieldType(column, isForeignKey, isEnum) {
  const colName = column.column_name.toLowerCase();
  
  // Primary key fields
  if (colName === 'id') {
    return 'primary-key';
  }
  
  // Audit fields  
  if (['created_at', 'updated_at', 'deleted_at'].includes(colName)) {
    return 'audit-timestamp';
  }
  
  if (['created_by', 'updated_by', 'deleted_by'].includes(colName)) {
    return 'audit-user';
  }
  
  // Foreign key fields -> dropdown
  if (isForeignKey) {
    return 'foreign-key-dropdown';
  }
  
  // Enum fields -> select
  if (isEnum) {
    return 'enum-select';
  }
  
  // Email fields
  if (colName.includes('email')) {
    return 'email';
  }
  
  // Password fields
  if (colName.includes('password') || colName.includes('passwd')) {
    return 'password';
  }
  
  // URL fields
  if (colName.includes('url') || colName.includes('link')) {
    return 'url';
  }
  
  // Boolean fields
  if (column.data_type === 'boolean') {
    return 'boolean';
  }
  
  // Date/time fields
  if (['timestamp without time zone', 'timestamp with time zone', 'date'].includes(column.data_type)) {
    return 'datetime';
  }
  
  // Text area fields (based on name patterns)
  if (['description', 'content', 'body', 'message', 'notes', 'comment'].some(pattern => 
    colName.includes(pattern))) {
    return 'textarea';
  }
  
  // Number fields
  if (['integer', 'bigint', 'smallint', 'decimal', 'numeric', 'real', 'double precision'].includes(column.data_type)) {
    return 'number';
  }
  
  // Default to text input
  return 'text';
}

/**
 * Get dropdown endpoint for foreign key field
 */
function getDropdownEndpoint(foreignKeyInfo) {
  if (!foreignKeyInfo) return null;
  
  const { referencedTable } = foreignKeyInfo;
  
  // Convert table name to API endpoint
  // e.g., 'users' -> '/users/dropdown'
  return `/${referencedTable}/dropdown`;
}

/**
 * Check if a table has a dropdown endpoint available
 */
async function hasDropdownEndpoint(tableName) {
  try {
    // Check if the referenced table exists and has basic structure for dropdown
    const schema = await getDatabaseSchema(tableName);
    if (!schema) return false;
    
    // Look for common display fields (name, title, etc.)
    const hasDisplayField = schema.columns.some(col => 
      ['name', 'title', 'first_name', 'username', 'email'].includes(col.name)
    );
    
    return hasDisplayField;
  } catch (error) {
    return false;
  }
}

/**
 * Get suggested display fields for dropdown
 */
function getDropdownDisplayFields(referencedTableName, referencedSchema) {
  if (!referencedSchema) return ['id'];
  
  const priorityFields = [
    'name', 'title', 'first_name', 'username', 'email', 
    'description', 'label', 'display_name'
  ];
  
  const availableFields = [];
  
  // Add priority fields that exist
  priorityFields.forEach(field => {
    if (referencedSchema.columns.some(col => col.name === field)) {
      availableFields.push(field);
    }
  });
  
  // If no priority fields found, use first string field after id
  if (availableFields.length === 0) {
    const firstStringField = referencedSchema.columns.find(col => 
      col.name !== 'id' && 
      ['character varying', 'varchar', 'text'].includes(col.type)
    );
    
    if (firstStringField) {
      availableFields.push(firstStringField.name);
    }
  }
  
  // Always include id as fallback
  if (!availableFields.includes('id')) {
    availableFields.unshift('id');
  }
  
  return availableFields.slice(0, 3); // Limit to 3 fields for dropdown label
}

/**
 * Map PostgreSQL types to TypeScript types
 */
function mapPostgresToTypeScript(dataType, udtName) {
  const typeMap = {
    'integer': 'number',
    'bigint': 'number',
    'smallint': 'number',
    'decimal': 'number',
    'numeric': 'number',
    'real': 'number',
    'double precision': 'number',
    'serial': 'number',
    'bigserial': 'number',
    'character varying': 'string',
    'varchar': 'string',
    'character': 'string',
    'char': 'string',
    'text': 'string',
    'boolean': 'boolean',
    'timestamp without time zone': 'Date',
    'timestamp with time zone': 'Date',
    'date': 'Date',
    'time': 'string',
    'json': 'Record<string, any>',
    'jsonb': 'Record<string, any>',
    'uuid': 'string',
    'bytea': 'Buffer',
    'array': 'any[]'
  };

  // Handle arrays
  if (udtName && udtName.startsWith('_')) {
    const baseType = udtName.substring(1);
    const tsBaseType = typeMap[baseType] || 'any';
    return `${tsBaseType}[]`;
  }

  return typeMap[dataType] || typeMap[udtName] || 'any';
}

/**
 * Map PostgreSQL types to TypeBox types
 */
function mapPostgresToTypeBox(dataType, udtName, isNullable) {
  const typeMap = {
    'integer': 'Type.Integer()',
    'bigint': 'Type.Number()',
    'smallint': 'Type.Integer()',
    'decimal': 'Type.Number()',
    'numeric': 'Type.Number()',
    'real': 'Type.Number()',
    'double precision': 'Type.Number()',
    'serial': 'Type.Integer()',
    'bigserial': 'Type.Number()',
    'character varying': 'Type.String()',
    'varchar': 'Type.String()',
    'character': 'Type.String()',
    'char': 'Type.String()',
    'text': 'Type.String()',
    'boolean': 'Type.Boolean()',
    'timestamp without time zone': 'Type.String({ format: "date-time" })',
    'timestamp with time zone': 'Type.String({ format: "date-time" })',
    'date': 'Type.String({ format: "date" })',
    'time': 'Type.String()',
    'json': 'Type.Record(Type.String(), Type.Any())',
    'jsonb': 'Type.Record(Type.String(), Type.Any())',
    'uuid': 'Type.String({ format: "uuid" })',
    'bytea': 'Type.String()',
    'array': 'Type.Array(Type.Any())'
  };

  let typeboxType = typeMap[dataType] || typeMap[udtName] || 'Type.Any()';

  // Handle arrays
  if (udtName && udtName.startsWith('_')) {
    const baseType = udtName.substring(1);
    const baseTypeBox = typeMap[baseType] || 'Type.Any()';
    typeboxType = `Type.Array(${baseTypeBox})`;
  }

  // Handle nullable types
  if (isNullable) {
    typeboxType = `Type.Optional(${typeboxType})`;
  }

  return typeboxType;
}

/**
 * Get enhanced schema with smart field detection and FK analysis
 */
async function getEnhancedSchema(tableName) {
  try {
    console.log(`🔍 Analyzing table: ${tableName}`);
    
    // Get basic schema
    const schema = await getDatabaseSchema(tableName);
    if (!schema) {
      throw new Error(`Table ${tableName} not found`);
    }
    
    // Enhance FK columns with dropdown information
    const enhancedColumns = await Promise.all(
      schema.columns.map(async (column) => {
        if (column.isForeignKey && column.foreignKeyInfo) {
          const { referencedTable } = column.foreignKeyInfo;
          
          try {
            // Get referenced table schema for dropdown analysis
            const referencedSchema = await getDatabaseSchema(referencedTable);
            const hasDropdown = await hasDropdownEndpoint(referencedTable);
            const displayFields = getDropdownDisplayFields(referencedTable, referencedSchema);
            
            return {
              ...column,
              dropdownInfo: {
                endpoint: getDropdownEndpoint(column.foreignKeyInfo),
                hasEndpoint: hasDropdown,
                displayFields: displayFields,
                referencedSchema: referencedSchema
              }
            };
          } catch (error) {
            console.warn(`⚠️ Could not analyze FK table ${referencedTable}:`, error.message);
            return {
              ...column,
              dropdownInfo: {
                endpoint: getDropdownEndpoint(column.foreignKeyInfo),
                hasEndpoint: false,
                displayFields: ['id'],
                referencedSchema: null
              }
            };
          }
        }
        
        return column;
      })
    );
    
    // Analyze table capabilities
    const capabilities = {
      hasAuditFields: enhancedColumns.some(col => col.fieldType === 'audit-timestamp'),
      hasUserAuditFields: enhancedColumns.some(col => col.fieldType === 'audit-user'),
      hasForeignKeys: enhancedColumns.some(col => col.isForeignKey),
      hasEnums: enhancedColumns.some(col => col.isEnum),
      foreignKeyCount: enhancedColumns.filter(col => col.isForeignKey).length,
      enumCount: enhancedColumns.filter(col => col.isEnum).length,
      dropdownFields: enhancedColumns.filter(col => col.fieldType === 'foreign-key-dropdown'),
      selectFields: enhancedColumns.filter(col => col.fieldType === 'enum-select')
    };
    
    console.log(`✅ Enhanced analysis complete for ${tableName}:`);
    console.log(`   - Foreign Keys: ${capabilities.foreignKeyCount}`);
    console.log(`   - Enums: ${capabilities.enumCount}`);
    console.log(`   - Dropdown fields: ${capabilities.dropdownFields.map(f => f.name).join(', ')}`);
    console.log(`   - Select fields: ${capabilities.selectFields.map(f => f.name).join(', ')}`);
    
    return {
      ...schema,
      columns: enhancedColumns,
      capabilities,
      enhancedMetadata: {
        analyzedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };
  } catch (error) {
    throw new Error(`Failed to get enhanced schema for table ${tableName}: ${error.message}`);
  }
}

/**
 * Validate that required dropdown endpoints exist for FK fields
 */
async function validateDropdownEndpoints(enhancedSchema) {
  const results = {
    valid: true,
    missing: [],
    warnings: []
  };
  
  for (const column of enhancedSchema.columns) {
    if (column.fieldType === 'foreign-key-dropdown' && column.dropdownInfo) {
      if (!column.dropdownInfo.hasEndpoint) {
        results.valid = false;
        results.missing.push({
          field: column.name,
          referencedTable: column.foreignKeyInfo.referencedTable,
          suggestedEndpoint: column.dropdownInfo.endpoint
        });
      }
      
      if (column.dropdownInfo.displayFields.length === 1 && column.dropdownInfo.displayFields[0] === 'id') {
        results.warnings.push({
          field: column.name,
          referencedTable: column.foreignKeyInfo.referencedTable,
          issue: 'Only ID field available for dropdown display'
        });
      }
    }
  }
  
  return results;
}

module.exports = {
  getDatabaseSchema,
  getEnhancedSchema,
  validateDropdownEndpoints,
  listTables,
  mapPostgresToTypeScript,
  mapPostgresToTypeBox,
  determineFieldType,
  getDropdownEndpoint,
  hasDropdownEndpoint,
  getDropdownDisplayFields
};