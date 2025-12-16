# Requirements Document: Monitoring & Audit Modules Restoration

## Introduction

This specification addresses the restoration of four critical backend modules that were deleted during the API Architecture Standardization migration (December 15, 2025) but were never re-implemented in the new layer-based architecture. These modules are essential for production monitoring, audit compliance, user experience, and API security.

The modules to be restored and enhanced are:

1. **Error Logs Module** - View and manage application errors
2. **Activity Logs Module** - Track and audit user activities
3. **User Profile Module** - Manage user profiles, avatars, and preferences
4. **API Keys Module** - Manage API keys for third-party integrations

Additionally, this specification includes comprehensive UI/UX improvements using AegisX UI component library, Angular Material, and TailwindCSS to create a modern, consistent, and accessible user interface.

### Background

During the API Architecture Standardization migration (commit `76296b3e` on 2025-12-15), these modules were deleted from `apps/api/src/core/` with the assumption they would be migrated to the new `layers/` structure. However, they were never re-implemented, leaving the frontend services unable to function.

**Current State:**

- ✅ Database tables exist (`error_logs`, `activity_logs`, etc.)
- ✅ Frontend services fully implemented
- ✅ Base infrastructure available (`BaseAuditController`, `BaseAuditRepository`)
- ❌ Backend REST API endpoints missing
- ❌ UI/UX outdated and inconsistent

**Value Proposition:**

- **Production Readiness**: Enable critical monitoring and debugging capabilities
- **Compliance**: Meet audit trail requirements (GDPR, SOC2, etc.)
- **User Experience**: Provide modern, accessible UI for all user-facing features
- **API Security**: Enable secure third-party integrations via API keys
- **Developer Experience**: Consistent UI patterns across all modules

## Alignment with Product Vision

This feature supports the following product goals:

1. **Enterprise-Grade Platform**: Restore monitoring and audit capabilities essential for enterprise deployments
2. **Security & Compliance**: Provide comprehensive audit trails and secure API access management
3. **Modern User Experience**: Deliver consistent, accessible UI using design system standards
4. **Developer Productivity**: Establish reusable patterns that speed up future development
5. **Production Operations**: Enable effective monitoring, debugging, and troubleshooting

## Requirements

### 1. Error Logs Management

**User Story:** As a system administrator, I want to view, filter, and manage error logs, so that I can quickly identify and resolve application issues.

#### Acceptance Criteria

1. WHEN I navigate to the Error Logs page THEN the system SHALL display a paginated list of all error logs with basic information (timestamp, level, message, user)
2. WHEN I apply filters (date range, level, user, type) THEN the system SHALL display only matching error logs
3. WHEN I click on an error log entry THEN the system SHALL display full error details including stack trace, context, and request information
4. WHEN I view error statistics THEN the system SHALL display aggregated metrics (total errors, errors by level, errors by type, trend charts)
5. WHEN I delete an error log THEN the system SHALL remove it and refresh the list
6. WHEN I trigger bulk cleanup THEN the system SHALL delete old errors based on configured retention period
7. WHEN I export error logs THEN the system SHALL generate a CSV file with all filtered errors
8. IF I lack proper permissions THEN the system SHALL deny access and display an appropriate message

**Backend API Requirements:**

- `GET /api/error-logs` - List errors with pagination and filters
- `GET /api/error-logs/stats` - Error statistics and metrics
- `GET /api/error-logs/:id` - Single error details
- `DELETE /api/error-logs/:id` - Delete single error
- `DELETE /api/error-logs/cleanup` - Bulk cleanup
- `GET /api/error-logs/export` - Export to CSV

**UI/UX Requirements:**

- Modern data table with sorting, filtering, and search using AegisX `ax-table` component
- Error level badges with color coding (error=red, warn=yellow, info=blue)
- Expandable row details for stack traces
- Real-time error count updates via WebSocket
- Responsive layout for mobile and tablet
- Accessibility: ARIA labels, keyboard navigation, screen reader support

---

### 2. Activity Logs Auditing

**User Story:** As a compliance officer, I want to view comprehensive activity logs of all user actions, so that I can ensure audit compliance and investigate security incidents.

#### Acceptance Criteria

