# Requirements Document

## Introduction

The API Contract Tools feature extends the aegisx-mcp (Model Context Protocol) server with capabilities to discover, search, and validate API contracts across the codebase. This feature enables AI agents to quickly find existing API endpoints, understand their contracts, and ensure implementation matches documentation.

Currently, API contracts are documented in `docs/features/*/API_CONTRACTS.md` files, but there is no programmatic way to search or validate them. AI agents must manually grep files or read multiple documents to discover endpoints. This feature provides structured MCP tools that make API discovery fast and reliable.

**Value to Users (AI Agents & Developers):**

- **Fast API Discovery**: Find endpoints without manual file searching
- **Contract Validation**: Verify implementation matches documentation
- **Prevent Duplication**: Discover existing endpoints before creating new ones
- **Improved Development Speed**: Reduce time spent searching for API information

## Alignment with Product Vision

This feature aligns with the project's API-First Development approach outlined in `docs/guides/development/api-calling-standard.md`. By making API contracts easily discoverable through MCP, we:

1. **Strengthen API-First Workflow**: Developers can verify contracts exist before implementing frontend
2. **Reduce Technical Debt**: Prevent duplicate endpoints by making existing APIs discoverable
3. **Improve Documentation Quality**: Validation ensures docs stay synchronized with code
4. **Enhance AI-Assisted Development**: AI agents can work more autonomously with structured API knowledge

## Requirements

### Requirement 1: List All API Endpoints

**User Story:** As an AI agent, I want to list all documented API endpoints across all features, so that I can discover what APIs are available in the system.

#### Acceptance Criteria

1. WHEN `aegisx_api_list()` is called THEN the system SHALL return all endpoints from all `API_CONTRACTS.md` files
2. WHEN listing endpoints THEN the system SHALL include method, path, feature name, and brief description for each
3. WHEN no API contracts exist THEN the system SHALL return an empty list with informative message
4. WHEN `aegisx_api_list(feature)` is called with optional feature filter THEN the system SHALL return only endpoints from that feature

### Requirement 2: Search API Endpoints

**User Story:** As an AI agent, I want to search for API endpoints by keyword, so that I can quickly find relevant endpoints without reading all contracts.

#### Acceptance Criteria

1. WHEN `aegisx_api_search(query)` is called THEN the system SHALL search across endpoint paths, methods, descriptions, and feature names
2. WHEN search query matches multiple endpoints THEN the system SHALL return all matches with relevance ranking
3. WHEN search query includes HTTP method (e.g., "POST /api/budget") THEN the system SHALL prioritize exact method matches
4. WHEN no matches are found THEN the system SHALL return helpful message suggesting similar terms
5. IF search query is empty THEN the system SHALL return validation error

### Requirement 3: Get API Contract Details

**User Story:** As an AI agent, I want to retrieve full contract details for a specific endpoint, so that I can understand request/response formats and implement correctly.

#### Acceptance Criteria

1. WHEN `aegisx_api_get(endpoint)` is called with endpoint path THEN the system SHALL return complete contract including request schema, response schema, authentication, and error responses
2. WHEN endpoint has multiple methods (GET/POST on same path) THEN the system SHALL return all method variants
3. WHEN endpoint includes path parameters THEN the system SHALL return parameter definitions and validation rules
4. WHEN endpoint does not exist THEN the system SHALL return error with suggestions for similar endpoints
5. IF endpoint parameter is empty THEN the system SHALL return validation error

### Requirement 4: Validate API Implementation

**User Story:** As an AI agent, I want to validate that implemented routes match their documented contracts, so that I can ensure consistency between code and documentation.

#### Acceptance Criteria

1. WHEN `aegisx_api_validate(feature)` is called THEN the system SHALL compare documented endpoints in `API_CONTRACTS.md` with actual route implementations
2. WHEN routes match contracts THEN the system SHALL return success message with match count
3. WHEN documented endpoints are missing implementations THEN the system SHALL list missing routes with file paths where they should exist
4. WHEN implemented routes are not documented THEN the system SHALL list undocumented routes requiring contract updates
5. WHEN validation is run without feature parameter THEN the system SHALL validate all features
6. IF HTTP methods mismatch (e.g., contract says POST but implementation uses GET) THEN the system SHALL report method mismatches

### Requirement 5: Parse API Contract Documents

**User Story:** As a system component, I want to reliably parse `API_CONTRACTS.md` files, so that I can extract structured endpoint data for other tools.

#### Acceptance Criteria

1. WHEN parsing API contract markdown THEN the system SHALL extract endpoint method, path, description, request format, response format, and authentication requirements
2. WHEN contract includes code blocks for request/response examples THEN the system SHALL preserve formatting
3. WHEN contract file is malformed THEN the system SHALL report parsing errors with line numbers
4. WHEN contract uses non-standard section headers THEN the system SHALL handle gracefully and extract available information
5. IF contract file does not exist THEN the system SHALL return error indicating missing documentation

## Non-Functional Requirements

### Code Architecture and Modularity

- **Single Responsibility Principle**: Each MCP tool function should handle one specific API contract operation
- **Modular Design**: Parser logic should be separate from MCP tool implementations
- **Dependency Management**: Should integrate cleanly with existing aegisx-mcp structure without modifying core server
- **Clear Interfaces**: MCP tool schemas should be well-documented and consistent with existing aegisx tools

### Performance

- **Fast Search**: API search should complete within 500ms for typical project size (50+ features)
- **Efficient Parsing**: Contract parsing should cache results to avoid re-reading files on every request
- **Scalability**: Should handle projects with 100+ features and 500+ endpoints without performance degradation

### Security

- **Path Traversal Prevention**: File reading should validate paths to prevent accessing files outside `docs/features/` directory
- **Input Validation**: All MCP tool parameters should be validated before processing
- **Error Messages**: Should not expose sensitive file system information in error messages

### Reliability

- **Graceful Degradation**: If some contract files fail to parse, other valid contracts should still be accessible
- **Error Recovery**: Should provide clear error messages when contracts are missing or malformed
- **Consistent Output**: All tools should return data in consistent JSON structure

### Usability

- **Clear Documentation**: Each MCP tool should have clear description and parameter documentation
- **Helpful Error Messages**: Errors should guide users toward resolution (e.g., suggesting similar endpoints when search fails)
- **Consistent Naming**: Tool names should follow existing aegisx-mcp conventions (`aegisx_api_*`)
