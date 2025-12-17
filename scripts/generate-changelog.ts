#!/usr/bin/env node
/**
 * Changelog Generator
 *
 * Automatically generates CHANGELOG.md from git commits using conventional commits format.
 * Supports:
 * - feat: New features
 * - fix: Bug fixes
 * - docs: Documentation changes
 * - refactor: Code refactoring
 * - perf: Performance improvements
 * - test: Test updates
 * - chore: Maintenance tasks
 *
 * Usage:
 *   npx ts-node scripts/generate-changelog.ts
 *   npx ts-node scripts/generate-changelog.ts --from v1.0.0 --to HEAD
 *   npx ts-node scripts/generate-changelog.ts --version 1.1.0
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface Commit {
  hash: string;
  date: string;
  author: string;
  type: string;
  scope?: string;
  subject: string;
  body?: string;
  breaking: boolean;
  pr?: string;
}

interface ChangelogSection {
  title: string;
  commits: Commit[];
}

interface ChangelogVersion {
  version: string;
  date: string;
  sections: ChangelogSection[];
}

/**
 * Parse conventional commit message
 */
function parseCommit(commitLine: string): Commit | null {
  const parts = commitLine.split('|||');
  if (parts.length < 4) return null;

  const [hash, date, author, message] = parts;
  const fullMessage = parts.slice(3).join('|||');

  // Parse conventional commit format: type(scope): subject
  const match = message.match(/^(\w+)(?:\(([^)]+)\))?: (.+)$/);
  if (!match) {
    // Non-conventional commit - categorize as "other"
    return {
      hash: hash.substring(0, 7),
      date,
      author,
      type: 'other',
      subject: message,
      breaking:
        message.includes('BREAKING CHANGE') || message.includes('IMPORTANT:'),
    };
  }

  const [, type, scope, subject] = match;

  // Check for breaking changes
  const breaking =
    fullMessage.includes('BREAKING CHANGE:') ||
    fullMessage.includes('IMPORTANT:') ||
    fullMessage.includes('!:');

  // Extract PR number if present
  const prMatch = subject.match(/#(\d+)/);
  const pr = prMatch ? prMatch[1] : undefined;

  return {
    hash: hash.substring(0, 7),
    date,
    author,
    type,
    scope,
    subject: subject.replace(/#\d+/, '').trim(),
    breaking,
    pr,
  };
}

/**
 * Get commits between two refs
 */
function getCommits(from: string, to: string): Commit[] {
  try {
    const gitLog = execSync(
      `git log ${from}..${to} --pretty=format:"%H|||%ad|||%an|||%s%n%b" --date=short`,
      { encoding: 'utf-8' },
    );

    const commits: Commit[] = [];
    const commitBlocks = gitLog.split('\n\n');

    for (const block of commitBlocks) {
      const lines = block.split('\n');
      const firstLine = lines[0];
      const commit = parseCommit(firstLine);

      if (commit) {
        // Add body if present
        if (lines.length > 1) {
          commit.body = lines.slice(1).join('\n').trim();
        }
        commits.push(commit);
      }
    }

    return commits;
  } catch (error) {
    console.error('Error getting commits:', error);
    return [];
  }
}

/**
 * Get latest git tag
 */
function getLatestTag(): string {
  try {
    return execSync('git describe --tags --abbrev=0', {
      encoding: 'utf-8',
    }).trim();
  } catch {
    // No tags found, use initial commit
    try {
      return execSync('git rev-list --max-parents=0 HEAD', {
        encoding: 'utf-8',
      }).trim();
    } catch {
      return 'HEAD';
    }
  }
}

/**
 * Group commits by type
 */
function groupCommits(commits: Commit[]): ChangelogSection[] {
  const typeOrder = [
    'breaking',
    'feat',
    'fix',
    'perf',
    'refactor',
    'docs',
    'test',
    'chore',
    'other',
  ];

  const typeLabels: Record<string, string> = {
    breaking: '🚨 Breaking Changes',
    feat: '✨ Features',
    fix: '🐛 Bug Fixes',
    perf: '⚡ Performance Improvements',
    refactor: '♻️ Code Refactoring',
    docs: '📚 Documentation',
    test: '✅ Tests',
    chore: '🔧 Chores',
    other: '📦 Other Changes',
  };

  const grouped = new Map<string, Commit[]>();

  // Separate breaking changes first
  const breakingCommits = commits.filter((c) => c.breaking);
  const nonBreakingCommits = commits.filter((c) => !c.breaking);

  if (breakingCommits.length > 0) {
    grouped.set('breaking', breakingCommits);
  }

  // Group by type
  nonBreakingCommits.forEach((commit) => {
    const type = commit.type || 'other';
    if (!grouped.has(type)) {
      grouped.set(type, []);
    }
    grouped.get(type)!.push(commit);
  });

  // Convert to sections in proper order
  const sections: ChangelogSection[] = [];

  for (const type of typeOrder) {
    const commits = grouped.get(type);
    if (commits && commits.length > 0) {
      sections.push({
        title: typeLabels[type] || type,
        commits,
      });
    }
  }

  return sections;
}

/**
 * Format commit for changelog
 */
function formatCommit(commit: Commit): string {
  let line = `- `;

  // Add scope if present
  if (commit.scope) {
    line += `**${commit.scope}**: `;
  }

  // Add subject
  line += commit.subject;

  // Add PR link if present
  if (commit.pr) {
    line += ` ([#${commit.pr}](https://github.com/owner/repo/pull/${commit.pr}))`;
  }

  // Add commit hash
  line += ` ([\`${commit.hash}\`](https://github.com/owner/repo/commit/${commit.hash}))`;

  return line;
}

/**
 * Generate changelog markdown
 */
function generateChangelog(version: ChangelogVersion): string {
  let markdown = `## [${version.version}] - ${version.date}\n\n`;

  for (const section of version.sections) {
    markdown += `### ${section.title}\n\n`;

    for (const commit of section.commits) {
      markdown += formatCommit(commit) + '\n';
    }

    markdown += '\n';
  }

  return markdown;
}

/**
 * Read existing changelog
 */
function readExistingChangelog(): string {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');

  if (fs.existsSync(changelogPath)) {
    return fs.readFileSync(changelogPath, 'utf-8');
  }

  return `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n`;
}

/**
 * Update changelog file
 */
function updateChangelog(newVersion: string, newContent: string): void {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  const existing = readExistingChangelog();

  // Find the position to insert new version (after header, before first version)
  const lines = existing.split('\n');
  let insertIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## [')) {
      insertIndex = i;
      break;
    }
  }

  if (insertIndex === 0) {
    // No existing versions, append to end
    insertIndex = lines.length;
  }

  // Insert new content
  lines.splice(insertIndex, 0, newContent);

  // Write back
  fs.writeFileSync(changelogPath, lines.join('\n'));
}