1. WHEN I navigate to the Activity Logs page THEN the system SHALL display a paginated list of all user activities with timestamp, user, action, and status
2. WHEN I filter by user, action type, date range, or resource THEN the system SHALL display only matching activities
3. WHEN I click on an activity entry THEN the system SHALL display full activity details including metadata, IP address, user agent, and related entities
4. WHEN I view activity statistics THEN the system SHALL display metrics (total activities, activities by type, activities by user, timeline chart)
5. WHEN I export activity logs THEN the system SHALL generate a CSV file with all filtered activities
6. WHEN I search by keyword THEN the system SHALL search across action descriptions, metadata, and user information
7. IF I lack audit permissions THEN the system SHALL deny access

**Backend API Requirements:**

- `GET /api/activity-logs` - List activities with pagination and filters
- `GET /api/activity-logs/stats` - Activity statistics
- `GET /api/activity-logs/:id` - Single activity details
- `GET /api/activity-logs/export` - Export to CSV
- `DELETE /api/activity-logs/cleanup` - Bulk cleanup (admin only)

**UI/UX Requirements:**

- Timeline view with grouping by date
- Activity type icons and color coding
- User avatar integration
- Advanced filtering panel with collapsible filters
- Full-text search with highlighting
- Export button with format options (CSV, JSON)
- Responsive design for all screen sizes

---

### 3. User Profile Management

**User Story:** As a user, I want to manage my profile information, avatar, and preferences, so that I can personalize my experience and keep my information up-to-date.

#### Acceptance Criteria

1. WHEN I navigate to my profile page THEN the system SHALL display my current profile information (name, email, department, avatar)
2. WHEN I update my profile information THEN the system SHALL validate and save the changes
3. WHEN I upload an avatar image THEN the system SHALL validate the file (type, size), upload it, and display the new avatar immediately
4. WHEN I delete my avatar THEN the system SHALL remove it and display the default avatar
5. WHEN I update my preferences (theme, language, notifications) THEN the system SHALL save them and apply immediately
6. WHEN I view my activity history THEN the system SHALL display my recent activities (read-only view)
7. WHEN I request account deletion THEN the system SHALL prompt for confirmation and process the deletion request
8. IF I enter invalid data THEN the system SHALL display clear validation errors

**Backend API Requirements:**

- `GET /api/v1/platform/profile` - Get current user profile
- `PUT /api/v1/platform/profile` - Update profile information
- `POST /api/v1/platform/profile/avatar` - Upload avatar image
- `DELETE /api/v1/platform/profile/avatar` - Delete avatar
- `GET /api/v1/platform/profile/preferences` - Get user preferences
- `PUT /api/v1/platform/profile/preferences` - Update preferences
- `GET /api/v1/platform/profile/activity` - Get user's activity history
- `DELETE /api/v1/platform/profile/delete` - Request account deletion

**UI/UX Requirements:**

- Card-based layout with sections (Basic Info, Avatar, Preferences, Security, Activity)
- Avatar upload with drag-and-drop using AegisX `ax-file-upload`
- Real-time preview of changes
- Inline validation with clear error messages
- Theme switcher with live preview
- Language selector with flag icons
- Activity timeline widget showing recent actions
- Confirmation dialogs for destructive actions
- Mobile-optimized responsive layout

---

### 4. API Keys Management

**User Story:** As a developer, I want to create and manage API keys for third-party integrations, so that I can securely access the platform's API programmatically.

#### Acceptance Criteria

1. WHEN I navigate to the API Keys page THEN the system SHALL display all my API keys with name, prefix, created date, last used, and status
2. WHEN I create a new API key THEN the system SHALL validate the name, generate a secure key, and display it once with a copy button
3. WHEN I view an API key THEN the system SHALL display metadata but NOT the full key (only prefix)
4. WHEN I revoke an API key THEN the system SHALL deactivate it immediately and mark it as revoked
5. WHEN I set key permissions THEN the system SHALL validate and save the allowed scopes/permissions
6. WHEN I set an expiration date THEN the system SHALL automatically revoke the key after expiration
7. WHEN I view usage statistics THEN the system SHALL display request count, last used timestamp, and usage trends
8. IF I attempt to exceed the key limit THEN the system SHALL prevent creation and display the limit

**Backend API Requirements:**

