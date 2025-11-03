#!/usr/bin/env python3
"""Fix VitePress v-pre issues for files with Handlebars syntax"""

import os
import re
from pathlib import Path

def has_handlebars(content):
    """Check if file contains Handlebars syntax"""
    return '{{' in content

def has_frontmatter(content):
    """Check if file already has YAML front matter"""
    return content.strip().startswith('---')

def has_vpre(content):
    """Check if file already has v-pre wrapper"""
    return '<div v-pre>' in content or 'v-pre' in content

def get_title_from_file(filepath):
    """Extract title from filename or first heading"""
    content = filepath.read_text()

    # Try to find first # heading
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()

    # Fallback to filename
    return filepath.stem.replace('_', ' ').replace('-', ' ').title()

def fix_file(filepath):
    """Add front matter and v-pre wrapper to file"""
    content = filepath.read_text()

    # Skip if already has v-pre
    if has_vpre(content):
        print(f"⏭️  Skipping (already has v-pre): {filepath.name}")
        return False

    # Get title
    title = get_title_from_file(filepath)

    # Build new content
    new_content = []

    if has_frontmatter(content):
        # Already has front matter, just add v-pre after it
        lines = content.split('\n')
        in_frontmatter = False
        frontmatter_end = 0

        for i, line in enumerate(lines):
            if i == 0 and line.strip() == '---':
                in_frontmatter = True
            elif in_frontmatter and line.strip() == '---':
                frontmatter_end = i
                break

        # Add v-pre after front matter
        new_content = lines[:frontmatter_end + 1]
        new_content.append('')
        new_content.append('<div v-pre>')
        new_content.append('')
        new_content.extend(lines[frontmatter_end + 1:])
        new_content.append('')
        new_content.append('</div>')
    else:
        # No front matter, add everything
        new_content.append('---')
        new_content.append(f'title: {title}')
        new_content.append('---')
        new_content.append('')
        new_content.append('<div v-pre>')
        new_content.append('')
        new_content.append(content.rstrip())
        new_content.append('')
        new_content.append('</div>')

    # Write back
    filepath.write_text('\n'.join(new_content))
    print(f"✅ Fixed: {filepath.name}")
    return True

def main():
    docs_site = Path('/Users/sathitseethaphon/projects/aegisx-platform/aegisx-starter/docs-site')

    # Find all markdown files with Handlebars
    files_to_fix = []
    for md_file in docs_site.rglob('*.md'):
        try:
            content = md_file.read_text()
            if has_handlebars(content):
                files_to_fix.append(md_file)
        except Exception as e:
            print(f"❌ Error reading {md_file.name}: {e}")

    print(f"\n📋 Found {len(files_to_fix)} files with Handlebars syntax\n")

    fixed_count = 0
    for filepath in files_to_fix:
        try:
            if fix_file(filepath):
                fixed_count += 1
        except Exception as e:
            print(f"❌ Error fixing {filepath.name}: {e}")

    print(f"\n✨ Fixed {fixed_count}/{len(files_to_fix)} files")

if __name__ == '__main__':
    main()
