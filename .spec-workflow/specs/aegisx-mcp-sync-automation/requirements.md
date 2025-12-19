# Requirements Document

## Introduction

The aegisx-mcp library currently maintains hardcoded data files (`components.ts`, `crud-commands.ts`, `patterns.ts`) that provide AI assistants with information about AegisX UI components and CLI commands. When components or commands are added/modified in aegisx-ui or aegisx-cli, the corresponding data in aegisx-mcp must be manually updated, leading to synchronization issues and maintenance overhead.

This feature will create an automated synchronization system that extracts metadata from aegisx-ui components and aegisx-cli commands, then generates the aegisx-mcp data files automatically. This ensures the MCP server always provides accurate, up-to-date information to AI assistants without manual intervention.

## Alignment with Product Vision

This feature supports the AegisX platform's goal of providing developer-friendly tools by:

- **Reducing maintenance overhead**: Automating repetitive manual updates
- **Improving data accuracy**: Ensuring MCP data stays synchronized with source libraries
- **Enhancing developer experience**: AI assistants receive current, accurate information
- **Supporting scalability**: Easy to add new components/commands without MCP updates

## Requirements

### Requirement 1: UI Component Metadata Extraction

**User Story:** As a developer, I want component metadata to be automatically extracted from aegisx-ui source code, so that the MCP server provides accurate component information without manual updates.

#### Acceptance Criteria

1. WHEN aegisx-ui component files are processed THEN the system SHALL extract component selector, name, and category
2. WHEN component decorators are parsed THEN the system SHALL extract all @Input properties with their types, defaults, and descriptions
3. WHEN component decorators are parsed THEN the system SHALL extract all @Output events with their types and descriptions
4. WHEN JSDoc comments are present THEN the system SHALL extract usage examples and best practices
5. IF a component has related components listed THEN the system SHALL extract those relationships
6. WHEN extraction is complete THEN the system SHALL generate a TypeScript interface matching the current ComponentInfo format

### Requirement 2: CLI Command Metadata Extraction

**User Story:** As a developer, I want CLI command metadata to be automatically extracted from aegisx-cli source code and documentation, so that the MCP server provides accurate command information.

#### Acceptance Criteria

1. WHEN aegisx-cli command files are processed THEN the system SHALL extract command names, descriptions, and usage patterns
2. WHEN command options are parsed THEN the system SHALL extract option names, aliases, types, defaults, and descriptions
3. WHEN documentation files exist THEN the system SHALL extract examples and notes
4. WHEN package information is parsed THEN the system SHALL extract features, use cases, and package details
5. WHEN extraction is complete THEN the system SHALL generate a TypeScript interface matching the current CommandInfo and PackageInfo formats

### Requirement 3: Development Pattern Metadata Extraction

**User Story:** As a developer, I want development patterns to be automatically extracted and maintained, so that the MCP server provides current coding patterns and best practices.

#### Acceptance Criteria

1. WHEN pattern source files are processed THEN the system SHALL extract pattern names, categories, and descriptions
2. WHEN code examples exist THEN the system SHALL extract complete code snippets with language tags
3. WHEN pattern documentation exists THEN the system SHALL extract notes and related patterns
4. WHEN extraction is complete THEN the system SHALL generate a TypeScript interface matching the current CodePattern format

### Requirement 4: MCP Data File Generation

**User Story:** As a developer, I want extracted metadata to be automatically formatted and written to aegisx-mcp data files, so that the MCP server uses the latest component and command information.

#### Acceptance Criteria

1. WHEN metadata extraction is complete THEN the system SHALL generate `libs/aegisx-mcp/src/data/components.ts` with all extracted UI component data
2. WHEN metadata extraction is complete THEN the system SHALL generate `libs/aegisx-mcp/src/data/crud-commands.ts` with all extracted CLI command data
3. WHEN metadata extraction is complete THEN the system SHALL generate `libs/aegisx-mcp/src/data/patterns.ts` with all extracted pattern data
4. WHEN files are generated THEN they SHALL maintain the current TypeScript interfaces and export structures
5. WHEN files are generated THEN they SHALL include proper TypeScript types and formatting
6. WHEN files are generated THEN they SHALL be valid TypeScript that passes compilation

### Requirement 5: Build Integration

**User Story:** As a developer, I want the synchronization process to integrate with the existing build pipeline, so that MCP data is automatically updated during development and deployment.

#### Acceptance Criteria

1. WHEN aegisx-mcp is built THEN the system SHALL automatically run the sync process before compilation
2. WHEN sync script is executed THEN it SHALL report extraction statistics (components found, commands found, patterns found)
3. WHEN sync encounters errors THEN it SHALL provide clear error messages with file paths and line numbers
4. WHEN sync completes successfully THEN it SHALL exit with status code 0
5. IF sync fails THEN it SHALL exit with non-zero status code and prevent build continuation

### Requirement 6: Manual Sync Command

**User Story:** As a developer, I want a standalone command to manually trigger synchronization, so that I can update MCP data on demand during development.

#### Acceptance Criteria

1. WHEN developer runs sync command THEN the system SHALL execute extraction and generation process
2. WHEN sync command runs THEN it SHALL display progress indicators for each phase
3. WHEN sync command completes THEN it SHALL display summary of changes (files updated, items added/modified)
4. WHEN using `--dry-run` flag THEN the system SHALL preview changes without writing files
5. WHEN using `--verbose` flag THEN the system SHALL display detailed extraction information

## Non-Functional Requirements

### Code Architecture and Modularity

- **Single Responsibility Principle**:
  - Separate extractors for UI components, CLI commands, and patterns
  - Independent generator for each data file type
  - Isolated file system operations from extraction logic

- **Modular Design**:
  - Extractor modules that can run independently
  - Generator modules that accept extracted data as input
  - Reusable TypeScript AST parsing utilities

- **Dependency Management**:
  - Minimize dependencies - use Node.js built-ins where possible
  - Use TypeScript compiler API for AST parsing
  - No unnecessary external libraries

- **Clear Interfaces**:
  - Well-defined interfaces for extracted metadata
  - Clean separation between extraction, transformation, and generation
  - Type-safe communication between modules

### Performance

- Extraction and generation should complete in under 5 seconds for typical workspace
- Incremental updates should only process changed files (future enhancement)
- Memory usage should stay under 500MB during extraction

### Reliability

- Must handle missing or malformed source files gracefully
- Should validate generated TypeScript before writing files
- Must maintain data integrity - no partial updates on failure
- Should preserve existing data format and structure

### Maintainability

- Code should be well-documented with JSDoc comments
- Extraction logic should be easy to extend for new component types
- Error messages should be actionable and developer-friendly
- Should include unit tests for extraction and generation logic

### Usability

- Zero configuration required for standard workspace layout
- Clear progress feedback during extraction
- Helpful error messages with file paths and suggestions
- Documentation for extending extraction logic