- `GET /api/v1/platform/api-keys` - List user's API keys
- `POST /api/v1/platform/api-keys` - Create new API key
- `GET /api/v1/platform/api-keys/:id` - Get API key details
- `PUT /api/v1/platform/api-keys/:id` - Update API key (name, permissions, expiration)
- `DELETE /api/v1/platform/api-keys/:id` - Revoke API key
- `GET /api/v1/platform/api-keys/:id/usage` - Get usage statistics
- `POST /api/v1/platform/api-keys/:id/rotate` - Rotate API key (generate new secret)

**UI/UX Requirements:**

- Master-detail layout: list on left, details on right
- Create key wizard with steps (Name → Permissions → Expiration → Review)
- Key display with one-time visibility warning and copy button
- Permission selector with grouped checkboxes (read, write, admin scopes)
- Expiration date picker with common presets (30d, 90d, 1y, never)
- Usage charts showing requests over time
- Status badges (Active, Expired, Revoked) with color coding
- Search and filter by status, name, or creation date
- Confirmation dialogs for revoke/delete operations
- Security notice highlighting best practices

---

### 5. UI/UX Design System Compliance

**User Story:** As a user, I want a consistent, modern, and accessible interface across all monitoring and audit features, so that I can efficiently use the system without confusion.

#### Acceptance Criteria

1. WHEN I navigate to any monitoring/audit page THEN the system SHALL use AegisX UI components consistently
2. WHEN I interact with data tables THEN the system SHALL use `ax-table` with consistent column layouts, sorting, and pagination
3. WHEN I view forms THEN the system SHALL use Angular Material form controls with TailwindCSS utility classes
4. WHEN I trigger actions THEN the system SHALL use AegisX `ax-button` with consistent variants and sizes
5. WHEN I see status indicators THEN the system SHALL use AegisX `ax-badge` with semantic colors
6. WHEN I view cards THEN the system SHALL use AegisX `ax-card` with consistent spacing and shadows
7. WHEN I encounter dialogs THEN the system SHALL use Angular Material dialogs with consistent styling
8. WHEN I filter data THEN the system SHALL use AegisX `ax-filter-panel` with collapsible sections
9. WHEN I export data THEN the system SHALL use AegisX `ax-export-button` with format selection
10. IF I use keyboard navigation THEN the system SHALL support all interactions via keyboard
11. IF I use a screen reader THEN the system SHALL provide appropriate ARIA labels and announcements

**Design System Requirements:**

- **AegisX UI Components**: Use library components for tables, cards, buttons, badges, filters
- **Angular Material**: Use for forms, dialogs, date pickers, tooltips, menus
- **TailwindCSS**: Use utility classes for spacing, colors, typography, responsive layouts
- **Color Palette**: Follow AegisX color tokens (primary, success, warning, danger, info)
- **Typography**: Use TailwindCSS typography plugin with consistent heading/body styles
- **Spacing**: Use consistent spacing scale (4px base unit)
- **Responsive**: Mobile-first design with breakpoints (sm, md, lg, xl)
- **Dark Mode**: Support theme switching with CSS variables
- **Accessibility**: WCAG 2.1 Level AA compliance

---

## Non-Functional Requirements

### Code Architecture and Modularity

- **Layer Separation**: Backend modules in `apps/api/src/layers/core/audit/` (error-logs, activity-logs) and `apps/api/src/layers/platform/` (user-profile, api-keys)
- **Base Class Reuse**: Extend `BaseAuditController`, `BaseAuditService`, `BaseAuditRepository` for audit logs
- **Single Responsibility**: Each controller, service, repository, component has one clear purpose
- **TypeBox Schemas**: All API routes use TypeBox for request/response validation
- **Angular Signals**: Frontend uses Angular Signals for state management (no NgRx)
- **Component Isolation**: Each feature has self-contained modules with lazy loading
- **Shared Components**: Reusable UI components in `apps/web/src/app/shared/components/`

### Performance

- **Response Time**: All API endpoints SHALL respond within 200ms for simple queries, 1s for complex queries
- **Pagination**: All list endpoints SHALL support pagination with configurable page sizes (10, 25, 50, 100)
- **Caching**: Error/activity logs statistics SHALL be cached in Redis for 5 minutes
- **Lazy Loading**: Frontend modules SHALL be lazy-loaded to reduce initial bundle size
- **Virtual Scrolling**: Tables with >100 rows SHALL use virtual scrolling
- **Image Optimization**: Avatar uploads SHALL be resized and optimized (max 200KB, WebP format)
- **Bundle Size**: Each feature module SHALL be <100KB gzipped

