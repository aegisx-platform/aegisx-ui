# Drug Management - API Documentation

**Version:** 1.0.0
**Last Updated:** 2025-12-12
**Base URL:** `/api/inventory/master-data`

---

## 📋 Existing Endpoints

### Drugs API

**Base:** `/api/inventory/master-data/drugs`

#### 1. List Drugs

```http
GET /api/inventory/master-data/drugs
```

**Query Parameters:**

```typescript
{
  page?: number;              // Page number (default: 1)
  limit?: number;             // Items per page (default: 20)
  sort?: string;              // Sort field (default: 'id')
  order?: 'asc' | 'desc';     // Sort order (default: 'asc')
  search?: string;            // Search in trade_name, drug_code
  format?: 'default' | 'dropdown' | 'minimal';  // Response format
  fields?: string;            // Comma-separated fields (e.g., 'id,trade_name')

  // Filters
  generic_id?: number;
  manufacturer_id?: number;
  nlem_status?: 'NLEM' | 'NON_NLEM' | 'PENDING';
  drug_status?: 'ACTIVE' | 'DISCONTINUED' | 'RESTRICTED' | 'PENDING';
  product_category?: 'MEDICINE' | 'SUPPLEMENT' | 'MEDICAL_SUPPLY';
  is_active?: boolean;
}
```

**Response (default format):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "drug_code": "PARA500TAB001",
      "trade_name": "Tylenol 500mg",
      "generic_id": 123,
      "manufacturer_id": 45,
      "tmt_tpu_id": 28897,
      "nlem_status": "NLEM",
      "drug_status": "ACTIVE",
      "product_category": "MEDICINE",
      "unit_price": "5.50",
      "package_size": 100,
      "package_unit": "tablets",
      "is_active": true,
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-12-10T15:30:00Z",

      // Relations (if included)
      "generic": {
        "id": 123,
        "working_code": "0000123",
        "generic_name": "Paracetamol 500mg TAB"
      },
      "manufacturer": {
        "id": 45,
        "company_name": "GSK Thailand Ltd."
      },
      "tmt_concept": {
        "id": 28897,
        "tmt_id": 796277,
        "level": "GPU",
        "preferred_term": "calcium chloride dihydrate 18.3 mg/100 mL + ..."
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1169,
      "totalPages": 59
    }
  }
}
```

**Response (dropdown format):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "label": "PARA500TAB001 - Tylenol 500mg"
    }
  ],
  "meta": {
    "pagination": { "total": 1169 }
  }
}
```

#### 2. Get Drug by ID

```http
GET /api/inventory/master-data/drugs/:id
```

**Query Parameters:**

```typescript
{
  include?: string;  // Comma-separated relations: 'generic,manufacturer,tmt_concept,pack_ratios'
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "drug_code": "PARA500TAB001",
    "trade_name": "Tylenol 500mg",
    // ... all fields ...

    "generic": {
      "id": 123,
      "working_code": "0000123",
      "generic_name": "Paracetamol 500mg TAB",
      "dosage_form": "Tablet",
      "strength_value": "500",
      "strength_unit": "mg"
    },
    "manufacturer": {
      "id": 45,
      "company_code": "GSK001",
      "company_name": "GSK Thailand Ltd.",
      "company_type": "MANUFACTURER"
    },
    "tmt_concept": {
      "id": 28897,
      "tmt_id": 796277,
      "level": "GPU",
      "preferred_term": "...",
      "hierarchy": [
        { "level": "VTM", "tmt_id": 220350, "preferred_term": "Paracetamol" },
        { "level": "GP", "tmt_id": 210200, "preferred_term": "Paracetamol Tablet" },
        { "level": "GPU", "tmt_id": 796277, "preferred_term": "Paracetamol 500mg Tablet" }
      ]
    },
    "pack_ratios": [
      {
        "id": 1,
        "pack_size": 100,
        "pack_unit": "tablets",
        "unit_per_pack": "100.00",
        "pack_price": "550.00",
        "is_default": true
      },
      {
        "id": 2,
        "pack_size": 1000,
        "pack_unit": "tablets",
        "unit_per_pack": "1000.00",
        "pack_price": "5200.00",
        "is_default": false
      }
    ]
  }
}
```

#### 3. Create Drug

```http
POST /api/inventory/master-data/drugs
```

**Request Body:**

```json
{
  "drug_code": "PARA500TAB001",
  "trade_name": "Tylenol 500mg",
  "generic_id": 123,
  "manufacturer_id": 45,
  "tmt_tpu_id": 28897,
  "nlem_status": "NLEM",
  "drug_status": "ACTIVE",
  "product_category": "MEDICINE",
  "unit_price": 5.5,
  "package_size": 100,
  "package_unit": "tablets",
  "is_active": true
}
```

**Validation:**

