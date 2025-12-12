# TMT Lookup - Backend API Specification

## Base URL

```
/api/inventory/tmt
```

---

## 1. Search TMT Concepts

ค้นหา TMT concepts ด้วย keyword

### Endpoint

```
GET /api/inventory/tmt/concepts/search
```

### Query Parameters

| Parameter         | Type    | Required | Default | Description                                  |
| ----------------- | ------- | -------- | ------- | -------------------------------------------- |
| `q`               | string  | Yes      | -       | Search query (code or name)                  |
| `level`           | string  | No       | -       | Filter by level (comma-separated: "GPU,TPU") |
| `limit`           | number  | No       | 20      | Max results (1-100)                          |
| `includeInactive` | boolean | No       | false   | Include inactive concepts                    |

### Request Example

```http
GET /api/inventory/tmt/concepts/search?q=paracetamol&level=GPU&limit=10
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 28470,
      "tmt_id": 767348,
      "concept_code": "767348",
      "level": "GPU",
      "fsn": "Paracetamol 500 mg oral tablet",
      "preferred_term": "พาราเซตามอล 500 มก. เม็ด",
      "strength": "500 mg",
      "dosage_form": "oral tablet",
      "is_active": true
    },
    {
      "id": 28471,
      "tmt_id": 767349,
      "concept_code": "767349",
      "level": "GPU",
      "fsn": "Paracetamol 650 mg oral tablet",
      "preferred_term": "พาราเซตามอล 650 มก. เม็ด",
      "strength": "650 mg",
      "dosage_form": "oral tablet",
      "is_active": true
    }
  ],
  "meta": {
    "total": 45,
    "returned": 2,
    "query": "paracetamol",
    "level": "GPU"
  }
}
```

---

## 2. Get TMT Concept by ID

ดึงรายละเอียด TMT concept ด้วย ID

### Endpoint

```
GET /api/inventory/tmt/concepts/:id
```

### Path Parameters

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `id`      | number | TMT concept ID (database ID) |

### Request Example

