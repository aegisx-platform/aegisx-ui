import { Injectable } from '@angular/core';

export interface SampleDataGenerationResult {
  sampleData: Record<string, unknown>;
  variables: Set<string>;
  nestedObjects: Map<string, Set<string>>;
  helperCalls: Map<string, string[]>;
}

/**
 * Service for generating sample data and schemas from PDF templates
 */
@Injectable({
  providedIn: 'root',
})
export class PdfTemplateGeneratorService {
  private readonly knownHelpers = [
    'add',
    'subtract',
    'multiply',
    'divide',
    'formatDate',
    'formatCurrency',
    'formatNumber',
    'formatPercent',
    'uppercase',
    'lowercase',
    'truncate',
    'eq',
    'gt',
    'lt',
    'gte',
    'lte',
    'ne',
    'or',
    'and',
    'not',
    'logo',
    'default',
    'json',
  ];

  /**
   * Generate sample data from Handlebars template string
   */
  generateSampleData(templateDataRaw: string): SampleDataGenerationResult {
    const handlebarsRegex = /\{\{([^}]+)\}\}/g;
    const matches = templateDataRaw.matchAll(handlebarsRegex);

    const variables = new Set<string>();
    const nestedObjects = new Map<string, Set<string>>();
    const helperCalls = new Map<string, string[]>();