### Security

- **Authentication**: All endpoints SHALL require JWT authentication
- **Authorization**: RBAC permissions SHALL control access to monitoring/audit features
  - `monitoring:read` - View error logs, activity logs
  - `monitoring:write` - Delete error logs, cleanup
  - `audit:read` - View activity logs
  - `audit:admin` - Bulk cleanup, export
  - `profile:write` - Update own profile
  - `api-keys:manage` - Manage own API keys
  - `api-keys:admin` - View all API keys (admin)
- **Input Validation**: All user inputs SHALL be validated on both client and server
- **XSS Prevention**: All user-generated content SHALL be sanitized
- **CSRF Protection**: All state-changing endpoints SHALL use CSRF tokens
- **API Key Security**: Keys SHALL be hashed (bcrypt) before storage, displayed only once at creation
- **Rate Limiting**: API key endpoints SHALL be rate-limited to prevent abuse
- **Audit Trail**: All API key operations SHALL be logged in activity logs

### Reliability

- **Error Handling**: All endpoints SHALL return standardized error responses
- **Transaction Safety**: Database operations SHALL use transactions where appropriate
- **Idempotency**: DELETE operations SHALL be idempotent (safe to retry)
- **Data Validation**: Database constraints SHALL prevent invalid data insertion
- **Graceful Degradation**: Frontend SHALL handle API failures gracefully with error messages
- **Retry Logic**: Failed API requests SHALL retry with exponential backoff (3 attempts max)

### Usability

- **Responsive Design**: All pages SHALL work on mobile (320px), tablet (768px), and desktop (1024px+)
- **Loading States**: All asynchronous operations SHALL show loading indicators
- **Empty States**: All lists SHALL show helpful messages when empty with suggested actions
- **Error Messages**: All errors SHALL provide clear, actionable messages
- **Success Feedback**: All successful operations SHALL show confirmation messages (toast/snackbar)
- **Keyboard Navigation**: All interactive elements SHALL be accessible via keyboard
- **Screen Reader Support**: All components SHALL have proper ARIA labels and roles
- **Help Text**: All forms SHALL provide inline help text and tooltips
- **Consistent Patterns**: All CRUD operations SHALL follow the same interaction patterns

### Testability

- **Unit Tests**: All services and utilities SHALL have >80% code coverage
- **Integration Tests**: All API endpoints SHALL have integration tests
- **E2E Tests**: Critical user flows SHALL have Playwright E2E tests
- **Test Data**: Use factories and fixtures for consistent test data
- **Mock Services**: Frontend tests SHALL use mocked HTTP services

### Documentation

- **API Documentation**: All endpoints SHALL be documented in Swagger/OpenAPI
- **Code Comments**: Complex logic SHALL have explanatory comments
- **Component Documentation**: Reusable components SHALL have JSDoc comments
- **README**: Each module SHALL have a README explaining purpose and usage
- **Migration Guide**: Document migration from old modules to new modules

---

## Success Metrics

1. **Completion**: All 4 modules fully implemented and deployed to production
2. **Test Coverage**: >80% unit test coverage, 100% critical path E2E coverage
3. **Performance**: All pages load in <2s, API responses <500ms (p95)
4. **Accessibility**: WCAG 2.1 Level AA compliance verified with axe-core
5. **User Adoption**: Monitoring pages accessed by >50% of active users within first week
6. **Zero Regressions**: No breaking changes to existing features
7. **Design Consistency**: 100% of UI components use AegisX/Material/Tailwind standards

---

## Out of Scope

The following are explicitly OUT of scope for this specification:

1. **Advanced Analytics**: Complex dashboards, custom reports, data visualization beyond basic charts
2. **Real-Time Monitoring**: Live tailing of logs, streaming updates (except basic WebSocket for counts)
3. **Log Aggregation**: Integration with external log aggregation services (Elasticsearch, Splunk)
4. **Alerting**: Email/SMS/Slack notifications for errors or activities
5. **Machine Learning**: Anomaly detection, predictive analytics
6. **Multi-Tenancy**: Organization-level isolation (single-tenant only)
7. **Internationalization**: UI translations (English only for now)
8. **Advanced Permissions**: Fine-grained permissions at resource level (use coarse-grained RBAC)
9. **Audit Log Immutability**: Blockchain or cryptographic signing of audit logs
10. **Custom Retention Policies**: Per-log-type retention configuration (use global retention)

