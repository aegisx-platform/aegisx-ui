# TMT (Thai Medicines Terminology) Integration

## Overview

This directory contains TMT reference files and documentation for integrating the Thai Medicines Terminology standard into the inventory system.

## Directory Structure

```
TMT/
├── README.md                          # This file
├── TMTRF20251201/                     # Latest TMT release (Dec 2025)
│   ├── TMTRF20251201/                 # Core release files
│   │   ├── TMTRF20251201_FULL.xls     # Full TMT concepts
│   │   ├── TMTRF20251201_SNAPSHOT.xls # Snapshot
│   │   └── TMTRF20251201_DELTA.xls    # Delta changes
│   └── TMTRF20251201_BONUS/           # Additional data
│       ├── Concept/                    # Concept details
│       ├── Relationship/              # Hierarchy relationships
│       │   ├── VTMtoGP20251201.xls    # VTM → GP relationships
│       │   ├── GPtoGPU20251201.xls    # GP → GPU relationships
│       │   ├── GPUtoTPU20251201.xls   # GPU → TPU relationships
│       │   ├── TPtoTPU20251201.xls    # TP → TPU relationships
│       │   └── GPtoTP20251201.xls     # GP → TP relationships
│       └── MasterTMT_20251201.xls     # Master reference
└── TMTRF20251201.zip                  # Original download
```

## TMT Hierarchy Levels

The TMT standard defines 5 levels of drug classification:

1. **VTM** (Virtual Therapeutic Moiety) - สารออกฤทธิ์
   - Active ingredient level
   - Example: "insulin", "paracetamol"

2. **GP** (Generic Product) - ยาสามัญ
   - Generic product with strength and form
   - Example: "paracetamol 500mg tablet"

3. **GPU** (Generic Product Unit) - ยาสามัญ+หน่วย
   - Generic product with unit of use
   - Example: "paracetamol 500mg tablet, 1 tablet"

4. **TP** (Trade Product) - ยาการค้า
   - Trade/brand name product
   - Example: "Tylenol 500mg"

5. **TPU** (Trade Product Unit) - ยาการค้า+หน่วย
   - Trade product with unit of use
   - Example: "Tylenol 500mg tablet, 1 tablet"

## Relationships

TMT concepts are connected through hierarchical relationships:

- **VTM → GP**: One active ingredient can have multiple generic products
- **GP → GPU**: One generic product can have multiple unit variations
- **GPU → TPU**: Generic products map to equivalent trade products
- **GP → TP**: Generic products relate to trade products
- **TP → TPU**: Trade products have unit variations

## Database Schema

### Tables

#### `inventory.tmt_concepts`

Stores all TMT concepts (76,904 records)

**Key fields:**

- `id`: Primary key (auto-increment)
- `tmt_id`: Official TMT identifier (unique)
- `concept_code`: TMT concept code (may be empty for some levels)
- `level`: TMT level (VTM, GP, GPU, TP, TPU)
- `fsn`: Fully Specified Name (English)
- `preferred_term`: Thai name
- `is_active`: Active status

#### `inventory.tmt_relationships`

Stores hierarchical relationships (100,307 records)

**Key fields:**

- `parent_id`: Reference to parent concept
- `child_id`: Reference to child concept
- `relationship_type`: Type of relationship (IS_A, HAS_INGREDIENT, HAS_FORM)

## Migrations

### 1. Import TMT Concepts

```bash
# Migration: 20251205000034_seed_tmt_concepts.ts
pnpm run db:migrate
```

Imports all TMT concepts from the FULL.xls file into `tmt_concepts` table.

### 2. Import TMT Relationships

```bash
# Migration: 20251212120000_import_tmt_relationships.ts
pnpm run db:migrate
```

Imports hierarchical relationships from Relationship/\*.xls files.

**Requirements:**

- Python 3
- Required packages: `pandas`, `psycopg2-binary`, `openpyxl`, `xlrd`

**Install Python dependencies:**

```bash
python3 -m pip install --break-system-packages pandas psycopg2-binary openpyxl xlrd
```

## Manual Import Script

For manual importing or re-importing relationships:

```bash
# Run the import script directly
python3 scripts/import-tmt-relationships.py
```

**Script features:**

- Reads TMT ID mappings from database
- Processes 5 relationship files
- Handles missing concepts gracefully
- Uses batch insert for performance
- Prevents duplicates with ON CONFLICT

**Output:**