```http
GET /api/inventory/tmt/concepts/28470
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 28470,
    "tmt_id": 767348,
    "concept_code": "767348",
    "level": "GPU",
    "fsn": "Paracetamol 500 mg oral tablet",
    "preferred_term": "พาราเซตามอล 500 มก. เม็ด",
    "strength": "500 mg",
    "dosage_form": "oral tablet",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## 3. Get TMT Concept by Code

ดึงรายละเอียด TMT concept ด้วย concept code

### Endpoint

```
GET /api/inventory/tmt/concepts/code/:code
```

### Path Parameters

| Parameter | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| `code`    | string | TMT concept code (e.g., "767348") |

### Request Example

```http
GET /api/inventory/tmt/concepts/code/767348
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 28470,
    "tmt_id": 767348,
    "concept_code": "767348",
    "level": "GPU",
    "fsn": "Paracetamol 500 mg oral tablet",
    "preferred_term": "พาราเซตามอล 500 มก. เม็ด",
    "strength": "500 mg",
    "dosage_form": "oral tablet",
    "is_active": true
  }
}
```

---

## 4. Get TMT Hierarchy

ดึง hierarchy ของ TMT concept (ancestors + descendants)

### Endpoint

```
GET /api/inventory/tmt/concepts/:id/hierarchy
```

### Path Parameters

| Parameter | Type   | Description    |
| --------- | ------ | -------------- |
| `id`      | number | TMT concept ID |

### Query Parameters

| Parameter         | Type    | Required | Default | Description               |
| ----------------- | ------- | -------- | ------- | ------------------------- |
| `maxDepth`        | number  | No       | 5       | Max depth for descendants |
| `includeInactive` | boolean | No       | false   | Include inactive concepts |

### Request Example

```http
GET /api/inventory/tmt/concepts/28470/hierarchy?maxDepth=3
```

### Response

```json
{
  "success": true,
  "data": {
    "concept": {
      "id": 28470,
      "tmt_id": 767348,
      "concept_code": "767348",
      "level": "GPU",
      "fsn": "Paracetamol 500 mg oral tablet",
      "preferred_term": "พาราเซตามอล 500 มก. เม็ด"
    },
    "ancestors": [
      {
        "id": 1001,
        "tmt_id": 767001,
        "concept_code": "767001",
        "level": "VTM",
        "fsn": "Paracetamol",
        "preferred_term": "พาราเซตามอล"
      },
      {
        "id": 5023,
        "tmt_id": 767123,
        "concept_code": "767123",
        "level": "GP",
        "fsn": "Paracetamol 500 mg oral tablet",
        "preferred_term": "พาราเซตามอล 500 มก. เม็ด"
      }
    ],
    "descendants": [
      {
        "id": 45001,
        "tmt_id": 890001,
        "concept_code": "890001",
        "level": "TP",
        "fsn": "Tylenol 500 mg tablet",
        "preferred_term": "ไทลินอล 500 มก.",
        "children": [
          {
            "id": 60001,
            "tmt_id": 890123,
            "concept_code": "890123",
            "level": "TPU",
            "fsn": "Tylenol 500 mg 1 tablet",
            "preferred_term": "ไทลินอล 500 มก. 1 เม็ด"
          }
        ]
      },
      {
        "id": 45002,
        "tmt_id": 890002,
        "concept_code": "890002",
        "level": "TP",
        "fsn": "Sara 500 mg tablet",
        "preferred_term": "ซาร่า 500 มก.",
        "children": [
          {
            "id": 60002,
            "tmt_id": 890124,
            "concept_code": "890124",
            "level": "TPU",
            "fsn": "Sara 500 mg 1 tablet",
            "preferred_term": "ซาร่า 500 มก. 1 เม็ด"
          }
        ]
      }
    ]
  }
}
```

---

## 5. Get Related Drugs

ดึงรายการยาในระบบที่ map กับ TMT concept นี้

### Endpoint

```
GET /api/inventory/tmt/concepts/:id/related-drugs
```

### Path Parameters

| Parameter | Type   | Description    |
| --------- | ------ | -------------- |
| `id`      | number | TMT concept ID |

### Request Example

```http
GET /api/inventory/tmt/concepts/28470/related-drugs
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "code": "1010030",
      "name": "Paracetamol 500 mg",
      "source": "drug_generics",
      "mapping_field": "tmt_gpu_id"
    },
    {
      "id": 201,
      "code": "D001",
      "name": "Tylenol 500 mg tablet",
      "source": "drugs",
      "mapping_field": "tmt_tpu_id"
    }
  ],
  "meta": {
    "total": 2
  }
}
```

---

## 6. Get TMT Statistics

ดึงสถิติ TMT coverage

### Endpoint

```
GET /api/inventory/tmt/stats
```

### Request Example

```http
GET /api/inventory/tmt/stats
```

### Response

```json
{
  "success": true,
  "data": {
    "total_concepts": 76904,
    "by_level": {
      "VTM": 2691,
      "GP": 7991,
      "GPU": 9835,
      "TP": 27360,
      "TPU": 29027
    },
    "mappings": {
      "drug_generics": {
        "total": 1109,
        "mapped": 626,
        "coverage": 56.45
      },
      "drugs": {
        "total": 1168,
        "mapped": 561,
        "coverage": 48.03
      }
    }
  }
}
```

---

## 7. Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Query parameter 'q' is required",
    "details": {
      "field": "q",
      "rule": "required"
    }
  }
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "TMT concept not found",
    "details": {
      "id": 99999
    }
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## 8. TypeBox Schemas

```typescript
// Path params
export const TmtIdParamSchema = Type.Object({
  id: Type.Number({ minimum: 1 }),
});

export const TmtCodeParamSchema = Type.Object({
  code: Type.String({ minLength: 1, maxLength: 20 }),
});

// Query params
export const TmtSearchQuerySchema = Type.Object({
  q: Type.String({ minLength: 1, maxLength: 100 }),
  level: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100, default: 20 })),
  includeInactive: Type.Optional(Type.Boolean({ default: false })),
});

export const TmtHierarchyQuerySchema = Type.Object({
  maxDepth: Type.Optional(Type.Number({ minimum: 1, maximum: 10, default: 5 })),
  includeInactive: Type.Optional(Type.Boolean({ default: false })),
});