These features may be addressed in future iterations but are not part of the initial release.

---

## Constraints

1. **Technology Stack**: Must use existing stack (Fastify, Angular 17+, PostgreSQL, Redis)
2. **Database Schema**: Cannot modify existing table structures (use as-is from migrations)
3. **Authentication**: Must integrate with existing JWT-based auth system
4. **RBAC**: Must use existing RBAC permission system
5. **API Standards**: Must follow layer-based routing (Core: `/api/{resource}`, Platform: `/api/v1/platform/{resource}`)
6. **Code Standards**: Must follow existing TypeScript, ESLint, Prettier configurations
7. **Design System**: Must use AegisX UI v1.x (current stable version)
8. **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
9. **Timeline**: Complete implementation within 2 weeks (80 development hours)
10. **Budget**: Zero additional infrastructure costs (use existing servers)

---

## Dependencies

1. **Database Tables**: `error_logs`, `activity_logs` tables must exist (already present from migrations)
2. **Base Classes**: `BaseAuditController`, `BaseAuditService`, `BaseAuditRepository` in `apps/api/src/layers/core/audit/base/`
3. **Auth System**: JWT authentication and RBAC authorization must be functional
4. **AegisX UI Library**: `@aegisx/ui` package installed and configured
5. **Angular Material**: `@angular/material` package installed and configured
6. **TailwindCSS**: Tailwind configured with design tokens
7. **Monitoring Module**: `apps/api/src/layers/core/monitoring/` for error logging infrastructure
8. **File Upload Plugin**: `apps/api/src/layers/platform/file-upload/` for avatar uploads

---

## Assumptions

1. **User Access**: All target users have appropriate RBAC permissions configured
2. **Network**: Users have stable internet connection for real-time updates
3. **Browser**: Users use modern browsers with JavaScript enabled
4. **Training**: Users have basic familiarity with web applications
5. **Data Volume**: Error logs <10K entries/day, Activity logs <50K entries/day
6. **Concurrent Users**: <100 concurrent users accessing monitoring features
7. **Retention**: Default retention period is 90 days for all logs
8. **Backup**: Database backups are handled by existing infrastructure
9. **Monitoring**: Application performance monitoring (APM) is already in place
10. **Support**: Development team available for bug fixes and support post-launch

---

## Risks and Mitigation

| Risk                      | Impact | Probability | Mitigation                                        |
| ------------------------- | ------ | ----------- | ------------------------------------------------- |
| Database migration issues | High   | Low         | Use existing tables, no schema changes            |
| Frontend-backend mismatch | High   | Medium      | Use TypeBox schemas, integration tests            |
| Performance degradation   | Medium | Low         | Implement caching, pagination, virtual scrolling  |
| Accessibility issues      | Medium | Medium      | Use axe-core testing, manual accessibility review |
| Design inconsistency      | Low    | Medium      | Follow strict component usage guidelines          |
| Security vulnerabilities  | High   | Low         | Security audit, penetration testing               |
| Timeline overrun          | Medium | Medium      | Prioritize core features, defer enhancements      |
| User adoption failure     | Medium | Low         | User testing, gather feedback, iterate            |

---

## References

1. **API Architecture Standardization Spec**: `.spec-workflow/specs/api-architecture-standardization/`
2. **Layer-Based Routing Docs**: `docs/architecture/layer-based-routing.md`
3. **AegisX UI Documentation**: `libs/aegisx-ui/README.md`
4. **Base Audit Controller**: `apps/api/src/layers/core/audit/base/base.controller.ts`
5. **Frontend Architecture**: `docs/architecture/frontend-architecture.md`
6. **CRUD Generator Docs**: `libs/aegisx-cli/docs/QUICK_REFERENCE.md`
7. **Migration Commit**: Git commit `76296b3e` (2025-12-15)
8. **Deleted Error Logs Module**: Git history `apps/api/src/core/error-logs/` (deleted)
9. **Deleted User Profile Module**: Git history `apps/api/src/core/user-profile/` (deleted)
10. **Deleted API Keys Module**: Git history `apps/api/src/core/api-keys/` (deleted)