    for (const match of matches) {
      const content = match[1].trim();

      // Skip control structure endings and special tags
      if (
        content.startsWith('/') ||
        content.startsWith('else') ||
        content.startsWith('!') ||
        content.startsWith('^')
      ) {
        continue;
      }

      // Handle block helpers (#each, #if, #unless)
      if (content.startsWith('#')) {
        const helperMatch = content.match(/^#(\w+)\s+(.+)/);
        if (helperMatch) {
          const helperName = helperMatch[1];
          const variable = helperMatch[2].trim();

          if (helperName === 'each') {
            if (!nestedObjects.has(variable)) {
              nestedObjects.set(variable, new Set());
            }
          } else {
            variables.add(variable);
          }
        }
        continue;
      }

      // Check if it's a helper call
      const parts = content.split(/\s+/);
      if (parts.length >= 2 && this.knownHelpers.includes(parts[0])) {
        const helperName = parts[0];
        const args = parts
          .slice(1)
          .filter(
            (arg: string) => !arg.startsWith('@') && !arg.match(/^[\d.]+$/),
          );

        if (!helperCalls.has(helperName)) {
          helperCalls.set(helperName, []);
        }

        for (const arg of args) {
          helperCalls.get(helperName)?.push(arg);
          if (arg.includes('.')) {
            const [obj, prop] = arg.split('.');
            if (!nestedObjects.has(obj)) {
              nestedObjects.set(obj, new Set());
            }
            nestedObjects.get(obj)?.add(prop);
          } else {
            variables.add(arg);
          }
        }
        continue;
      }

      // Handle nested properties (object.property)
      if (content.includes('.')) {
        const parts = content.split('.');
        let rootObject = parts[0];

        // Handle 'this.property' inside #each blocks
        if (rootObject === 'this') {
          const eachMatch = templateDataRaw.match(/\{\{#each\s+(\w+)\}\}/);
          if (eachMatch) {
            rootObject = eachMatch[1];
          } else {
            continue;
          }
        }

        const property = parts.slice(1).join('.');

        if (!nestedObjects.has(rootObject)) {
          nestedObjects.set(rootObject, new Set());
        }
        nestedObjects.get(rootObject)?.add(property);
      } else {
        // Simple variable
        variables.add(content);
      }
    }

    // Build sample data structure
    const sampleData: Record<string, unknown> = {};

    // Add simple variables
    for (const variable of variables) {
      // Skip if it's a nested object root
      if (nestedObjects.has(variable)) {
        continue;
      }

      // Skip special variables and helpers
      if (variable.startsWith('@') || this.knownHelpers.includes(variable)) {
        continue;
      }

      // Skip logo_file_id (auto-injected by system)
      if (variable === 'logo_file_id') {
        continue;
      }

      sampleData[variable] = this.generateSampleValue(variable);
    }

    // Add nested objects/arrays
    for (const [objectName, properties] of nestedObjects.entries()) {
      const objectData: Record<string, unknown> = {};

      for (const property of properties) {
        objectData[property] = this.generateSampleValue(property);
      }

      // Create array of sample objects (typically for #each loops)
      if (Object.keys(objectData).length > 0) {
        sampleData[objectName] = [
          { ...objectData },
          { ...objectData },
          { ...objectData },
        ];
      }
    }

    return {
      sampleData,
      variables,
      nestedObjects,
      helperCalls,
    };
  }

  /**
   * Generate sample value based on variable name heuristics
   * Note: logo_file_id is NOT generated here - it's injected automatically by the template system
   */
  private generateSampleValue(variableName: string): string {
    const lower = variableName.toLowerCase();

    // File IDs (excluding logo)
    if (
      lower.includes('file') &&
      lower.includes('id') &&
      !lower.includes('logo')
    ) {
      return 'sample-file-uuid-5678';
    }

    // Logo (base64 1x1 transparent PNG)
    if (lower.includes('logo')) {
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }

    // Dates
    if (lower.includes('date') || lower === 'd' || lower === 'dt') {
      return '2024-01-15';
    }

    // Numbers, IDs, quantities, amounts
    if (
      lower.includes('number') ||
      lower.includes('no') ||
      lower.includes('id') ||
      lower.includes('qty') ||
      lower.includes('quantity') ||
      lower.includes('amount') ||
      lower.includes('price') ||
      lower.includes('total') ||
      lower.includes('subtotal') ||
      lower.includes('tax') ||
      lower.includes('vat')
    ) {
      if (
        lower.includes('amount') ||
        lower.includes('price') ||
        lower.includes('total') ||
        lower.includes('tax') ||
        lower.includes('vat')
      ) {
        return '1,000.00';
      }
      if (lower.includes('id')) {
        return 'uuid-' + Math.random().toString(36).substring(7);
      }
      return '001';
    }

    // Email
    if (lower.includes('email')) {
      return 'example@email.com';
    }

    // Phone numbers
    if (
      lower.includes('phone') ||
      lower.includes('tel') ||
      lower.includes('mobile')
    ) {
      return '02-123-4567';
    }

    // Names
    if (lower.includes('name')) {
      if (lower.includes('company') || lower.includes('business')) {
        return 'บริษัท ตัวอย่าง จำกัด';
      }
      return 'ชื่อตัวอย่าง';
    }

    // Addresses
    if (lower.includes('address')) {
      return '123 ถนนตัวอย่าง กรุงเทพฯ 10110';
    }

    // Titles/Headers
    if (lower.includes('title') || lower.includes('header')) {
      return 'หัวข้อเอกสาร';
    }

    // Descriptions/Content
    if (
      lower.includes('description') ||
      lower.includes('content') ||
      lower.includes('detail') ||
      lower.includes('note') ||
      lower.includes('remark')
    ) {
      return 'ข้อความตัวอย่าง';
    }

    // References
    if (lower.includes('ref') || lower.includes('reference')) {
      return 'REF-001';
    }

    // Items/Columns
    if (lower.includes('col') || lower.includes('item')) {
      return 'รายการ';
    }

    // Default
    return `ค่าตัวอย่าง ${variableName}`;
  }

  /**
   * Generate JSON Schema from sample data
   */
  generateSchema(sampleData: unknown): Record<string, unknown> {
    return this.inferSchemaFromData(sampleData);
  }

  /**
   * Recursively infer JSON Schema from data object
   */
  private inferSchemaFromData(data: unknown): Record<string, unknown> {
    if (data === null) {
      return { type: 'null' };
    }

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return {
          type: 'array',
          items: {},
        };
      }
      return {
        type: 'array',
        items: this.inferSchemaFromData(data[0]),
      };
    }

    const type = typeof data;

    switch (type) {
      case 'string':
        if (typeof data === 'string' && this.isDateString(data)) {
          return {
            type: 'string',
            format: 'date',
          };
        }
        return { type: 'string' };

      case 'number':
        return {
          type: Number.isInteger(data) ? 'integer' : 'number',
        };

      case 'boolean':
        return { type: 'boolean' };

      case 'object': {
        const properties: Record<string, unknown> = {};
        const required: string[] = [];
        const objData = data as Record<string, unknown>;

        for (const key in objData) {
          if (Object.prototype.hasOwnProperty.call(objData, key)) {
            properties[key] = this.inferSchemaFromData(objData[key]);
            if (objData[key] !== null && objData[key] !== undefined) {
              required.push(key);
            }
          }
        }

        return {
          type: 'object',
          properties,
          required: required.length > 0 ? required : undefined,
        };
      }

      default:
        return {};
    }
  }

  /**
   * Check if a string matches common date formats
   */
  private isDateString(value: string): boolean {
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/, // ISO date: 2024-01-15
      /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
      /^\d{1,2}\s+[ก-๙]+\s+\d{4}$/, // Thai date format
    ];

    return datePatterns.some((pattern) => pattern.test(value));
  }
}
