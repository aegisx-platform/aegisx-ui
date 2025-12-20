# Tasks Document

## Implementation Tasks

- [-] 1. Create API contract parser types and interfaces
  - File: `libs/aegisx-mcp/src/data/api-contracts-parser.ts`
  - Define TypeScript interfaces for ApiEndpoint, ApiContract, ErrorResponse, and ValidationReport
  - Purpose: Establish type-safe data structures for API contract parsing
  - _Leverage: libs/aegisx-mcp/src/data/components.ts (for interface patterns)_
  - _Requirements: 1.1, 1.5_
  - \_Prompt: **Implement the task for spec api-contract-tools, first run spec-workflow-guide to get the workflow guide then implement the task:**

    **Role:** TypeScript Developer specializing in data modeling and parser design

    **Task:** Create comprehensive TypeScript interfaces for API contract data structures in `libs/aegisx-mcp/src/data/api-contracts-parser.ts` following requirements 1.1 and 1.5 (Requirements, Requirement 1 and Requirement 5). Reference the existing component data structure patterns from `libs/aegisx-mcp/src/data/components.ts` to maintain consistency.

    **Context:** This is part of the aegisx-mcp server that provides MCP tools for discovering and validating API contracts. The interfaces need to represent:
    - Individual API endpoints with method, path, schemas, examples
    - Complete API contracts (collection of endpoints per feature)
    - Error responses with status codes
    - Validation reports comparing docs vs implementation

    **Restrictions:**
    - Do not implement parsing logic yet (only types/interfaces in this task)
    - Follow existing naming conventions from components.ts
    - Use strict TypeScript types (no 'any')
    - Ensure interfaces support optional fields appropriately

    **\_Leverage:** libs/aegisx-mcp/src/data/components.ts for interface patterns

    **\_Requirements:** 1.1 (List All API Endpoints), 1.5 (Parse API Contract Documents)

    **Success Criteria:**
    - All interfaces compile without TypeScript errors
    - Interfaces cover all fields mentioned in requirements
    - Proper use of optional fields and union types
    - Export statements for all public interfaces

    **Instructions:**
    - Before starting: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 1 status from `[ ]` to `[-]`
    - After completion: Use `log-implementation` tool to record implementation with detailed artifacts (interfaces created, file paths, code statistics)
    - After logging: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 1 status from `[-]` to `[x]`

