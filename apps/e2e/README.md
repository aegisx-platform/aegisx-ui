# E2E Testing with Playwright

This directory contains comprehensive End-to-End (E2E) tests for the AegisX platform using Playwright. The tests are organized to provide full coverage of user workflows, visual regression testing, accessibility compliance, and performance validation.

## 📁 Directory Structure

```
apps/e2e/
├── src/
│   ├── fixtures/           # Test data and setup
│   │   ├── auth.setup.ts   # Authentication setup for tests
│   │   ├── test-data.ts    # Test data factories and fixtures
│   │   └── .auth/          # Stored authentication states
│   ├── pages/              # Page Object Models
│   │   ├── base.page.ts    # Base page with common functionality
│   │   ├── login.page.ts   # Login page interactions
│   │   ├── dashboard.page.ts # Dashboard page interactions
│   │   ├── navigation.page.ts # Navigation component interactions
│   │   └── profile.page.ts # Profile page interactions
│   ├── specs/              # Test specifications
│   │   ├── auth.spec.ts    # Authentication flow tests
│   │   ├── navigation.spec.ts # Navigation functionality tests
│   │   ├── visual.spec.ts  # Visual regression tests
│   │   ├── a11y.spec.ts    # Accessibility compliance tests
│   │   └── performance.spec.ts # Performance tests
│   └── support/            # Test utilities and helpers
│       ├── auth.helper.ts  # Authentication utilities
│       ├── navigation.helper.ts # Navigation utilities
│       ├── api-mock.helper.ts # API mocking utilities
│       ├── visual.helper.ts # Visual testing utilities
│       ├── global-setup.ts # Global test setup
│       └── global-teardown.ts # Global test cleanup
├── playwright.config.ts    # Playwright configuration
├── project.json           # Nx project configuration
├── tsconfig.json          # TypeScript configuration
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js 20+** - Required for running Playwright
2. **Running Application** - Both API and Web servers should be running
3. **Test Database** - Seeded test database with sample data

### Installation

```bash
# Install dependencies (from project root)
yarn install

# Install Playwright browsers
npx playwright install --with-deps

# Set up environment variables
cp apps/e2e/.env.example apps/e2e/.env
```

### Basic Test Execution

```bash
# Run all E2E tests
yarn test:e2e

# Run tests with UI (interactive mode)
yarn test:e2e:ui

# Run tests in headed mode (visible browser)
yarn test:e2e:headed

# Debug tests step by step
yarn test:e2e:debug

# Update visual regression baselines
yarn test:e2e:update-snapshots
```

### Specific Test Categories

```bash
# Authentication tests only
yarn test:e2e:auth

# Navigation tests only
yarn test:e2e:navigation

# Visual regression tests
yarn test:e2e:visual

# Accessibility tests
yarn test:e2e:a11y

