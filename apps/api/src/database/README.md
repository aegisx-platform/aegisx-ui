# AegisX Platform Database Schema

This document describes the comprehensive database schema for the AegisX Platform, designed to support all OpenAPI specifications and enterprise-grade features.

## Schema Overview

The database schema is designed with the following principles:
- **UUID Primary Keys**: All tables use UUID primary keys for better distributed system support
- **Audit Fields**: All tables include `created_at` and `updated_at` timestamps
- **Soft Deletes**: User-related tables support soft deletes where appropriate
- **Performance Indexes**: Strategic indexing for common query patterns
- **Data Integrity**: Proper foreign key constraints and validation
- **Extensibility**: JSON fields for flexible metadata storage

## Core Tables

### Authentication & Users

#### `users`
Primary user table with comprehensive profile information.
- **Extended fields**: `avatar_url`, `status`, `email_verified`, `two_factor_enabled`
- **Profile fields**: `bio`, `timezone`, `language`, `date_of_birth`, `phone`
- **Security fields**: `two_factor_secret`, `two_factor_backup_codes`
- **Soft delete support**: `deleted_at`

#### `user_sessions`
Enhanced session management with device tracking and security monitoring.
- **Device info**: `device_type`, `device_os`, `device_browser`, `device_name`
- **Location tracking**: Country, region, city, timezone, coordinates
- **Security features**: `is_suspicious`, `security_flags`, `activity_count`
- **Session metadata**: `session_data`, `last_activity_at`

#### `roles` & `permissions`
Role-based access control system.
- **Flexible permissions**: Resource + action based permissions
- **Junction table**: `role_permissions` for many-to-many relationships
- **User assignment**: `user_roles` for user-role assignments

### User Preferences & Settings

#### `user_preferences`
Comprehensive user preference storage matching OpenAPI specifications.
- **Theme preferences**: `theme`, `scheme`, `layout`
- **Localization**: `language`, `timezone`, `date_format`, `time_format`
- **Navigation**: `navigation_collapsed`, `navigation_type`, `navigation_position`
- **Notifications**: Granular notification preferences
- **Privacy & Accessibility**: Privacy controls and accessibility options
- **Performance**: Animation and caching preferences

#### `user_settings`
Granular key-value settings system.
- **Flexible storage**: Category-based organization with typed values
- **System/User distinction**: Support for both system and user-defined settings
- **Validation support**: JSON schema validation rules

#### `themes`
Available theme configurations.
- **Theme metadata**: Name, description, preview images
- **Color palettes**: JSON storage for theme colors
- **CSS variables**: Custom CSS properties for themes

### Navigation System

#### `navigation_items`
Dynamic, permission-based navigation structure.
- **Hierarchical structure**: Self-referencing parent-child relationships
- **Multiple types**: Items, groups, collapsibles, dividers, spacers
- **Badge support**: Title, classes, and variant configuration
- **Visibility control**: Per-navigation-type visibility (default, compact, horizontal, mobile)
- **Metadata storage**: Flexible JSON metadata field

#### `navigation_permissions`
Links navigation items with required permissions.

#### `user_navigation_preferences`
User-specific navigation customization.
- **Personal overrides**: Hide items, custom ordering, pinning
- **User experience**: Personalized navigation structure

### System Configuration

#### `system_settings`
Application-wide configuration.
- **Category organization**: App, security, features, etc.
- **Type safety**: Strongly typed values with data type specification
- **Public/Private**: Control over frontend exposure
- **Restart requirements**: Flag settings that require app restart

#### `setting_templates`
Default setting structures and validation.
- **Template definitions**: Default values and validation rules
- **User configurability**: Control over user modification permissions

### Storage & Files

#### `avatar_files`
Avatar file management with thumbnail support.
- **File metadata**: Original filename, MIME type, file size
- **Storage paths**: Configurable storage backend support
- **Thumbnails**: JSON storage for multiple thumbnail sizes

### Notifications

#### `notifications`
In-app notification system.
- **Rich content**: Title, message, action URLs
- **Metadata**: Additional JSON data for notifications
- **Status tracking**: Read/unread, archived states
- **Priority levels**: Low, normal, high, urgent
- **Expiration**: Time-sensitive notification support