- [ ] 2. Implement contract file discovery and reading
  - File: `libs/aegisx-mcp/src/data/api-contracts-parser.ts` (continue)
  - Implement functions to find and read all api-contracts.md files from docs/features/
  - Add file caching to avoid re-reading on every request
  - Purpose: Provide efficient file system access for contract files
  - _Leverage: Node.js fs.promises for async file operations_
  - _Requirements: 1.5_
  - \_Prompt: **Implement the task for spec api-contract-tools, first run spec-workflow-guide to get the workflow guide then implement the task:**

    **Role:** Backend Developer with expertise in Node.js file system operations and caching

    **Task:** Implement file discovery and reading functions in `libs/aegisx-mcp/src/data/api-contracts-parser.ts` following requirement 1.5. Create functions to:
    1. Recursively find all `api-contracts.md` files under `docs/features/`
    2. Read file contents asynchronously
    3. Implement in-memory caching with cache invalidation

    **Context:** These functions will be used by the parser to load contract files efficiently. Multiple MCP tool calls may request the same data, so caching is important for performance.

    **Restrictions:**
    - Use Node.js `fs.promises` for all file operations
    - Do not use synchronous fs methods
    - Cache must be refreshable (don't cache forever)
    - Handle file read errors gracefully (don't crash on missing files)
    - Do not parse markdown yet (only read raw content)

    **\_Leverage:** Node.js fs.promises, path module

    **\_Requirements:** 1.5 (Parse API Contract Documents)

    **Success Criteria:**
    - Functions successfully find all contract files in docs/features/
    - File reading is asynchronous and handles errors
    - Caching reduces file I/O for repeated requests
    - Cache can be cleared or invalidated

    **Instructions:**
    - Before starting: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 2 status from `[ ]` to `[-]`
    - After completion: Use `log-implementation` tool with detailed artifacts (functions created, caching strategy, file paths)
    - After logging: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 2 status from `[-]` to `[x]`

- [ ] 3. Implement markdown parsing for API contracts
  - File: `libs/aegisx-mcp/src/data/api-contracts-parser.ts` (continue)
  - Parse markdown structure to extract endpoints, methods, paths, schemas, examples
  - Handle malformed markdown gracefully with fallback extraction
  - Purpose: Convert markdown documentation into structured data
  - _Leverage: String manipulation, regex for pattern matching_
  - _Requirements: 1.5_
  - \_Prompt: **Implement the task for spec api-contract-tools, first run spec-workflow-guide to get the workflow guide then implement the task:**

    **Role:** Parser Developer with expertise in markdown parsing and regex pattern matching

    **Task:** Implement markdown parsing logic in `libs/aegisx-mcp/src/data/api-contracts-parser.ts` following requirement 1.5. Parse contract markdown files to extract:
    - Feature metadata (base URL, authentication, content type)
    - Individual endpoints (method, path, description)
    - Request/response schemas (code blocks)
    - Examples (bash/json code blocks)
    - Error responses (status codes and descriptions)

    **Context:** Contract files follow a consistent format (see `docs/features/user-profile/api-contracts.md` for example). Parser should be resilient to minor variations in formatting.

    **Restrictions:**
    - Do not use external markdown parsing libraries (use regex/string methods)
    - Must handle missing sections gracefully (e.g., missing examples is OK)
    - Preserve code block formatting for schemas and examples
    - Log warnings for malformed sections but continue parsing
    - Extract HTTP method from endpoint headers (e.g., "GET /api/profile")

    **\_Leverage:** String methods (split, match, trim), Regex for pattern matching

    **\_Requirements:** 1.5 (Parse API Contract Documents)

    **Success Criteria:**
    - Successfully parses example contracts from docs/features/
    - Extracts all endpoint information (method, path, schemas, examples)
    - Handles malformed markdown without crashing
    - Returns structured ApiContract objects matching interfaces

    **Instructions:**
    - Before starting: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 3 status from `[ ]` to `[-]`
    - After completion: Use `log-implementation` tool with detailed artifacts (parsing functions, regex patterns used, edge cases handled)
    - After logging: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 3 status from `[-]` to `[x]`

- [ ] 4. Implement search and filter utilities
  - File: `libs/aegisx-mcp/src/data/api-contracts-parser.ts` (continue)
  - Create functions for searching endpoints by query string
  - Add filtering by feature, method, path pattern
  - Implement find by exact path/method
  - Purpose: Enable fast endpoint discovery for MCP tools
  - _Leverage: Array methods (filter, find, map), string matching_
  - _Requirements: 1.1, 1.2, 1.3_
  - \_Prompt: **Implement the task for spec api-contract-tools, first run spec-workflow-guide to get the workflow guide then implement the task:**

    **Role:** Backend Developer with expertise in search algorithms and data filtering

    **Task:** Implement search and filter utility functions in `libs/aegisx-mcp/src/data/api-contracts-parser.ts` following requirements 1.1, 1.2, and 1.3. Create functions to:
    1. Search endpoints by keyword (across path, method, description, feature)
    2. Filter endpoints by feature name
    3. Find specific endpoint by path and optional method
    4. Rank search results by relevance

    **Context:** These utilities will be called by MCP tool handlers to implement list, search, and get operations. Search should be case-insensitive and support partial matching.

    **Restrictions:**
    - Use native JavaScript array methods (no external search libraries)
    - Search must be case-insensitive
    - Support partial matching (e.g., "budget" matches "/api/budget-allocations")
    - Prioritize exact method matches in search results
    - Return empty arrays (not null) when no matches found

    **\_Leverage:** Array.filter, Array.find, Array.map, String.toLowerCase, String.includes

    **\_Requirements:** 1.1 (List All API Endpoints), 1.2 (Search API Endpoints), 1.3 (Get API Contract Details)

    **Success Criteria:**
    - Search returns relevant endpoints with keyword matching
    - Filter correctly isolates endpoints by feature
    - Find accurately locates endpoints by path/method
    - Relevance ranking prioritizes better matches

    **Instructions:**
    - Before starting: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 4 status from `[ ]` to `[-]`
    - After completion: Use `log-implementation` tool with detailed artifacts (utility functions created, search algorithm details)
    - After logging: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 4 status from `[-]` to `[x]`

- [ ] 5. Create MCP tool handler with formatting functions
  - File: `libs/aegisx-mcp/src/tools/api-contracts.tool.ts` (new file)
  - Implement handleApiContractTool function with switch-case for each tool
  - Add formatting functions for brief/detail output
  - Purpose: Handle MCP tool requests and format responses
  - _Leverage: libs/aegisx-mcp/src/tools/components.tool.ts (for handler pattern)_
  - _Requirements: 1.1, 1.2, 1.3_
  - \_Prompt: **Implement the task for spec api-contract-tools, first run spec-workflow-guide to get the workflow guide then implement the task:**

    **Role:** MCP Tool Developer with expertise in Model Context Protocol and response formatting

    **Task:** Create MCP tool handler in `libs/aegisx-mcp/src/tools/api-contracts.tool.ts` following requirements 1.1, 1.2, and 1.3. Implement:
    1. Main handler function with switch-case for: aegisx_api_list, aegisx_api_search, aegisx_api_get
    2. Formatting functions for brief endpoint summaries (list/search)
    3. Formatting function for detailed endpoint information (get)
    4. Error message formatting for not found scenarios

    **Context:** This handler will be called from the main MCP server (index.ts). Follow the exact pattern used in `libs/aegisx-mcp/src/tools/components.tool.ts` for consistency.

    **Restrictions:**
    - Return format must be: `{ content: [{ type: 'text', text: '...' }] }`
    - Use markdown formatting for output (headings, code blocks, tables)
    - Include helpful error messages with suggestions
    - Do not implement validation tool yet (only list, search, get)
    - Call parser functions from api-contracts-parser.ts

    **\_Leverage:** libs/aegisx-mcp/src/tools/components.tool.ts for handler pattern, libs/aegisx-mcp/src/data/api-contracts-parser.ts for data access

    **\_Requirements:** 1.1 (List All API Endpoints), 1.2 (Search API Endpoints), 1.3 (Get API Contract Details)

    **Success Criteria:**
    - Handler correctly routes to appropriate logic based on tool name
    - Formatted output is readable and follows markdown conventions
    - Brief format shows essential info (method, path, description)
    - Detail format shows complete contract (schemas, examples, errors)

    **Instructions:**
    - Before starting: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 5 status from `[ ]` to `[-]`
    - After completion: Use `log-implementation` tool with detailed artifacts (handler functions, formatting logic, integration with parser)
    - After logging: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 5 status from `[-]` to `[x]`

- [ ] 6. Implement validation logic for comparing docs vs code
  - File: `libs/aegisx-mcp/src/data/api-contracts-parser.ts` (continue)
  - Add function to scan route files for implemented endpoints
  - Compare documented vs implemented endpoints
  - Generate ValidationReport with missing/undocumented/mismatched endpoints
  - Purpose: Enable contract-code consistency validation
  - _Leverage: Node.js fs for file scanning, regex for route extraction_
  - _Requirements: 1.4_
  - \_Prompt: **Implement the task for spec api-contract-tools, first run spec-workflow-guide to get the workflow guide then implement the task:**

    **Role:** Code Analysis Developer with expertise in AST parsing and code scanning

    **Task:** Implement validation logic in `libs/aegisx-mcp/src/data/api-contracts-parser.ts` following requirement 1.4. Create a function that:
    1. Scans route files (apps/api/src/modules/\*/\*.routes.ts) for endpoint registrations
    2. Extracts HTTP methods and paths from Fastify route definitions
    3. Compares with documented contracts
    4. Generates ValidationReport listing: matched, missing, undocumented, method mismatches

    **Context:** Fastify routes look like: `fastify.get('/api/profile', ...)` or `fastify.post('/api/budget', ...)`. Need to extract method and path from these declarations.

    **Restrictions:**
    - Use regex or simple string parsing (no full AST parser needed)
    - Search only in apps/api/src/modules/ directory
    - Handle both single routes and route plugins
    - Report should list specific files where issues found
    - Do not modify any route files (read-only operation)

    **\_Leverage:** Node.js fs.promises for file scanning, regex for route extraction, glob pattern matching

    **\_Requirements:** 1.4 (Validate API Implementation)

    **Success Criteria:**
    - Successfully scans route files and extracts endpoints
    - Accurately identifies missing implementations
    - Correctly detects undocumented routes
    - Reports method mismatches (e.g., doc says POST but code has GET)

    **Instructions:**
    - Before starting: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 6 status from `[ ]` to `[-]`
    - After completion: Use `log-implementation` tool with detailed artifacts (validation function, scanning logic, report generation)
    - After logging: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 6 status from `[-]` to `[x]`

- [ ] 7. Add validation tool handler and formatting
  - File: `libs/aegisx-mcp/src/tools/api-contracts.tool.ts` (continue)
  - Add case for aegisx_api_validate in handler switch
  - Implement formatting function for ValidationReport
  - Purpose: Complete tool handler with validation support
  - _Leverage: Existing handler patterns from task 5_
  - _Requirements: 1.4_
  - \_Prompt: **Implement the task for spec api-contract-tools, first run spec-workflow-guide to get the workflow guide then implement the task:**

    **Role:** MCP Tool Developer with expertise in validation reporting and user feedback

    **Task:** Extend the handler in `libs/aegisx-mcp/src/tools/api-contracts.tool.ts` to support validation following requirement 1.4. Add:
    1. Case for 'aegisx_api_validate' in switch statement
    2. Formatting function for ValidationReport (show matched count, list issues)
    3. Helpful output with file paths where issues found

    **Context:** Validation tool should show a summary (X matched, Y missing, Z undocumented) followed by detailed lists of each issue type with actionable information.

    **Restrictions:**
    - Follow same return format as other tools
    - Use markdown formatting (tables for issues list)
    - Include file paths where endpoints should be/are implemented
    - Provide helpful next steps in output

    **\_Leverage:** Existing handler structure from task 5, validation logic from task 6

    **\_Requirements:** 1.4 (Validate API Implementation)

    **Success Criteria:**
    - Validation tool returns well-formatted report
    - Issues are clearly categorized (missing/undocumented/mismatched)
    - Output includes actionable information (file paths, specific endpoints)
    - Summary section gives quick overview of validation status

    **Instructions:**
    - Before starting: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 7 status from `[ ]` to `[-]`
    - After completion: Use `log-implementation` tool with detailed artifacts (validation handler, formatting functions)
    - After logging: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 7 status from `[-]` to `[x]`

- [ ] 8. Register API contract tools in MCP server
  - File: `libs/aegisx-mcp/src/index.ts` (modify existing)
  - Import handler from api-contracts.tool.ts
  - Register 4 tools with Zod schemas: aegisx_api_list, aegisx_api_search, aegisx_api_get, aegisx_api_validate
  - Purpose: Make tools available through MCP server
  - _Leverage: Existing tool registrations in index.ts_
  - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - \_Prompt: **Implement the task for spec api-contract-tools, first run spec-workflow-guide to get the workflow guide then implement the task:**

    **Role:** MCP Server Developer with expertise in tool registration and Zod validation

    **Task:** Register the 4 new API contract tools in `libs/aegisx-mcp/src/index.ts` following requirements 1.1-1.4. For each tool:
    1. Import handleApiContractTool from './tools/api-contracts.tool.js'
    2. Define Zod schema for parameters
    3. Call server.tool() with name, description, schema, and async handler
    4. Handler should call handleApiContractTool and return formatted response

    **Context:** Follow the exact pattern used for existing tools (components, patterns, CRUD). Each tool needs proper parameter validation using Zod.

    **Restrictions:**
    - Use Zod for all parameter validation
    - Follow naming convention: aegisx*api*\*
    - Provide clear description for each tool
    - Ensure parameter names match handler expectations
    - Do not modify existing tool registrations

    **\_Leverage:** Existing tool registrations (components, patterns, CRUD) as templates

    **\_Requirements:** 1.1 (List All API Endpoints), 1.2 (Search API Endpoints), 1.3 (Get API Contract Details), 1.4 (Validate API Implementation)

    **Success Criteria:**
    - All 4 tools registered with correct names and schemas
    - Zod validation catches invalid parameters before reaching handler
    - Tools are callable from MCP clients
    - Return format matches MCP protocol requirements

    **Instructions:**
    - Before starting: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 8 status from `[ ]` to `[-]`
    - After completion: Use `log-implementation` tool with detailed artifacts (tool registrations, Zod schemas defined, integration points)
    - After logging: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 8 status from `[-]` to `[x]`

- [ ] 9. Add unit tests for parser functions
  - File: `libs/aegisx-mcp/src/data/api-contracts-parser.test.ts` (new file)
  - Test markdown parsing with valid contracts
  - Test handling of malformed markdown
  - Test search and filter utilities
  - Test file discovery and caching
  - Purpose: Ensure parser reliability and catch regressions
  - _Leverage: Vitest or Jest testing framework_
  - _Requirements: 1.5_
  - \_Prompt: **Implement the task for spec api-contract-tools, first run spec-workflow-guide to get the workflow guide then implement the task:**

    **Role:** QA Engineer with expertise in unit testing and TDD

    **Task:** Create comprehensive unit tests for parser functions in `libs/aegisx-mcp/src/data/api-contracts-parser.test.ts` following requirement 1.5. Test:
    1. parseContractFile() with valid markdown
    2. parseContractFile() with malformed markdown
    3. searchEndpoints() with various queries
    4. findEndpoint() with exact/partial matches
    5. File discovery and caching behavior

    **Context:** Use test fixtures (sample markdown files) to avoid dependency on real docs. Test both happy paths and error scenarios.

    **Restrictions:**
    - Use Vitest or Jest (check package.json for testing framework)
    - Create test fixtures in test directory (don't rely on real docs/)
    - Mock file system operations for predictable tests
    - Test error handling (missing files, malformed content)
    - Achieve good coverage (>80% of parser code)

    **\_Leverage:** Vitest/Jest testing framework, test fixtures

    **\_Requirements:** 1.5 (Parse API Contract Documents)

    **Success Criteria:**
    - All parser functions have test coverage
    - Tests pass consistently and independently
    - Edge cases covered (empty files, missing sections, etc.)
    - Test fixtures provide realistic contract examples

    **Instructions:**
    - Before starting: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 9 status from `[ ]` to `[-]`
    - After completion: Use `log-implementation` tool with detailed artifacts (test files created, coverage achieved, test cases described)
    - After logging: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 9 status from `[-]` to `[x]`

- [ ] 10. Add unit tests for tool handlers
  - File: `libs/aegisx-mcp/src/tools/api-contracts.tool.test.ts` (new file)
  - Test each tool handler (list, search, get, validate)
  - Test response formatting
  - Test error scenarios (not found, empty results)
  - Purpose: Ensure tool handlers work correctly and format output properly
  - _Leverage: Vitest or Jest, mocks for parser functions_
  - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - \_Prompt: **Implement the task for spec api-contract-tools, first run spec-workflow-guide to get the workflow guide then implement the task:**

    **Role:** QA Engineer with expertise in integration testing and mocking

    **Task:** Create unit tests for tool handlers in `libs/aegisx-mcp/src/tools/api-contracts.tool.test.ts` following requirements 1.1-1.4. Test:
    1. handleApiContractTool routing to correct logic
    2. aegisx_api_list with/without feature filter
    3. aegisx_api_search with various queries
    4. aegisx_api_get for existing and non-existent endpoints
    5. aegisx_api_validate with different validation scenarios

    **Context:** Mock the parser functions to provide controlled test data. Focus on testing handler logic and formatting, not parser internals.

    **Restrictions:**
    - Mock all parser functions (don't test parser here)
    - Test return format matches MCP requirements
    - Verify markdown formatting in output
    - Test error messages are helpful
    - Each test should be independent

    **\_Leverage:** Vitest/Jest, mocking utilities

    **\_Requirements:** 1.1 (List), 1.2 (Search), 1.3 (Get), 1.4 (Validate)

    **Success Criteria:**
    - All tool handlers have test coverage
    - Mocks provide realistic test scenarios
    - Output format is verified in tests
    - Error handling is properly tested

    **Instructions:**
    - Before starting: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 10 status from `[ ]` to `[-]`
    - After completion: Use `log-implementation` tool with detailed artifacts (test files, mocking strategy, coverage)
    - After logging: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 10 status from `[-]` to `[x]`

- [ ] 11. Add integration tests with real contract files
  - File: `libs/aegisx-mcp/tests/integration/api-contracts.integration.test.ts` (new file)
  - Test full flow with real docs/features/ files
  - Test all 4 tools end-to-end
  - Test caching improves performance
  - Purpose: Verify complete functionality with real data
  - _Leverage: Real contract files from docs/features/_
  - _Requirements: All_
  - \_Prompt: **Implement the task for spec api-contract-tools, first run spec-workflow-guide to get the workflow guide then implement the task:**

    **Role:** Integration Test Engineer with expertise in end-to-end testing

    **Task:** Create integration tests in `libs/aegisx-mcp/tests/integration/api-contracts.integration.test.ts` covering all requirements. Test:
    1. Full tool flow from request to response using real contract files
    2. List tool returns all documented endpoints
    3. Search tool finds relevant endpoints
    4. Get tool retrieves complete contract details
    5. Validate tool correctly identifies issues (create test routes if needed)
    6. Caching reduces file read operations on repeated requests

    **Context:** These tests use the real docs/features/ directory, so they verify the system works with actual documentation.

    **Restrictions:**
    - Use real contract files (no mocks for integration tests)
    - Tests should pass even if new features are added to docs/
    - Measure performance improvement from caching
    - Clean up any test artifacts after tests complete
    - Do not modify real contract files during tests

    **\_Leverage:** Real docs/features/ files, Vitest/Jest for async testing

    **\_Requirements:** All (1.1-1.5)

    **Success Criteria:**
    - Integration tests pass with real data
    - All 4 tools work correctly end-to-end
    - Caching demonstrably improves performance
    - Tests are reliable and don't fail on minor doc changes

    **Instructions:**
    - Before starting: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 11 status from `[ ]` to `[-]`
    - After completion: Use `log-implementation` tool with detailed artifacts (integration test suite, test scenarios, performance measurements)
    - After logging: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 11 status from `[-]` to `[x]`

- [ ] 12. Build and verify MCP server
  - Files: `libs/aegisx-mcp/` (entire library)
  - Run `pnpm run build` to compile TypeScript
  - Fix any compilation errors
  - Test MCP server manually with Claude Desktop or compatible client
  - Purpose: Ensure production-ready build and verify real-world functionality
  - _Leverage: pnpm build scripts, MCP client for testing_
  - _Requirements: All_
  - \_Prompt: **Implement the task for spec api-contract-tools, first run spec-workflow-guide to get the workflow guide then implement the task:**

    **Role:** DevOps Engineer with expertise in build systems and deployment verification

    **Task:** Build and verify the aegisx-mcp library following all requirements. Perform:
    1. Run `pnpm run build` from project root
    2. Fix any TypeScript compilation errors
    3. Verify all 4 new tools are registered and accessible
    4. Test tools manually using MCP client (Claude Desktop or test harness)
    5. Verify output formatting is correct and helpful
    6. Check that caching works and improves performance

    **Context:** This is the final verification step. The MCP server should be production-ready and all tools should work as designed.

    **Restrictions:**
    - Must pass `pnpm run build` with zero errors
    - Do not skip TypeScript errors (fix them properly)
    - Test with real MCP client if possible
    - Verify tool descriptions are clear for users
    - Ensure error messages are helpful

    **\_Leverage:** pnpm build system, MCP client for manual testing

    **\_Requirements:** All (1.1-1.5)

    **Success Criteria:**
    - Build completes successfully with no errors
    - All 4 tools are accessible and functional
    - Manual testing confirms correct behavior
    - Output is well-formatted and useful
    - Performance is acceptable (sub-second responses)

    **Instructions:**
    - Before starting: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 12 status from `[ ]` to `[-]`
    - After completion: Use `log-implementation` tool with detailed artifacts (build output, manual test results, any fixes applied)
    - After logging: Edit `.spec-workflow/specs/api-contract-tools/tasks.md` and change task 12 status from `[-]` to `[x]`
