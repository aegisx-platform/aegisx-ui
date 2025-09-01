# AegisX API Integration Test Suite

Comprehensive integration testing infrastructure for the AegisX API with full application context, real database operations, and cross-module testing capabilities.

## Overview

This integration test suite provides:

- **Full Application Context**: Tests run against the complete Fastify application with all plugins and modules
- **Real Database Operations**: Uses a dedicated test database with automatic setup and cleanup
- **Authentication Flows**: Complete JWT authentication testing with token generation and validation
- **Cross-Module Testing**: Verifies interactions between different API modules
- **Comprehensive Assertions**: Rich assertion helpers for API responses and data validation
- **Performance Testing**: Built-in performance and load testing capabilities

## Quick Start

```bash
# Run all integration tests
npm run test:integration

# Run specific test file
npm run test:integration -- --testPathPattern=navigation

# Run with coverage
npm run test:integration:coverage

# Run in watch mode
npm run test:integration:watch
```

## Test Structure

```
__tests__/integration/
├── setup.ts                    # Main test setup and configuration
├── auth-helper.ts             # Authentication utilities
├── db-helper.ts               # Database management utilities
├── request-helper.ts          # HTTP request helpers
├── assertions.ts              # Response assertion helpers
├── factories.ts               # Test data factories
├── *.integration.spec.ts      # Integration test files
├── jest.*.ts                  # Jest configuration files
└── README.md                  # This file
```

## Writing Integration Tests

### Basic Test Structure

```typescript
import { setupTestContext, AuthHelper, RequestHelper, expectResponse } from './index';

describe('My API Integration Tests', () => {
  let testContext: any;
  let authHelper: AuthHelper;
  let requestHelper: RequestHelper;
  let userToken: string;

  beforeAll(async () => {
    testContext = await setupTestContext();
    authHelper = new AuthHelper(testContext.app, testContext.db.connection);
    requestHelper = new RequestHelper(testContext.app);

    // Create authenticated test user
    const user = await authHelper.createTestUser();
    const tokens = await authHelper.loginUser(user.email, user.password);
    userToken = tokens.accessToken;
  });

  afterAll(async () => {
    await testContext.cleanup();
  });

  it('should get user profile', async () => {
    const response = await requestHelper.getAuth('/api/users/profile', {
      token: userToken
    });

    expectResponse(response)
      .hasStatus(200)
      .isSuccess()
      .hasData((data: any) => {
        expect(data.email).toBeDefined();
        expect(data.role).toBeDefined();
      });
  });
});
```

### Quick Setup Pattern

```typescript
import { quickSetup, createAuthenticatedUser } from './index';

describe('Quick Integration Test', () => {
  let context: any;

  beforeAll(async () => {
    context = await quickSetup();
  });

  afterAll(async () => {
    await context.cleanup();
  });

  it('should authenticate and access profile', async () => {
    const { user, token } = await createAuthenticatedUser(context.auth);
    
    const response = await context.request.getAuth('/api/users/profile', { token });
    expect(response.status).toBe(200);
  });
});
```

## Available Test Utilities

### Authentication Helper

```typescript
const authHelper = new AuthHelper(app, db);

// Create test users
const user = await authHelper.createTestUser();
const adminUser = await authHelper.createAdminUser();
const customUser = await authHelper.createUserWithRole('manager', ['users.read']);

// Authentication flows
const tokens = await authHelper.loginUser(user.email, user.password);
await authHelper.logoutUser(tokens.accessToken);
const newTokens = await authHelper.refreshToken(tokens.refreshToken);

// Token utilities
const token = authHelper.generateToken({ id: user.id, email: user.email });
const decoded = authHelper.verifyToken(token);
```

### Request Helper

```typescript
const requestHelper = new RequestHelper(app);

// Basic requests
const response = await requestHelper.get('/api/endpoint');
const postResponse = await requestHelper.post('/api/endpoint', { body: data });

// Authenticated requests
const authResponse = await requestHelper.getAuth('/api/protected', { token });
const updateResponse = await requestHelper.putAuth('/api/resource', { 
  token, 
  body: updateData 
});

// File uploads
const uploadResponse = await requestHelper.uploadFile(
  '/api/upload',
  'file',
  '/path/to/file',
  { token }
);
```