# Performance tests
yarn test:e2e:performance
```

## 🧪 Test Categories

### 1. Authentication Tests (`auth.spec.ts`)

Tests user authentication flows including:

- **Login Functionality**
  - Valid/invalid credentials
  - Form validation
  - Remember me functionality
  - Keyboard navigation

- **Session Management**
  - Session persistence
  - Session expiration
  - Redirect to intended page

- **Security Features**
  - Multiple failed attempts
  - No credential storage
  - URL security

- **Visual States**
  - Login form appearance
  - Error states
  - Theme variations

### 2. Navigation Tests (`navigation.spec.ts`)

Tests navigation functionality including:

- **Menu Structure**
  - Navigation item visibility
  - Role-based menu items
  - Active state highlighting

- **Navigation Behavior**
  - Menu expand/collapse
  - State persistence
  - Keyboard navigation

- **Responsive Design**
  - Mobile navigation
  - Tablet adaptations
  - Desktop layout

- **Accessibility**
  - ARIA compliance
  - Screen reader support
  - Focus management

### 3. Visual Regression Tests (`visual.spec.ts`)

Ensures consistent UI appearance across:

- **Page Layouts**
  - Login, Dashboard, Profile pages
  - Responsive breakpoints
  - Theme variations (light/dark)

- **Component States**
  - Buttons, forms, cards
  - Hover, focus, active states
  - Loading and error states

- **Browser Compatibility**
  - Chrome, Firefox, Safari
  - Mobile and desktop viewports

### 4. Accessibility Tests (`a11y.spec.ts`)

Validates WCAG 2.1 compliance including:

- **ARIA Compliance**
  - Proper roles and labels
  - Landmark regions
  - Form accessibility

- **Keyboard Navigation**
  - Tab order
  - Focus management
  - Keyboard shortcuts

- **Screen Reader Support**
  - Heading hierarchy
  - Alt text for images
  - Link descriptions

- **Color and Contrast**
  - WCAG contrast requirements
  - Color-blind accessibility

### 5. Performance Tests (`performance.spec.ts`)

Measures application performance including:

- **Page Load Times**
  - Initial page loads
  - Navigation between pages
  - Resource loading efficiency

- **API Response Times**
  - Authentication endpoints
  - Data fetching
  - Form submissions

- **Memory Usage**
  - Memory leak detection
  - Resource cleanup

- **Mobile Performance**
  - Touch responsiveness
  - Mobile viewport performance

## 🎭 Page Object Model

The tests use the Page Object Model pattern for maintainable test code:

### Base Page (`base.page.ts`)

Common functionality shared across all pages:
- Element waiting and interaction
- Screenshot capabilities
- Navigation utilities
- Accessibility helpers

### Specific Page Objects

Each page has its own Page Object Model with:
- Page-specific selectors
- Interaction methods
- Verification methods
- Business logic encapsulation

Example:
```typescript
// Using Login Page Object
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.loginAndWaitForSuccess(TEST_CREDENTIALS.admin);
```

## 🔧 Helper Utilities

### Authentication Helper (`auth.helper.ts`)

Provides authentication utilities:
```typescript
const auth = new AuthHelper(page);
await auth.loginAsAdmin();
await auth.logout();
const isAuth = await auth.isAuthenticated();
```

### Visual Helper (`visual.helper.ts`)

Handles visual regression testing:
```typescript
const visual = new VisualHelper(page);
await visual.preparePage();
await visual.compareScreenshot('page-name');
await visual.testResponsiveDesign('component');
```

### API Mock Helper (`api-mock.helper.ts`)

Mocks API responses for testing:
```typescript
const apiMock = new ApiMockHelper(page);
await apiMock.mockAuthEndpoints();
await apiMock.mockSlowResponses(3000);
```

## 📊 Test Configuration

### Browser Configuration

Tests run on multiple browsers:
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Chrome Mobile, Safari Mobile
- **Special**: Visual regression, Accessibility, Performance

### Environment Variables

Key configuration options:
- `PLAYWRIGHT_BASE_URL` - Application URL
- `DATABASE_URL` - Test database connection
- `JWT_SECRET` - JWT secret for testing
- `VISUAL_THRESHOLD` - Visual diff tolerance
- `PERFORMANCE_TIMEOUT` - Performance test limits

### Parallel Execution

Tests are optimized for parallel execution:
- Sharded across multiple workers
- Independent test isolation
- Shared authentication states

## 🎯 Visual Regression Testing

### Baseline Creation

Create visual baselines:
```bash
# Create/update all baselines
yarn test:e2e:update-snapshots

