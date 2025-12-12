#!/usr/bin/env python3
"""
Import TMT Relationships from Excel files to PostgreSQL

This script reads TMT relationship files (VTM->GP, GP->GPU, etc.) and imports them
into the inventory.tmt_relationships table.

Usage:
    python scripts/import-tmt-relationships.py
"""

import os
import sys
from pathlib import Path

try:
    import pandas as pd
    import psycopg2
    from psycopg2.extras import execute_batch
except ImportError:
    print("Error: Required packages not installed")
    print("Please install: pip install pandas psycopg2-binary openpyxl xlrd")
    sys.exit(1)

# Database configuration (from environment or defaults)
DB_CONFIG = {
    'host': os.getenv('DATABASE_HOST', 'localhost'),
    'port': int(os.getenv('DATABASE_PORT', '5482')),
    'database': os.getenv('DATABASE_NAME', 'aegisx_db'),
    'user': os.getenv('DATABASE_USER', 'postgres'),
    'password': os.getenv('DATABASE_PASSWORD', 'postgres')
}

# Relationship files mapping
# Format: filename -> (relationship_type, parent_level, child_level)
# Note: Using IS_A for hierarchical relationships
RELATIONSHIP_FILES = {
    'VTMtoGP20251201.xls': ('IS_A', 'VTM', 'GP'),
    'GPtoGPU20251201.xls': ('IS_A', 'GP', 'GPU'),
    'GPUtoTPU20251201.xls': ('IS_A', 'GPU', 'TPU'),  # GPU->TPU is also hierarchical
    'TPtoTPU20251201.xls': ('IS_A', 'TP', 'TPU'),
    'GPtoTP20251201.xls': ('IS_A', 'GP', 'TP'),  # GP->TP relationship
}

# Path to relationship files
BASE_PATH = Path(__file__).parent.parent / 'docs' / 'features' / 'inventory-app' / 'TMT' / 'TMTRF20251201' / 'TMTRF20251201_BONUS' / 'Relationship'


def get_db_connection():
    """Create database connection"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)


def get_concept_id_map(conn):
    """Create mapping of tmt_id -> id for fast lookups"""
    print("Loading TMT concept ID mappings...")
    cursor = conn.cursor()
    cursor.execute("SELECT id, tmt_id FROM inventory.tmt_concepts")
    mapping = {tmt_id: id for id, tmt_id in cursor.fetchall()}
    cursor.close()
    print(f"  Loaded {len(mapping)} concepts")
    return mapping


def import_relationship_file(conn, filepath, relationship_type, parent_level, child_level, concept_map):
    """Import relationships from a single Excel file"""
    if not filepath.exists():
        print(f"  ⚠️  File not found: {filepath}")
        return 0

    print(f"  Reading {filepath.name}...")

    try:
        # Read Excel file
        df = pd.read_excel(filepath)

        # Expected columns might be like: ParentTMTID, ChildTMTID or similar
        # Let's check the actual column names
        print(f"    Columns: {df.columns.tolist()}")

        # Try to identify parent and child columns
        # Common patterns: TMTID, TMT_ID, ParentTMTID, ChildTMTID, etc.
        parent_col = None
        child_col = None

        for col in df.columns:
            col_lower = str(col).lower()
            if 'parent' in col_lower or col_lower.startswith(parent_level.lower()):
                parent_col = col
            elif 'child' in col_lower or col_lower.startswith(child_level.lower()):
                child_col = col

        if parent_col is None or child_col is None:
            # Fallback: assume first two numeric columns
            numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
            if len(numeric_cols) >= 2:
                parent_col = numeric_cols[0]
                child_col = numeric_cols[1]
            else:
                print(f"    ❌ Could not identify parent/child columns")
                return 0

        print(f"    Using columns: parent={parent_col}, child={child_col}")

        # Prepare data for insertion
        relationships = []
        missing_parents = set()
        missing_children = set()

        for _, row in df.iterrows():
            parent_tmt_id = int(row[parent_col])
            child_tmt_id = int(row[child_col])

            parent_id = concept_map.get(parent_tmt_id)
            child_id = concept_map.get(child_tmt_id)

            if parent_id is None:
                missing_parents.add(parent_tmt_id)
                continue

            if child_id is None:
                missing_children.add(child_tmt_id)
                continue

            relationships.append((parent_id, child_id, relationship_type))

        if missing_parents:
            print(f"    ⚠️  Missing {len(missing_parents)} parent concepts (first 5: {list(missing_parents)[:5]})")
        if missing_children:
            print(f"    ⚠️  Missing {len(missing_children)} child concepts (first 5: {list(missing_children)[:5]})")

        if not relationships:
            print(f"    ⚠️  No valid relationships found")
            return 0

        # Insert into database
        cursor = conn.cursor()

        # Use INSERT ON CONFLICT to avoid duplicates
        insert_query = """
            INSERT INTO inventory.tmt_relationships (parent_id, child_id, relationship_type)
            VALUES (%s, %s, %s)
            ON CONFLICT (parent_id, child_id, relationship_type) DO NOTHING
        """

        execute_batch(cursor, insert_query, relationships, page_size=1000)
        conn.commit()
        cursor.close()

        print(f"    ✅ Imported {len(relationships)} relationships")
        return len(relationships)

    except Exception as e:
        print(f"    ❌ Error: {e}")
        conn.rollback()
        return 0


def main():
    """Main import process"""
    print("=" * 80)
    print("TMT Relationships Import")
    print("=" * 80)

    # Check if relationship files exist
    if not BASE_PATH.exists():
        print(f"Error: Relationship directory not found: {BASE_PATH}")
        sys.exit(1)

    # Connect to database
    conn = get_db_connection()

    try:
        # Load concept mappings
        concept_map = get_concept_id_map(conn)

        # Import each relationship file
        total_imported = 0

        for filename, (rel_type, parent_level, child_level) in RELATIONSHIP_FILES.items():
            filepath = BASE_PATH / filename
            print(f"\n{parent_level} → {child_level} ({rel_type})")

            count = import_relationship_file(
                conn, filepath, rel_type, parent_level, child_level, concept_map
            )
            total_imported += count

        print("\n" + "=" * 80)
        print(f"✅ Import completed: {total_imported} relationships imported")
        print("=" * 80)

    finally:
        conn.close()


if __name__ == '__main__':
    main()