```
================================================================================
TMT Relationships Import
================================================================================
Loading TMT concept ID mappings...
  Loaded 76904 concepts

VTM → GP (IS_A)
  Reading VTMtoGP20251201.xls...
    ✅ Imported 7276 relationships

GP → GPU (IS_A)
  Reading GPtoGPU20251201.xls...
    ✅ Imported 8834 relationships

...

================================================================================
✅ Import completed: 100307 relationships imported
================================================================================
```

## API Endpoints

### Search TMT Concepts

```http
GET /api/inventory/tmt/concepts/search?q=insulin&level=GPU&limit=10
```

### Get Concept by TMT ID

```http
GET /api/inventory/tmt/concepts/tmt-id/663609
```

### Get Concept by Code

```http
GET /api/inventory/tmt/concepts/code/GP210100
```

### Get Hierarchy

```http
GET /api/inventory/tmt/concepts/27015/hierarchy?maxDepth=3
```

**Response:**

```json
{
  "success": true,
  "data": {
    "concept": { ... },
    "ancestors": [
      { "level": "VTM", "preferred_term": "isophane insulin", ... },
      { "level": "GP", "preferred_term": "isophane insulin 100 iu/1 mL...", ... }
    ],
    "descendants": [
      { "level": "TPU", "preferred_term": "INSULATARD NOVOLET...", ... }
    ]
  }
}
```

### Get Related Drugs

```http
GET /api/inventory/tmt/concepts/663609/related-drugs
```

Returns drugs in `drug_generics` table mapped to this TMT concept.

### Get Statistics

```http
GET /api/inventory/tmt/stats
```

## Frontend Components

### TMT Badge

Display TMT code with level indicator and click-to-view detail:

```typescript
<ax-tmt-badge
  [code]="'663609'"
  [level]="'GPU'"
  [clickable]="true"
  (clicked)="onTmtClicked($event)"
/>
```

### TMT Detail Dialog

Shows full TMT concept information including hierarchy:

```typescript
this.dialog.open(AxTmtDetailDialogComponent, {
  data: { tmtId: 663609 },
  width: '600px',
});
```

### TMT Hierarchy Component

Display hierarchical tree of TMT relationships:

```typescript
<ax-tmt-hierarchy
  [tmtId]="663609"
  [expandedByDefault]="true"
  [maxDepth]="3"
/>
```

## Data Source

TMT data is provided by the Ministry of Public Health, Thailand.

**Download location:**

- Official website: [TMT Portal]
- Release: TMTRF20251201 (December 2025)
- Documentation: `TMT in summary V3.pdf`, `ReleaseNote_TMTRF20251201.pdf`

## Updating TMT Data

When a new TMT release is available:

1. Download the new release (TMTRF_YYYYMMDD.zip)
2. Extract to `docs/features/inventory-app/TMT/TMTRF_YYYYMMDD/`
3. Update the file paths in `scripts/import-tmt-relationships.py`:
   ```python
   BASE_PATH = Path(...) / 'TMTRF_YYYYMMDD' / ...
   ```
4. Update relationship file names:
   ```python
   RELATIONSHIP_FILES = {
       'VTMtoGP_YYYYMMDD.xls': ('IS_A', 'VTM', 'GP'),
       ...
   }
   ```
5. Run the import script:
   ```bash
   python3 scripts/import-tmt-relationships.py
   ```
6. Verify the data:
   ```bash
   curl http://localhost:3383/api/inventory/tmt/stats
   ```

## Troubleshooting

### Missing Python packages

```bash
pip3 install --break-system-packages pandas psycopg2-binary openpyxl xlrd
```

### Database connection errors

Check `.env.local` configuration:

```bash
cat .env.local | grep DATABASE
```

### Missing concepts warning

Some TMT IDs in relationship files may not exist in the concepts table. This is normal and doesn't affect the import process. The script will log these and skip them.

### Duplicate relationships

The import script uses `ON CONFLICT DO NOTHING` to safely handle duplicates. You can re-run the import multiple times without issues.

## Performance Notes

- **Concepts**: 76,904 records (~5 MB)
- **Relationships**: 100,307 records (~3 MB)
- **Import time**: ~30-60 seconds
- **Cache**: Frontend service caches concept lookups for 5 minutes
- **Hierarchy cache**: 10 minutes TTL

## References

- TMT Standard Documentation: `TMT in summary V3.pdf`
- Release Notes: `ReleaseNote_TMTRF20251201.pdf`
- Migration: `apps/api/src/database/migrations-inventory/20251212120000_import_tmt_relationships.ts`
- Import Script: `scripts/import-tmt-relationships.py`
- API Service: `apps/api/src/modules/inventory/tmt/`
- Frontend Components: `apps/web/src/app/shared/ui/components/tmt/`
