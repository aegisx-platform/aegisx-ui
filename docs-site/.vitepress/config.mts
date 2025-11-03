import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "AegisX Platform Documentation",
  description: "Enterprise Full-Stack Platform - Complete Technical Documentation",

  // GitHub Pages deployment configuration
  base: '/aegisx-starter/',

  // Ignore dead links (will fix later)
  ignoreDeadLinks: true,

  // Theme and appearance
  appearance: 'dark', // Enable dark mode by default (user can toggle)

  themeConfig: {
    // Site logo and branding
    logo: '/logo.svg',
    siteTitle: 'AegisX Platform',

    // Navigation bar
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started/getting-started' },
      {
        text: 'Documentation',
        items: [
          { text: 'Development Guides', link: '/development/' },
          { text: 'Features', link: '/features/' },
          { text: 'Architecture', link: '/architecture/' },
          { text: 'API Reference', link: '/api/' },
          { text: 'Infrastructure', link: '/infrastructure/' },
        ]
      },
      {
        text: 'v1.x.x',
        items: [
          { text: 'v1.x (Current)', link: '/' },
          { text: 'Changelog', link: '/CHANGELOG' }
        ]
      }
    ],

    // Sidebar navigation
    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/getting-started/getting-started' },
            { text: 'Project Setup', link: '/getting-started/project-setup' },
            { text: 'SMTP Setup', link: '/getting-started/SMTP_SETUP_GUIDE' }
          ]
        }
      ],

      '/development/': [
        {
          text: 'Development Standards',
          items: [
            { text: 'Overview', link: '/development/' },
            { text: 'Feature Development Standard', link: '/development/feature-development-standard' },
            { text: 'Universal Full-Stack Standard', link: '/development/universal-fullstack-standard' },
            { text: 'API-First Workflow', link: '/development/api-first-workflow' },
            { text: 'API Calling Standard', link: '/development/API_CALLING_STANDARD' },
            { text: 'QA Checklist', link: '/development/qa-checklist' },
          ]
        },
        {
          text: 'Workflows',
          items: [
            { text: 'Development Workflow', link: '/development/development-workflow' },
            { text: 'Multi-Feature Workflow', link: '/development/multi-feature-workflow' },
            { text: 'Feature Tracking', link: '/development/feature-tracking' },
            { text: 'MCP Integration', link: '/development/mcp-integration' },
          ]
        },
        {
          text: 'Best Practices',
          items: [
            { text: 'Advanced Validation Patterns', link: '/development/advanced-validation-patterns' },
            { text: 'Material Dialog Standard', link: '/development/material-dialog-standard' },
            { text: 'Security Best Practices', link: '/development/security-best-practices' },
            { text: 'Performance & Scalability', link: '/development/performance-scalability-guidelines' },
            { text: 'Multi-User Concurrency', link: '/development/multi-user-concurrency-standards' },
          ]
        }
      ],

      '/features/': [
        {
          text: 'Features Overview',
          items: [
            { text: 'Features Dashboard', link: '/features/' },
            { text: 'Resource Registry', link: '/features/RESOURCE_REGISTRY' }
          ]
        },
        {
          text: 'Authentication & Security',
          items: [
            { text: 'Authentication', link: '/features/authentication/' },
            { text: 'RBAC', link: '/features/rbac/' },
            { text: 'API Keys', link: '/features/api-keys/' },
            { text: 'Password Reset', link: '/features/password-reset/' },
          ]
        },
        {
          text: 'Core Features',
          items: [
            { text: 'User Management', link: '/features/users/' },
            { text: 'User Profile', link: '/features/user-profile/' },
            { text: 'Settings', link: '/features/settings/' },
            { text: 'File Upload', link: '/features/file-upload/' },
            { text: 'Audit Logging', link: '/features/audit/' },
          ]
        },
        {
          text: 'Advanced Features',
          items: [
            { text: 'WebSocket System', link: '/features/websocket/' },
            { text: 'Monitoring', link: '/features/monitoring/' },
            { text: 'PDF Export', link: '/features/pdf-export/' },
            { text: 'PDF Templates', link: '/features/pdf-templates/' },
            { text: 'Bulk Import', link: '/features/bulk-import/' },
          ]
        },
        {
          text: 'UI Components',
          items: [
            { text: 'Component Showcase', link: '/features/component-showcase/' },
            { text: 'Navigation', link: '/features/navigation/' },
            { text: 'AegisX UI', link: '/features/aegisx-ui-improvements/' },
          ]
        }
      ],

      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/architecture/architecture-overview' },
            { text: 'Backend Architecture', link: '/architecture/backend-architecture' },
            { text: 'Frontend Architecture', link: '/architecture/frontend-architecture' },
          ]
        }
      ],

      '/api/': [
        {
          text: 'API Documentation',
          items: [
            { text: 'API Overview', link: '/api/' },
            { text: 'API Response Standard', link: '/api/api-response-standard' },
            { text: 'TypeBox Schema Standard', link: '/api/typebox-schema-standard' },
            { text: 'Response Patterns', link: '/api/response-patterns-examples' },
          ]
        },
        {
          text: 'API Playground',
          items: [
            { text: 'Interactive API Docs', link: '/api/playground' }
          ]
        }
      ],

      '/infrastructure/': [
        {
          text: 'Infrastructure & DevOps',
          items: [
            { text: 'Overview', link: '/infrastructure/' },
            { text: 'Deployment Guide', link: '/infrastructure/deployment' },
            { text: 'Multi-Instance Setup', link: '/infrastructure/multi-instance-setup' },
            { text: 'Docker Guide', link: '/infrastructure/MONOREPO-DOCKER-GUIDE' },
          ]
        },
        {
          text: 'CI/CD',
          items: [
            { text: 'CI/CD Setup', link: '/infrastructure/CI-CD-SETUP' },
            { text: 'Quick Start', link: '/infrastructure/QUICK-START-CICD' },
            { text: 'Optimization Guide', link: '/infrastructure/CI-CD-OPTIMIZATION-GUIDE' },
          ]
        },
        {
          text: 'Version Management',
          items: [
            { text: 'Git Flow & Release', link: '/infrastructure/GIT-FLOW-RELEASE-GUIDE' },
            { text: 'Automated Versioning', link: '/infrastructure/AUTOMATED-VERSIONING-GUIDE' },
            { text: 'Semantic Release Recovery', link: '/infrastructure/semantic-release-recovery' },
          ]
        }
      ],

      '/crud-generator/': [
        {
          text: 'CRUD Generator',
          items: [
            { text: 'Overview', link: '/crud-generator/' },
            { text: 'Quick Reference', link: '/crud-generator/QUICK_REFERENCE' },
            { text: 'Git Workflow', link: '/crud-generator/GIT_WORKFLOW' },
            { text: 'Testing Guide', link: '/crud-generator/TESTING_GUIDE' },
            { text: 'Changelog', link: '/crud-generator/CHANGELOG' },
          ]
        }
      ],

      '/testing/': [
        {
          text: 'Testing',
          items: [
            { text: 'Testing Strategy', link: '/testing/testing-strategy' },
            { text: 'API Testing', link: '/testing/api-testing' },
            { text: 'Integration Tests', link: '/testing/integration-tests' },
          ]
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/aegisx-platform/aegisx-starter' }
    ],

    // Edit link
    editLink: {
      pattern: 'https://github.com/aegisx-platform/aegisx-starter/edit/develop/docs-site/:path',
      text: 'Edit this page on GitHub'
    },

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present AegisX Platform'
    },

    // Search configuration
    search: {
      provider: 'local',
      options: {
        detailedView: true
      }
    },

    // Outline/TOC configuration
    outline: {
      level: [2, 3],
      label: 'On this page'
    }
  },

  // Markdown configuration
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  // Last updated timestamp
  lastUpdated: true
})