# Create baselines for specific tests
npx playwright test visual.spec.ts --update-snapshots
```

### Screenshot Management

- **Baseline Images**: Stored in test files
- **Diff Images**: Generated on failures
- **Comparison Threshold**: Configurable tolerance
- **Responsive Testing**: Multiple viewport sizes

### Theme Testing

Visual tests include:
- Light/Dark theme variations
- High contrast mode
- Print styles
- Reduced motion preferences

## ♿ Accessibility Testing

### Automated Checks

Uses `@axe-core/playwright` for:
- WCAG 2.1 AA compliance
- Color contrast validation
- ARIA attribute checking
- Keyboard navigation testing

### Manual Testing Scenarios

Includes tests for:
- Screen reader compatibility
- Keyboard-only navigation
- Focus management
- Skip links and landmarks

### Accessibility Reports

Generates detailed reports with:
- Violation descriptions
- Remediation suggestions
- Element selectors
- Priority levels

## 🚀 Performance Testing

### Metrics Collected

- **Page Load Times**: First contentful paint, DOM ready
- **API Response Times**: Authentication, data fetching
- **Resource Loading**: JavaScript, CSS, images
- **Memory Usage**: Heap size, garbage collection
- **Mobile Performance**: Touch responsiveness

### Performance Budgets

Tests enforce performance budgets:
- Page loads: < 3 seconds
- API responses: < 2 seconds
- JavaScript bundles: < 2MB
- Memory increases: < 50MB

## 🔄 CI/CD Integration

### GitHub Actions

E2E tests run automatically on:
- Pull requests
- Pushes to main/develop
- Manual workflow dispatch

### Test Sharding

Tests are distributed across multiple runners:
- 4 parallel shards for main E2E tests
- Separate jobs for visual, accessibility, and performance
- Artifact collection for reports and screenshots

### Report Generation

Automatic report generation includes:
- HTML test reports
- Screenshot artifacts
- Performance metrics
- Accessibility violations

## 🛠️ Development Guidelines

### Writing New Tests

1. **Follow the Page Object Model pattern**
2. **Use descriptive test names**
3. **Keep tests isolated and independent**
4. **Use proper waiting strategies**
5. **Include both positive and negative scenarios**

### Test Structure

```typescript
test.describe('Feature Name', () => {
  let pageObject: PageObjectClass;
  
  test.beforeEach(async ({ page }) => {
    pageObject = new PageObjectClass(page);
    // Setup code
  });
  
  test('should perform expected behavior', async ({ page }) => {
    // Arrange
    await pageObject.goto();
    
    // Act
    await pageObject.performAction();
    
    // Assert
    await pageObject.verifyResult();
  });
});
```

### Best Practices

1. **Use data-testid attributes** for reliable selectors
2. **Wait for elements** instead of using fixed timeouts
3. **Clean up test data** after test completion
4. **Mock external dependencies** when appropriate
5. **Keep tests DRY** but readable

### Debugging Tests

```bash
# Run tests in debug mode
yarn test:e2e:debug

# Run specific test file
npx playwright test auth.spec.ts

# Show browser during test execution
npx playwright test --headed

# Generate trace files for debugging
npx playwright test --trace on
```

## 📈 Monitoring and Reporting

### Test Results

- **HTML Reports**: Detailed test execution reports
- **Screenshots**: Failure screenshots and visual baselines
- **Videos**: Test execution recordings (on failure)
- **Traces**: Detailed execution traces for debugging

### Performance Metrics

- **Load Time Tracking**: Historical performance data
- **API Response Monitoring**: Endpoint performance trends
- **Resource Usage**: Bundle size and memory usage
- **Core Web Vitals**: LCP, FID, CLS measurements

### Quality Gates

Tests enforce quality standards:
- ✅ All authentication flows working
- ✅ Navigation accessibility compliant
- ✅ Visual consistency maintained
- ✅ Performance budgets met
- ✅ WCAG 2.1 AA compliance

## 🔍 Troubleshooting

### Common Issues

1. **Test Timeouts**
   - Increase timeout values in configuration
   - Check server startup times
   - Verify network connectivity

2. **Visual Test Failures**
   - Update baselines if changes are intentional
   - Check font rendering differences
   - Verify browser versions

3. **Authentication Issues**
   - Verify test user credentials
   - Check database seed data
   - Confirm JWT configuration

4. **Performance Test Failures**
   - Check server performance
   - Verify test thresholds are realistic
   - Monitor CI runner performance

### Debug Mode

Enable debug mode for detailed logging:
```bash
DEBUG=pw:api yarn test:e2e
VERBOSE_LOGS=true yarn test:e2e
```

### Getting Help

- Review test logs and traces
- Check Playwright documentation
- Examine CI/CD pipeline logs
- Verify environment configuration

---

For more information about the AegisX platform testing strategy, see the main [Testing Documentation](../../docs/06-testing.md).