- `drug_code`: Required, exactly 24 characters, unique
- `trade_name`: Required, max 200 characters
- `generic_id`: Required, must exist in drug_generics
- `manufacturer_id`: Required, must exist in companies
- `tmt_tpu_id`: Optional, must exist in tmt_concepts if provided
- `nlem_status`, `drug_status`, `product_category`: Required, must be valid enum values

**Response:** Same as Get Drug by ID

#### 4. Update Drug

```http
PUT /api/inventory/master-data/drugs/:id
```

**Request Body:** Same as Create (all fields optional)

**Response:** Same as Get Drug by ID

#### 5. Delete Drug

```http
DELETE /api/inventory/master-data/drugs/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Drug deleted successfully"
}
```

**Error:** Returns 422 if drug is referenced by other records

---

### Drug Generics API

**Base:** `/api/inventory/master-data/drugGenerics`

#### 1. List Drug Generics

```http
GET /api/inventory/master-data/drugGenerics
```

**Query Parameters:**

```typescript
{
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;            // Search in generic_name, working_code
  format?: 'default' | 'dropdown' | 'minimal';
  fields?: string;

  // Filters
  dosage_form_id?: number;
  ed_category?: 'E' | 'N' | 'V' | 'NONE';
  ven_category?: 'V' | 'E' | 'N' | 'NONE';
  is_active?: boolean;
}
```

**Response (default format):**

```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "working_code": "0000123",
      "generic_name": "Paracetamol 500mg TAB",
      "dosage_form": "Tablet",
      "strength_value": "500.00",
      "strength_unit": "mg",
      "ed_category": "E",
      "ven_category": "V",
      "tmt_gpu_id": 796277,
      "tmt_vtm_id": 220350,
      "is_active": true,

      // Relations
      "dosage_form_ref": {
        "id": 1,
        "form_name": "Tablet"
      },
      "components": [
        {
          "id": 1,
          "component_name": "Paracetamol",
          "strength_value": "500.00",
          "strength_unit": "mg"
        }
      ],
      "_count": {
        "drugs": 15,
        "components": 1
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 856
    }
  }
}
```

**Response (dropdown format):**

```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "label": "0000123 - Paracetamol 500mg TAB"
    }
  ]
}
```

#### 2. Get Generic by ID

```http
GET /api/inventory/master-data/drugGenerics/:id?include=components,drugs
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "working_code": "0000123",
    "generic_name": "Paracetamol 500mg TAB",
    // ... all fields ...

    "components": [
      {
        "id": 1,
        "component_name": "Paracetamol",
        "strength": "500mg",
        "strength_value": "500.00",
        "strength_unit": "mg"
      }
    ],
    "drugs": [
      {
        "id": 1,
        "drug_code": "PARA500TAB001",
        "trade_name": "Tylenol 500mg"
      },
      {
        "id": 2,
        "drug_code": "PARA500TAB002",
        "trade_name": "Panadol 500mg"
      }
    ],
    "tmt_hierarchy": {
      "vtm": {
        "tmt_id": 220350,
        "preferred_term": "Paracetamol"
      },
      "gp": {
        "tmt_id": 210200,
        "preferred_term": "Paracetamol Tablet"
      },
      "gpu": {
        "tmt_id": 796277,
        "preferred_term": "Paracetamol 500mg Tablet"
      }
    }
  }
}
```

#### 3. Create/Update/Delete Generic

Same pattern as Drugs API

---

## 🔄 Proposed New Endpoints

### Pack Ratios Management

#### 1. Get Pack Ratios for Drug

```http
GET /api/inventory/master-data/drugs/:drugId/pack-ratios
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "drug_id": 1,
      "pack_size": 100,
      "pack_unit": "tablets",
      "unit_per_pack": "100.00",
      "pack_price": "550.00",
      "is_default": true,
      "is_active": true
    }
  ]
}
```

#### 2. Create Pack Ratio

```http
POST /api/inventory/master-data/drug-pack-ratios
```

**Request:**

```json
{
  "drug_id": 1,
  "company_id": 45,
  "pack_size": 100,
  "pack_unit": "tablets",
  "unit_per_pack": 100,
  "pack_price": 550.0,
  "is_default": true
}
```

#### 3. Set Default Pack

```http
PATCH /api/inventory/master-data/drug-pack-ratios/:id/set-default
```

**Response:**

```json
{
  "success": true,
  "message": "Default pack ratio updated"
}
```

### Bulk Operations

#### 1. Bulk Update Drugs

```http
POST /api/inventory/master-data/drugs/bulk-update
```

**Request:**

```json
{
  "drug_ids": [1, 2, 3],
  "updates": {
    "drug_status": "DISCONTINUED",
    "is_active": false
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "updated_count": 3,
    "failed_count": 0,
    "errors": []
  }
}
```

#### 2. Bulk TMT Mapping

