#!/usr/bin/env python3
"""
Material Design 3 Standardization Script
Fixes mat-card appearance and button hierarchy across apps/web
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Tuple

# Configuration
TARGET_DIR = Path("apps/web/src")
FILE_EXTENSIONS = [".ts", ".html"]

# Track changes
changes_log = {
    "mat-card": {
        "added_outlined": [],
        "changed_to_outlined": []
    },
    "buttons": {
        "primary_actions": [],  # mat-raised-button → mat-flat-button
    },
    "files_modified": set()
}

def should_process_file(file_path: Path) -> bool:
    """Check if file should be processed"""
    return (
        file_path.suffix in FILE_EXTENSIONS
        and not any(part.startswith('.') for part in file_path.parts)
        and 'node_modules' not in str(file_path)
        and '.git' not in str(file_path)
    )

def fix_mat_card_appearance(content: str, file_path: str) -> Tuple[str, bool]:
    """
    Fix mat-card appearance attributes:
    1. Add appearance="outlined" to mat-card without appearance
    2. Change appearance="filled" to appearance="outlined"
    """
    modified = False
    original_content = content

    # Pattern 1: mat-card with appearance="filled"
    if 'appearance="filled"' in content and 'mat-card' in content:
        content = re.sub(
            r'(<mat-card[^>]*?)appearance="filled"',
            r'\1appearance="outlined"',
            content
        )
        if content != original_content:
            changes_log["mat-card"]["changed_to_outlined"].append(file_path)
            modified = True
            original_content = content

    # Pattern 2: mat-card without appearance attribute
    # Match <mat-card> or <mat-card class="..."> but not <mat-card appearance="...">
    pattern = r'<mat-card(?!\s+[^>]*appearance=)(?=[\s>])'
    if re.search(pattern, content):
        content = re.sub(
            pattern,
            '<mat-card appearance="outlined"',
            content
        )
        if content != original_content:
            changes_log["mat-card"]["added_outlined"].append(file_path)
            modified = True

    return content, modified

def is_primary_action_context(line: str, prev_lines: List[str]) -> bool:
    """
    Determine if mat-raised-button is a primary action based on context.
    Primary actions: Save, Submit, Create, Add, Confirm, Generate, Apply, Assign
    """
    primary_keywords = [
        'save', 'submit', 'create', 'add', 'confirm', 'generate',
        'apply', 'assign', 'update', 'upload', 'download', 'import',
        'export', 'register', 'login', 'send', 'publish'
    ]

    # Check button text content
    button_text = line.lower()

    # Check if button has color="primary" or color="accent" (likely primary action)
    if 'color="primary"' in line or 'color="accent"' in line:
        return True

    # Check if button has color="warn" (destructive, keep as raised)
    if 'color="warn"' in line:
        return True  # Include warn buttons for consistency

    # Check button content for primary action keywords
    for keyword in primary_keywords:
        if keyword in button_text:
            return True

    # Check if in dialog context (dialog actions are usually primary)
    context = ' '.join(prev_lines[-5:]).lower() if len(prev_lines) >= 5 else ''
    if 'mat-dialog-actions' in context or 'dialog-actions' in context:
        # In dialog, raised buttons are usually primary actions
        return True

    return False

def fix_button_hierarchy(content: str, file_path: str) -> Tuple[str, bool]:
    """
    Fix button hierarchy: mat-raised-button → mat-flat-button for primary actions
    Keep mat-raised-button only for demo/showcase pages
    """
    modified = False

    # Skip showcase/demo pages - they're intentionally showing all button types
    skip_paths = [
        'theme-showcase',
        'component-showcase',
        'material-demo',
        'buttons.page.ts'
    ]
    if any(skip in file_path for skip in skip_paths):
        return content, False

    lines = content.split('\n')
    new_lines = []

    for i, line in enumerate(lines):
        new_line = line

        if 'mat-raised-button' in line:
            # Check if this is a primary action
            prev_lines = lines[max(0, i-5):i]

            # Always convert mat-raised-button to mat-flat-button (MD3 standard)
            # mat-raised-button is deprecated in MD3
            if 'mat-raised-button' in line:
                new_line = line.replace('mat-raised-button', 'mat-flat-button')
                if new_line != line:
                    changes_log["buttons"]["primary_actions"].append(f"{file_path}:{i+1}")
                    modified = True

        new_lines.append(new_line)

    return '\n'.join(new_lines), modified

def process_file(file_path: Path) -> bool:
    """Process a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        file_modified = False

        # Fix mat-card appearance
        content, modified = fix_mat_card_appearance(content, str(file_path))
        file_modified = file_modified or modified

        # Fix button hierarchy
        content, modified = fix_button_hierarchy(content, str(file_path))
        file_modified = file_modified or modified

        # Write back if modified
        if file_modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            changes_log["files_modified"].add(str(file_path))
            return True

        return False

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main execution"""
    print("=" * 80)
    print("Material Design 3 Standardization")
    print("=" * 80)
    print()

    # Find all files to process
    files_to_process = []
    for ext in FILE_EXTENSIONS:
        files_to_process.extend(TARGET_DIR.rglob(f"*{ext}"))

    files_to_process = [f for f in files_to_process if should_process_file(f)]

    print(f"Found {len(files_to_process)} files to scan...")
    print()

    # Process all files
    modified_count = 0
    for file_path in files_to_process:
        if process_file(file_path):
            modified_count += 1

    # Print summary
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print()

    print(f"Files scanned: {len(files_to_process)}")
    print(f"Files modified: {modified_count}")
    print()

    print("mat-card changes:")
    print(f"  - Added appearance=\"outlined\": {len(changes_log['mat-card']['added_outlined'])}")
    print(f"  - Changed to outlined: {len(changes_log['mat-card']['changed_to_outlined'])}")
    print()

    print("Button hierarchy changes:")
    print(f"  - mat-raised-button → mat-flat-button: {len(changes_log['buttons']['primary_actions'])}")
    print()

    # List modified files
    if changes_log["files_modified"]:
        print("Modified files:")
        for file_path in sorted(changes_log["files_modified"]):
            rel_path = file_path.replace(str(TARGET_DIR), "apps/web/src")
            print(f"  - {rel_path}")

    print()
    print("=" * 80)
    print("Next step: Run 'pnpm run build' to verify changes")
    print("=" * 80)

if __name__ == "__main__":
    main()