#### `notification_preferences`
Granular notification preference control.
- **Channel preferences**: Email, push, desktop, sound
- **Frequency control**: Immediate, daily, weekly, never
- **Quiet hours**: Time-based notification blocking

### Security & Audit

#### `session_activity`
Detailed session activity tracking.
- **Activity types**: Login, logout, API calls, page views
- **Request/Response data**: Metadata storage for security analysis
- **Performance monitoring**: Status codes and timing

#### `session_security_events`
Security event tracking and alerting.
- **Event classification**: Failed logins, suspicious activity
- **Severity levels**: Low, medium, high, critical
- **Resolution tracking**: Event resolution and responsible users

#### `audit_logs`
Comprehensive audit trail for all system changes.
- **Entity tracking**: Track changes to any system entity
- **Change history**: Old and new values for updates
- **Context information**: User, session, IP, user agent
- **Source tracking**: Web, API, mobile, system

#### `email_verification_tokens`
Email verification token management.

#### `password_reset_tokens`
Password reset token management with security tracking.

#### `api_keys`
API key management for programmatic access.
- **Key metadata**: Human-readable names and descriptions
- **Security**: Hashed keys with prefix for identification
- **Scoping**: Permission-based access control
- **Usage tracking**: Last used timestamps and IP addresses

## Migration Order

The migrations are designed to be run in sequence:

1. `001_create_roles_and_permissions.ts` - Base RBAC system
2. `002_create_users.ts` - Core user management
3. `003_create_sessions.ts` - Basic session management
4. `004_extend_users_table.ts` - Extended user profile features
5. `005_create_user_preferences.ts` - User preference system
6. `006_create_navigation_items.ts` - Dynamic navigation
7. `007_create_user_settings.ts` - Advanced settings system
8. `008_enhance_user_sessions.ts` - Enhanced session tracking
9. `009_create_notifications_and_audit.ts` - Notifications and audit

## Seed Data

### Initial Data (`001_initial_data.ts`)
- Default roles (admin, user)
- Core permissions
- Admin user account

### Enhanced Data (`002_enhanced_seed_data.ts`)
- Default themes
- System settings
- Setting templates
- Navigation structure
- Enhanced user profiles
- Demo user account

## Performance Considerations

### Indexing Strategy
- **Primary access patterns**: User-based queries are heavily indexed
- **Composite indexes**: Multi-column indexes for common filter combinations
- **Foreign key indexes**: All foreign keys have corresponding indexes
- **Query optimization**: Indexes designed for typical API endpoint queries

### Data Types
- **UUIDs**: Primary keys use UUID v4 for distributed system compatibility
- **JSON fields**: Used for flexible, structured data that doesn't require relational queries
- **Enums**: Used for constrained value sets to ensure data integrity
- **Timestamps**: Proper timezone-aware timestamp handling

### Scalability
- **Partitioning ready**: Audit and activity tables can be partitioned by date
- **Soft deletes**: Preserve data integrity while supporting "deletion"
- **Flexible schema**: JSON fields allow for schema evolution without migrations

## Security Features

- **Password hashing**: bcrypt with configurable rounds
- **Token management**: Secure JWT and refresh token handling
- **Session security**: Device fingerprinting and suspicious activity detection
- **Audit compliance**: Comprehensive change tracking
- **API security**: Scoped API keys with usage tracking

## Data Relationships

```
users
├── user_roles (many-to-many with roles)
├── user_sessions (one-to-many)
├── user_preferences (one-to-one)
├── user_settings (one-to-many)
├── user_navigation_preferences (one-to-many)
├── avatar_files (one-to-many)
├── notifications (one-to-many)
├── audit_logs (one-to-many)
└── api_keys (one-to-many)

roles
├── role_permissions (many-to-many with permissions)
└── user_roles (many-to-many with users)

navigation_items
├── children (self-referencing hierarchy)
├── navigation_permissions (many-to-many with permissions)
└── user_navigation_preferences (one-to-many)
```

This schema provides a robust foundation for the AegisX Platform, supporting all OpenAPI specifications while maintaining flexibility for future enhancements.