```http
POST /api/inventory/master-data/drugs/bulk-map-tmt
```

**Request:**

```json
{
  "mappings": [
    { "drug_id": 1, "tmt_tpu_id": 28897 },
    { "drug_id": 2, "tmt_tpu_id": 28898 }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "mapped_count": 2,
    "failed_count": 0,
    "errors": []
  }
}
```

### Statistics & Reports

#### 1. Drug Statistics

```http
GET /api/inventory/master-data/drugs/statistics
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total_drugs": 1169,
    "active_drugs": 1050,
    "by_nlem_status": {
      "NLEM": 450,
      "NON_NLEM": 600,
      "PENDING": 119
    },
    "by_drug_status": {
      "ACTIVE": 1050,
      "DISCONTINUED": 100,
      "RESTRICTED": 19
    },
    "tmt_mapping": {
      "total": 1169,
      "mapped": 561,
      "unmapped": 608,
      "coverage_percent": 47.99
    },
    "by_manufacturer": [
      { "manufacturer_id": 45, "manufacturer_name": "GSK Thailand", "count": 150 },
      { "manufacturer_id": 67, "manufacturer_name": "GPO", "count": 120 }
    ]
  }
}
```

---

## 🔗 TMT Integration (Existing)

### TMT Concepts API

**Base:** `/api/inventory/tmt/concepts`

Used by `ax-tmt-lookup` component

#### 1. Search TMT Concepts

```http
GET /api/inventory/tmt/concepts/search
```

**Query Parameters:**

```typescript
{
  q: string;                    // Search term (tmt_id, concept_code, preferred_term)
  level?: 'VTM' | 'GP' | 'GPU' | 'TP' | 'TPU';  // Filter by level
  page?: number;
  limit?: number;
}
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 28897,
      "tmt_id": 796277,
      "concept_code": "",
      "level": "GPU",
      "preferred_term": "calcium chloride dihydrate 18.3 mg/100 mL + ...",
      "is_active": true
    }
  ],
  "meta": {
    "pagination": { "total": 76904 }
  }
}
```

#### 2. Get TMT Hierarchy

```http
GET /api/inventory/tmt/concepts/:id/hierarchy
```

**Response:**

```json
{
  "success": true,
  "data": {
    "concept": { "id": 28897, "level": "GPU", "..." },
    "hierarchy": [
      { "level": "VTM", "tmt_id": 220350, "preferred_term": "Paracetamol" },
      { "level": "GP", "tmt_id": 210200, "preferred_term": "Paracetamol Tablet" },
      { "level": "GPU", "tmt_id": 796277, "preferred_term": "Paracetamol 500mg Tablet" }
    ],
    "children": []
  }
}
```

---

## 🚨 Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "DRUG_NOT_FOUND",
    "message": "Drug with ID 999 not found",
    "message_th": "ไม่พบรายการยา ID 999",
    "statusCode": 404
  }
}
```

### Common Error Codes

| Code                       | HTTP | Description                                         |
| -------------------------- | ---- | --------------------------------------------------- |
| `DRUG_NOT_FOUND`           | 404  | Drug ID doesn't exist                               |
| `GENERIC_NOT_FOUND`        | 404  | Generic ID doesn't exist                            |
| `DUPLICATE_DRUG_CODE`      | 409  | Drug code already exists                            |
| `INVALID_DRUG_CODE_LENGTH` | 400  | Drug code must be exactly 24 characters             |
| `INVALID_ENUM_VALUE`       | 400  | Invalid enum value (nlem_status, drug_status, etc.) |
| `REFERENCED_RECORD`        | 422  | Cannot delete - record is referenced                |
| `UNAUTHORIZED`             | 401  | Authentication required                             |
| `FORBIDDEN`                | 403  | Insufficient permissions                            |

---

## 🔐 Authentication & Authorization

All endpoints require:

- **Authentication:** Bearer token in `Authorization` header
- **Authorization:** RBAC permissions

### Required Permissions

| Endpoint            | Permission          |
| ------------------- | ------------------- |
| GET /drugs          | `drugs:read`        |
| POST /drugs         | `drugs:create`      |
| PUT /drugs/:id      | `drugs:update`      |
| DELETE /drugs/:id   | `drugs:delete`      |
| POST /drugs/bulk-\* | `drugs:bulk_update` |

---

## 📝 Notes

### Pagination Defaults

- Default limit: 20
- Max limit: 100
- Page starts at 1

### Sorting

- Default sort: `id ASC`
- Supported fields: `id`, `drug_code`, `trade_name`, `created_at`, `updated_at`

### Search Behavior

- Case-insensitive
- Partial match (ILIKE '%term%')
- Searches in: `trade_name`, `drug_code` (for drugs)
- Searches in: `generic_name`, `working_code` (for generics)

---

**Last Updated:** 2025-12-12
**Maintained By:** Backend Team