// Response schemas
export const TmtConceptSchema = Type.Object({
  id: Type.Number(),
  tmt_id: Type.Number(),
  concept_code: Type.String(),
  level: Type.Union([Type.Literal('VTM'), Type.Literal('GP'), Type.Literal('GPU'), Type.Literal('TP'), Type.Literal('TPU'), Type.Literal('GPP'), Type.Literal('TPP')]),
  fsn: Type.String(),
  preferred_term: Type.String(),
  strength: Type.Optional(Type.String()),
  dosage_form: Type.Optional(Type.String()),
  is_active: Type.Boolean(),
  created_at: Type.Optional(Type.String({ format: 'date-time' })),
  updated_at: Type.Optional(Type.String({ format: 'date-time' })),
});

export const TmtHierarchySchema = Type.Object({
  concept: TmtConceptSchema,
  ancestors: Type.Array(TmtConceptSchema),
  descendants: Type.Array(
    Type.Recursive((Self) =>
      Type.Object({
        ...TmtConceptSchema.properties,
        children: Type.Optional(Type.Array(Self)),
      }),
    ),
  ),
});

export const RelatedDrugSchema = Type.Object({
  id: Type.Number(),
  code: Type.String(),
  name: Type.String(),
  source: Type.Union([Type.Literal('drug_generics'), Type.Literal('drugs')]),
  mapping_field: Type.String(),
});
```

---

## 9. Database Queries

### Search Query

```sql
SELECT
  id, tmt_id, concept_code, level, fsn, preferred_term,
  strength, dosage_form, is_active
FROM inventory.tmt_concepts
WHERE
  (concept_code ILIKE $1 OR fsn ILIKE $1 OR preferred_term ILIKE $1)
  AND ($2::text[] IS NULL OR level = ANY($2))
  AND ($3 = true OR is_active = true)
ORDER BY
  CASE WHEN concept_code = $4 THEN 0 ELSE 1 END,
  concept_code
LIMIT $5;
```

### Hierarchy Query (Ancestors)

```sql
WITH RECURSIVE ancestors AS (
  -- Base case: start from the target concept
  SELECT c.*, 0 as depth
  FROM inventory.tmt_concepts c
  WHERE c.id = $1

  UNION ALL

  -- Recursive: find parents
  SELECT p.*, a.depth + 1
  FROM inventory.tmt_concepts p
  JOIN inventory.tmt_relationships r ON r.child_id = (
    SELECT id FROM ancestors WHERE depth = (SELECT MAX(depth) FROM ancestors)
  ) AND r.parent_id = p.id
  JOIN ancestors a ON true
  WHERE r.relationship_type = 'IS_A'
)
SELECT * FROM ancestors WHERE depth > 0 ORDER BY depth DESC;
```

### Hierarchy Query (Descendants)

```sql
WITH RECURSIVE descendants AS (
  -- Base case
  SELECT c.*, 0 as depth, ARRAY[c.id] as path
  FROM inventory.tmt_concepts c
  WHERE c.id = $1

  UNION ALL

  -- Recursive: find children
  SELECT c.*, d.depth + 1, d.path || c.id
  FROM inventory.tmt_concepts c
  JOIN inventory.tmt_relationships r ON r.parent_id = d.id AND r.child_id = c.id
  JOIN descendants d ON true
  WHERE r.relationship_type = 'IS_A'
    AND d.depth < $2
    AND NOT c.id = ANY(d.path)
)
SELECT * FROM descendants WHERE depth > 0 ORDER BY depth, concept_code;
```

---

## 10. Performance Considerations

### Indexes Required

```sql
-- Search optimization
CREATE INDEX idx_tmt_concepts_search
ON inventory.tmt_concepts
USING gin(to_tsvector('simple', fsn || ' ' || preferred_term));

-- Code lookup
CREATE INDEX idx_tmt_concepts_code
ON inventory.tmt_concepts(concept_code);

-- Level filtering
CREATE INDEX idx_tmt_concepts_level
ON inventory.tmt_concepts(level);

-- Relationship traversal
CREATE INDEX idx_tmt_relationships_parent
ON inventory.tmt_relationships(parent_id);

CREATE INDEX idx_tmt_relationships_child
ON inventory.tmt_relationships(child_id);
```

### Caching Strategy

- Search results: No cache (real-time)
- Single concept: Cache 5 minutes
- Hierarchy: Cache 10 minutes
- Stats: Cache 1 hour