### Response Assertions

```typescript
expectResponse(response)
  .hasStatus(200)
  .isSuccess()
  .hasData((data) => {
    expect(data.id).toBeDefined();
  })
  .hasMeta({ version: '1.0' });

// Common patterns
commonAssertions.successfulGet(response);
commonAssertions.validationError(response, 'email');
commonAssertions.authRequired(response);
```

### Database Helper

```typescript
const dbHelper = new DatabaseHelper(db);

// Database operations
await dbHelper.cleanup();
await dbHelper.migrate();
await dbHelper.seed();

// Utility methods
const count = await dbHelper.getTableCount('users');
const users = await dbHelper.insertTestData('users', [userData]);
```

### Test Data Factories

```typescript
// User factory
const user = await testContext.factories.user.create({
  email: 'custom@example.com',
  role: 'admin'
});
const users = await testContext.factories.user.createMany(5);

// Navigation factory
const navItem = await testContext.factories.navigation.create({
  title: 'Test Item',
  permissions: ['admin.read']
});

// Complete data structures
const navigationStructure = await testContext.factories.data.createNavigationStructure();
```

## Test Configuration

### Environment Variables (.env.test)

Key test environment variables:

```bash
NODE_ENV=test
TEST_DB_NAME=aegisx_test
JWT_SECRET=test-jwt-secret
BCRYPT_ROUNDS=4
DISABLE_LOGGING=true
```

### Jest Configuration

Integration-specific Jest settings in `jest.integration.config.ts`:

- Custom test sequencer for proper test ordering
- Database setup/teardown hooks
- Coverage thresholds
- Timeout configurations

## Test Categories

### 1. Authentication Flow Tests
- User registration and login
- Token generation and validation
- Session management
- Logout and token invalidation

### 2. Navigation API Tests
- Navigation structure retrieval
- Role-based filtering
- Caching behavior
- Permission validation

### 3. User Profile Tests
- Profile retrieval and updates
- Preference management
- Avatar upload/deletion
- Input validation

### 4. Cross-Module Tests
- Authentication → Profile → Navigation flows
- Role-based access control
- Data consistency across modules
- Session management integration

## Best Practices

### Test Isolation
- Each test suite gets a fresh database state
- Transactions used for test-specific data
- Proper cleanup in beforeEach/afterEach

### Performance Considerations
- Database connection pooling optimized for tests
- Reduced bcrypt rounds for faster password hashing
- Parallel test execution where safe

### Error Handling
- Comprehensive error scenario testing
- Consistent error response validation
- Database connection failure simulation

### Security Testing
- Invalid token scenarios
- Permission boundary testing
- Rate limiting verification
- Input validation and sanitization

## Running Specific Test Types

```bash
# Authentication tests only
npm run test:integration -- --testNamePattern="auth"

# Navigation tests only  
npm run test:integration -- --testNamePattern="navigation"

# Cross-module tests only
npm run test:integration -- --testNamePattern="cross-module"

# Performance tests only
npm run test:integration -- --testNamePattern="performance"
```

## Debugging Integration Tests

### Verbose Output
```bash
JEST_VERBOSE=true npm run test:integration
```

### Database Inspection
```bash
# Connect to test database
psql -h localhost -p 5432 -U postgres -d aegisx_test

# View test data
SELECT * FROM users WHERE id LIKE 'test-%';
```

### Logging
Enable logging by setting `DISABLE_LOGGING=false` in `.env.test`

## Continuous Integration

Integration tests are designed to run in CI/CD pipelines:

- Docker-based database setup
- Automatic test database creation
- Parallel execution support
- Coverage reporting
- Test result artifacts

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure PostgreSQL is running
   - Check connection parameters in `.env.test`
   - Verify test database exists

2. **Test Timeouts**
   - Increase timeout in jest configuration
   - Check for hanging database connections
   - Review async operation handling

3. **Permission Errors**
   - Verify test user roles and permissions
   - Check seed data consistency
   - Review role-permission mappings

4. **File Upload Tests**
   - Ensure test assets directory exists
   - Check file permissions
   - Verify upload path configuration

For more detailed information, see individual test files and utility documentation.