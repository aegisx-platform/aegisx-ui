# Activity Tracking System

## Overview

The Activity Tracking System is a comprehensive fullstack feature that provides automated logging, visualization, and analysis of user activities across the AegisX platform. It offers both automatic activity logging through middleware and manual logging capabilities, with a powerful dashboard for users to monitor their account activities and security events.

![Activity Dashboard](./images/activity-dashboard.png)

## Key Features

### 🔄 Automatic Activity Logging
- **Zero-configuration setup** - Activities are logged automatically via middleware
- **Request correlation** - Each activity includes request ID, session ID, and device info
- **Performance optimized** - Asynchronous logging with batching support
- **Security focused** - IP tracking, device fingerprinting, and suspicious activity detection

### 📊 Rich Analytics Dashboard
- **Real-time statistics** - Activity counts by action, severity, and time periods
- **Advanced filtering** - Filter by action type, severity, date range, and search terms
- **Interactive visualization** - Charts and graphs showing activity trends
- **Responsive design** - Works seamlessly on desktop and mobile devices

### 🔍 Comprehensive Activity Types
- **Authentication Events** - Login, logout, failed attempts, password changes
- **Profile Management** - Profile updates, avatar changes, preferences
- **Security Events** - Suspicious activity detection, session management
- **System Events** - API errors, validation failures, and system alerts

### 🛡️ Security & Privacy
- **Device tracking** - Browser, OS, and device type detection
- **IP geolocation** - Location tracking with privacy controls
- **Session correlation** - Track activities across user sessions
- **Data retention** - Configurable cleanup policies for old logs

## Quick Start

### For End Users
1. **Access the Dashboard**: Navigate to your profile settings and click "Activity Log"
2. **View Recent Activities**: See your latest account activities and events
3. **Filter Activities**: Use the search and filter options to find specific events
4. **Monitor Security**: Check for any suspicious login attempts or security events

### For Developers
1. **Automatic Logging**: Activities are logged automatically when the middleware is enabled
2. **Manual Logging**: Use the service methods to log custom activities
3. **Configuration**: Customize logging behavior through plugin configuration
4. **Extension**: Add new activity types by updating the schema constants

```typescript
// Automatic logging (via middleware)
// Activities are logged automatically for all API endpoints

// Manual logging
await fastify.logActivity(
  userId, 
  'custom_action', 
  'User performed custom action',
  request,
  { severity: 'info', metadata: { customData: 'value' } }
);
```

## Architecture Overview

### Backend Components
- **Activity Logging Plugin** - Fastify plugin for automatic middleware integration
- **Activity Middleware** - Intercepts requests and logs activities asynchronously
- **Activity Service** - Business logic for activity management and specialized logging
- **Activity Repository** - Database operations with optimized queries and indexing
- **TypeBox Schemas** - Complete type safety and validation for all activity data

### Frontend Components
- **Activity Log Component** - Main dashboard with table, filters, and pagination
- **Activity Stats Component** - Statistics visualization and charts
- **Activity Filter Component** - Advanced filtering and search interface
- **Activity Service** - Angular service with signal-based state management

### Database Schema
- **user_activity_logs table** - Optimized schema with strategic indexing
- **JSON fields** - Flexible storage for device info, location data, and metadata
- **Automatic cleanup** - Built-in function for managing data retention

## API Endpoints

- **GET** `/api/profile/activity` - Get paginated activity logs with filtering
- **GET** `/api/profile/activity/stats` - Get activity statistics and analytics
- **GET** `/api/profile/activity/sessions` - Get activity sessions grouped by session ID
- **POST** `/api/profile/activity/log` - Manual activity logging (internal use)

## Getting Started

### Prerequisites
- PostgreSQL 15+
- Node.js 18+
- Angular 19+
- Fastify 4+

### Installation
The Activity Tracking System is already integrated into the AegisX platform. No additional installation is required.

### Configuration
```typescript
// Activity logging plugin configuration
{
  enabled: true,
  async: true,
  batchSize: 50,
  flushInterval: 5000,
  skipSuccessfulGets: true,
  includeRequestData: false,
  includeResponseData: false
}
```

## Detailed Guides

- **[User Guide](./USER_GUIDE.md)** - Complete guide for end users
- **[Developer Guide](./DEVELOPER_GUIDE.md)** - Technical implementation details
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[Architecture Guide](./ARCHITECTURE.md)** - System design and architecture
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Common issues and solutions

## Activity Types

### Authentication Activities
- `login` - Successful user login
- `logout` - User logout
- `login_failed` - Failed login attempt
- `password_reset_request` - Password reset requested
- `password_reset_complete` - Password reset completed

### Profile Management Activities
- `profile_view` - Profile page accessed
- `profile_update` - Profile information updated
- `password_change` - Password changed
- `avatar_upload` - Profile avatar uploaded
- `avatar_delete` - Profile avatar removed

### Preferences Activities
- `preferences_view` - Preferences page accessed
- `preferences_update` - User preferences updated
- `theme_change` - UI theme changed
- `language_change` - Language preference changed

### Security Activities
- `session_created` - New session established
- `session_destroyed` - Session terminated
- `suspicious_activity` - Suspicious behavior detected
- `account_locked` - Account locked due to security
- `account_unlocked` - Account unlocked

### System Activities
- `api_error` - API endpoint error occurred
- `validation_error` - Data validation failed

## Data Retention

By default, activity logs are retained for 2 years. A PostgreSQL function automatically cleans up old records:

```sql
-- Automatic cleanup (runs daily via cron job)
SELECT cleanup_old_activity_logs();
```

## Security Considerations

- **IP Address Logging** - Client IPs are logged for security analysis
- **Device Fingerprinting** - Browser and device information is captured
- **Session Tracking** - Activities are correlated with user sessions
- **Privacy Controls** - Location data can be disabled via configuration
- **Data Minimization** - Only necessary information is stored
- **Encryption at Rest** - Database encryption protects stored activity data

## Performance

The system is optimized for high-volume activity logging:

- **Asynchronous Processing** - Activities are logged without blocking requests
- **Batch Operations** - Multiple activities are written in batches
- **Strategic Indexing** - Database indexes optimize common queries
- **Connection Pooling** - Efficient database connection management
- **Memory Usage** - Low memory footprint with streaming operations

## Statistics

The system provides comprehensive activity statistics:

- **Total Activities** - Lifetime activity count
- **Activities by Action** - Breakdown by activity type
- **Activities by Severity** - Distribution across severity levels
- **Time-based Counts** - Today, this week, this month activity counts
- **Unique Devices** - Number of different devices used
- **Unique Locations** - Number of different access locations
- **Last Activity** - Timestamp of most recent activity

## Support

For issues, questions, or feature requests:

1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review the [Developer Guide](./DEVELOPER_GUIDE.md) for technical details
3. Consult the [API Reference](./API_REFERENCE.md) for integration help
4. Create an issue in the project repository

## Contributing

To contribute to the Activity Tracking System:

1. Review the [Developer Guide](./DEVELOPER_GUIDE.md) for architecture details
2. Follow the coding standards and conventions
3. Add comprehensive tests for new features
4. Update documentation for any changes
5. Submit pull requests with clear descriptions

---

**Next Steps:**
- [Read the User Guide](./USER_GUIDE.md) to learn how to use the activity dashboard
- [Review the Developer Guide](./DEVELOPER_GUIDE.md) to understand the technical implementation
- [Check the API Reference](./API_REFERENCE.md) for integration details