/**
 * Get package version
 */
function getPackageVersion(): string {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  return packageJson.version;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const fromIndex = args.indexOf('--from');
  const toIndex = args.indexOf('--to');
  const versionIndex = args.indexOf('--version');

  const from = fromIndex >= 0 ? args[fromIndex + 1] : getLatestTag();
  const to = toIndex >= 0 ? args[toIndex + 1] : 'HEAD';
  const version =
    versionIndex >= 0 ? args[versionIndex + 1] : getPackageVersion();

  console.log(`📋 Generating changelog for ${version}...`);
  console.log(`   From: ${from}`);
  console.log(`   To: ${to}`);

  // Get commits
  const commits = getCommits(from, to);

  if (commits.length === 0) {
    console.log('ℹ️  No new commits found');
    return;
  }

  console.log(`📝 Found ${commits.length} commits`);

  // Group commits
  const sections = groupCommits(commits);

  console.log(`📊 Grouped into ${sections.length} sections:`);
  sections.forEach((section) => {
    console.log(`   - ${section.title}: ${section.commits.length} commits`);
  });

  // Generate changelog
  const changelogVersion: ChangelogVersion = {
    version,
    date: new Date().toISOString().split('T')[0],
    sections,
  };

  const markdown = generateChangelog(changelogVersion);

  // Update changelog file
  updateChangelog(version, markdown);

  console.log(`✅ CHANGELOG.md updated with version ${version}`);
  console.log(`\nPreview:\n${markdown}`);
}

main().catch(console.error);
