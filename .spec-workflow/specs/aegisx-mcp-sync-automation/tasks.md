# Tasks Document

## Phase 1: Setup & Utilities (Foundation)

- [x] 1. Project setup and dependencies
  - Files: `libs/aegisx-mcp/package.json`, `libs/aegisx-mcp/scripts/sync/`
  - Create sync script directory structure
  - Add tsx as devDependency for running TypeScript scripts
  - Configure tsconfig for scripts
  - Purpose: Establish foundation for sync tool development
  - _Leverage: Existing aegisx-mcp tsconfig.json, package.json structure_
  - _Requirements: 5.0 (Build Integration), 6.0 (Manual Sync Command)_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer specializing in Node.js tooling and build configuration | Task: Set up project structure and dependencies for the sync tool following requirements 5.0 and 6.0. Create `libs/aegisx-mcp/scripts/sync/` directory with subdirectories (extractors/, generators/, utils/). Add tsx to devDependencies. Configure TypeScript compilation for scripts directory. | Restrictions: Do not modify existing aegisx-mcp build configuration, maintain compatibility with existing package.json scripts, ensure scripts directory is excluded from main compilation | Success: Directory structure created, tsx installed, tsconfig configured correctly, can run TypeScript files in scripts directory with tsx | Instructions: After implementing, use log-implementation tool to record all created files, configuration changes, and dependencies added with proper artifacts (files created, configuration objects). Then mark task as complete in tasks.md by changing [ ] to [x]._

- [x] 2. TypeScript parser utility
  - File: `libs/aegisx-mcp/scripts/sync/utils/ts-parser.ts`
  - Implement wrapper around TypeScript compiler API
  - Create helper functions for common AST operations
  - Purpose: Provide reusable TypeScript parsing functionality
  - _Leverage: TypeScript compiler API (typescript package)_
  - _Requirements: 1.0 (UI Component Metadata Extraction), 2.0 (CLI Command Metadata Extraction)_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer with expertise in compiler API and AST manipulation | Task: Create TypeScript parser utility following requirements 1.0 and 2.0. Implement functions: createSourceFile(), findDecorator(), getDecoratorArguments(), getPropertyType(), getPropertyInitializer(). Use TypeScript compiler API for robust parsing. | Restrictions: Must handle parsing errors gracefully, do not use eval or unsafe code execution, maintain type safety throughout | Success: All helper functions work correctly, handle edge cases (missing decorators, malformed syntax), unit tests pass | Instructions: After implementing, use log-implementation tool to record the utility functions created with their signatures and purposes. Mark task complete in tasks.md._

- [x] 3. JSDoc parser utility
  - File: `libs/aegisx-mcp/scripts/sync/utils/jsdoc-parser.ts`
  - Implement JSDoc comment extraction and parsing
  - Extract @example, @description, and other tags
  - Purpose: Parse documentation from source code comments
  - _Leverage: TypeScript compiler API for JSDoc access_
  - _Requirements: 1.0 (UI Component Metadata Extraction)_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Documentation Engineer with expertise in JSDoc and code documentation parsing | Task: Create JSDoc parser utility following requirement 1.0. Implement functions: getJSDocComment(), getJSDocTags(), parseExampleTag(), parseDescriptionTag(). Parse and clean JSDoc comments from TypeScript nodes. | Restrictions: Must preserve code formatting in examples, handle missing JSDoc gracefully, sanitize extracted content | Success: Extracts JSDoc correctly from various comment styles, handles multi-line examples, unit tests cover edge cases | Instructions: After implementing, log utility functions and test cases with log-implementation tool. Mark complete in tasks.md._

- [x] 4. File scanner utility
  - File: `libs/aegisx-mcp/scripts/sync/utils/file-scanner.ts`
  - Implement recursive directory scanning
  - Filter files by patterns (_.component.ts, _.js)
  - Purpose: Discover source files to process
  - _Leverage: Node.js fs and path modules_
  - _Requirements: 1.0, 2.0, 3.0 (All extraction requirements)_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Node.js Developer with expertise in filesystem operations and async programming | Task: Create file scanner utility following requirements 1.0, 2.0, 3.0. Implement functions: scanDirectory(), readFileContent(), isComponentFile(). Use async/await for file operations. Support pattern matching and recursive scanning. | Restrictions: Must handle permission errors gracefully, use async operations to avoid blocking, validate file paths for security | Success: Scans directories efficiently, filters files correctly by pattern, handles filesystem errors without crashing | Instructions: Log implementation with file paths handled, error scenarios covered. Mark complete in tasks.md._

- [x] 5. Code formatter utility
  - File: `libs/aegisx-mcp/scripts/sync/utils/code-formatter.ts`
  - Implement TypeScript code formatting
  - Add file header generation with metadata
  - Purpose: Ensure generated files have consistent formatting
  - _Leverage: String manipulation, TypeScript formatting conventions_
  - _Requirements: 4.0 (MCP Data File Generation)_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Code Quality Engineer with expertise in code formatting and style guidelines | Task: Create code formatter utility following requirement 4.0. Implement functions: formatTypeScript(), addFileHeader(), indentCode(). Ensure consistent 2-space indentation, proper line breaks, and TypeScript conventions. | Restrictions: Must not alter code semantics, maintain valid TypeScript syntax, use deterministic formatting | Success: Formats TypeScript code consistently, adds proper headers with generation timestamp, handles edge cases (long lines, nested objects) | Instructions: Log formatter functions and formatting rules applied. Mark complete in tasks.md._

- [x] 6. File writer utility
  - File: `libs/aegisx-mcp/scripts/sync/utils/file-writer.ts`
  - Implement safe file writing with validation
  - Add TypeScript compilation check before writing
  - Purpose: Write generated files safely with validation
  - _Leverage: Node.js fs module, TypeScript compiler API for validation_
  - _Requirements: 4.0 (MCP Data File Generation)_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with expertise in file operations and validation | Task: Create file writer utility following requirement 4.0. Implement functions: writeFile(), validateTypeScript(), ensureDirectoryExists(). Validate generated TypeScript before writing. Support dry-run mode. | Restrictions: Must validate TypeScript syntax before writing, handle write permissions gracefully, ensure atomic writes (no partial files) | Success: Writes files safely, validates TypeScript compilation, dry-run mode works correctly, handles errors without leaving corrupt files | Instructions: Log file operations, validation steps, error handling with log-implementation tool. Mark complete in tasks.md._

## Phase 2: Extractors

- [x] 7. Component extractor - Core implementation
  - File: `libs/aegisx-mcp/scripts/sync/extractors/component-extractor.ts`
  - Implement component file scanning and basic parsing
  - Extract component decorator metadata (selector, name)
  - Determine category from directory structure
  - Purpose: Extract basic component information from aegisx-ui
  - _Leverage: TypeScript parser utility, File scanner utility_
  - _Requirements: 1.0 (UI Component Metadata Extraction) - Basic metadata_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Angular Developer with expertise in component architecture and TypeScript AST parsing | Task: Create component extractor core following requirement 1.0. Scan `libs/aegisx-ui/src/lib/components/` directory, parse component files, extract @Component decorator metadata (selector, standalone flag). Determine category from parent directory name. | Restrictions: Must handle various component file structures, skip non-component files, validate extracted data structure | Success: Finds all component files, extracts selector and name correctly, determines category accurately, handles missing decorators gracefully | Instructions: Log extracted component count, sample extracted data, files processed. Mark complete in tasks.md._

- [x] 8. Component extractor - Input/Output extraction
  - File: `libs/aegisx-mcp/scripts/sync/extractors/component-extractor.ts` (continue)
  - Extract @Input decorators with types and defaults
  - Extract @Output decorators with types
  - Parse JSDoc comments for descriptions
  - Purpose: Complete component metadata extraction
  - _Leverage: TypeScript parser utility, JSDoc parser utility_
  - _Requirements: 1.0 (UI Component Metadata Extraction) - Complete metadata_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Angular Developer with expertise in decorators and TypeScript metadata | Task: Extend component extractor following requirement 1.0. Extract @Input decorators (name, type, default value, required flag), @Output decorators (name, type). Parse JSDoc for descriptions. Handle various decorator syntax (property decorators, constructor parameters). | Restrictions: Must preserve type information accurately, handle union types and complex types, extract default values correctly | Success: Extracts all inputs/outputs with correct types and defaults, JSDoc descriptions parsed correctly, handles various decorator patterns | Instructions: Log input/output extraction statistics, type handling approach. Mark complete in tasks.md._

- [x] 9. Component extractor - Documentation extraction
  - File: `libs/aegisx-mcp/scripts/sync/extractors/component-extractor.ts` (continue)
  - Extract usage examples from JSDoc @example tags
  - Extract best practices from JSDoc comments
  - Parse related components information
  - Purpose: Extract documentation and usage information
  - _Leverage: JSDoc parser utility_
  - _Requirements: 1.0 (UI Component Metadata Extraction) - Documentation_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Technical Writer with expertise in code documentation and examples | Task: Complete component extractor following requirement 1.0. Extract usage examples from @example tags preserving code formatting. Parse best practices from component class JSDoc. Extract related components from documentation comments. | Restrictions: Must preserve code formatting in examples, handle multi-line examples, clean up comment markers | Success: Extracts complete usage examples with proper formatting, identifies best practices, finds related component references | Instructions: Log documentation extraction results, example count, related components found. Mark complete in tasks.md._

- [x] 10. Command extractor - Package information
  - File: `libs/aegisx-mcp/scripts/sync/extractors/command-extractor.ts`
  - Parse QUICK_REFERENCE.md for package information
  - Extract standard, enterprise, and full package details
  - Parse features, use cases, and commands
  - Purpose: Extract CRUD generator package information
  - _Leverage: File scanner utility, Markdown parsing_
  - _Requirements: 2.0 (CLI Command Metadata Extraction) - Packages_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Documentation Engineer with expertise in Markdown parsing and CLI tools | Task: Create command extractor for package information following requirement 2.0. Read `libs/aegisx-cli/docs/QUICK_REFERENCE.md`, extract package information (standard, enterprise, full). Parse features lists, use cases, command examples. | Restrictions: Must handle Markdown formatting correctly, extract code blocks accurately, validate package structure | Success: Extracts all three packages with complete information, features and use cases parsed correctly, command strings extracted accurately | Instructions: Log package extraction results, markdown sections processed. Mark complete in tasks.md._

- [x] 11. Command extractor - Command definitions
  - File: `libs/aegisx-mcp/scripts/sync/extractors/command-extractor.ts` (continue)
  - Parse JavaScript generator files for command definitions
  - Extract command names, descriptions, options
  - Parse option types, defaults, and descriptions
  - Purpose: Extract CLI command metadata from source code
  - _Leverage: TypeScript parser utility, File scanner utility_
  - _Requirements: 2.0 (CLI Command Metadata Extraction) - Commands_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: CLI Tools Developer with expertise in command-line interfaces and commander.js | Task: Extend command extractor following requirement 2.0. Scan `libs/aegisx-cli/lib/generators/`, parse JavaScript files for command definitions. Extract command names, descriptions, options (name, alias, type, default, description). | Restrictions: Must handle various command definition patterns, parse option configurations correctly, validate extracted data | Success: Extracts all commands with complete metadata, options parsed with correct types and defaults, handles various CLI frameworks | Instructions: Log command extraction statistics, option types found, files processed. Mark complete in tasks.md._

- [x] 12. Command extractor - Examples and documentation
  - File: `libs/aegisx-mcp/scripts/sync/extractors/command-extractor.ts` (continue)
  - Extract usage examples from documentation
  - Parse notes and additional information
  - Combine data from multiple sources
  - Purpose: Complete command documentation extraction
  - _Leverage: File scanner utility, existing extracted data_
  - _Requirements: 2.0 (CLI Command Metadata Extraction) - Complete_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Documentation Specialist with expertise in CLI documentation and examples | Task: Complete command extractor following requirement 2.0. Extract usage examples from QUICK_REFERENCE.md, parse notes sections, combine information from source code and documentation. Create complete CommandInfo objects. | Restrictions: Must merge data from multiple sources correctly, preserve example formatting, validate completeness | Success: Extracts all examples and notes, combines data sources accurately, produces complete CommandInfo with all fields populated | Instructions: Log final command count, data merge strategy, completeness validation. Mark complete in tasks.md._

- [x] 13. Pattern extractor implementation
  - File: `libs/aegisx-mcp/scripts/sync/extractors/pattern-extractor.ts`
  - Read existing patterns.ts file
  - Validate pattern structure and completeness
  - Support manual pattern additions via configuration
  - Purpose: Maintain and validate development patterns
  - _Leverage: TypeScript parser utility, File scanner utility_
  - _Requirements: 3.0 (Development Pattern Metadata Extraction)_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with expertise in design patterns and code templates | Task: Create pattern extractor following requirement 3.0. Read current `libs/aegisx-mcp/src/data/patterns.ts`, validate pattern structure (name, category, code, language, notes). Support adding patterns from external files. Validate code examples are complete. | Restrictions: Must preserve existing patterns unchanged, validate pattern completeness, handle missing fields gracefully | Success: Reads existing patterns correctly, validates structure, supports manual additions, ensures all patterns are complete | Instructions: Log pattern count, validation results, any incomplete patterns found. Mark complete in tasks.md._

## Phase 3: Generators

- [x] 14. Components generator implementation
  - File: `libs/aegisx-mcp/scripts/sync/generators/components-generator.ts`
  - Transform ExtractedComponent[] to ComponentInfo[] format
  - Generate valid TypeScript with imports and interfaces
  - Apply code formatting and add file header
  - Purpose: Generate components.ts from extracted data
  - _Leverage: Code formatter utility, File writer utility_
  - _Requirements: 4.0 (MCP Data File Generation) - Components_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Code Generation Specialist with expertise in TypeScript and template generation | Task: Create components generator following requirement 4.0. Transform extracted component data to ComponentInfo format. Generate valid TypeScript file with proper imports, interface definitions, and data array. Use code formatter for consistent output. | Restrictions: Must maintain existing interface structure, generate valid TypeScript that compiles, preserve all extracted data | Success: Generates valid components.ts file, maintains correct TypeScript syntax, includes all extracted components, file compiles without errors | Instructions: Log generation statistics (components generated, file size), validate output compilation. Mark complete in tasks.md._

- [x] 15. Commands generator implementation
  - File: `libs/aegisx-mcp/scripts/sync/generators/commands-generator.ts`
  - Transform ExtractedCommand[] and ExtractedPackage[] to target format
  - Generate valid TypeScript with proper structure
  - Format and add metadata
  - Purpose: Generate crud-commands.ts from extracted data
  - _Leverage: Code formatter utility, File writer utility_
  - _Requirements: 4.0 (MCP Data File Generation) - Commands_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Code Generation Specialist with expertise in CLI documentation and TypeScript | Task: Create commands generator following requirement 4.0. Transform extracted command and package data to CommandInfo and PackageInfo formats. Generate valid TypeScript with interfaces and data arrays. Apply consistent formatting. | Restrictions: Must maintain existing interface structure, handle various option types correctly, generate compilable code | Success: Generates valid crud-commands.ts file, includes all commands and packages, proper TypeScript syntax, compiles successfully | Instructions: Log command/package count generated, file structure validation. Mark complete in tasks.md._

- [x] 16. Patterns generator implementation
  - File: `libs/aegisx-mcp/scripts/sync/generators/patterns-generator.ts`
  - Transform ExtractedPattern[] to CodePattern[] format
  - Handle code snippet escaping correctly
  - Generate valid TypeScript with preserved formatting
  - Purpose: Generate patterns.ts from extracted/validated data
  - _Leverage: Code formatter utility, File writer utility_
  - _Requirements: 4.0 (MCP Data File Generation) - Patterns_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Code Generation Specialist with expertise in string escaping and template literals | Task: Create patterns generator following requirement 4.0. Transform extracted pattern data to CodePattern format. Handle proper escaping of code snippets (preserve formatting, escape special characters). Generate valid TypeScript. | Restrictions: Must preserve code formatting in snippets, escape strings correctly, maintain pattern categories | Success: Generates valid patterns.ts file, code snippets preserved with correct formatting, compiles without errors, patterns are usable | Instructions: Log pattern count generated, escaping strategy used, validation results. Mark complete in tasks.md._

## Phase 4: Integration & CLI

- [x] 17. Sync script - Main orchestrator
  - File: `libs/aegisx-mcp/scripts/sync/sync.ts`
  - Implement main sync process coordination
  - Execute extractors in parallel
  - Call generators with extracted data
  - Purpose: Orchestrate complete sync workflow
  - _Leverage: All extractors, all generators, utilities_
  - _Requirements: 6.0 (Manual Sync Command) - Core functionality_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: System Architect with expertise in orchestration and async workflows | Task: Create main sync script following requirement 6.0. Implement orchestration: run component, command, pattern extractors in parallel using Promise.all(). Collect results. Call respective generators with extracted data. Handle errors gracefully. | Restrictions: Must run extractors in parallel for performance, collect all errors before failing, ensure atomic operations (all or nothing) | Success: Orchestrates complete workflow efficiently, handles errors without leaving partial state, provides clear progress indication | Instructions: Log workflow execution timeline, parallelization benefits, error handling strategy. Mark complete in tasks.md._

- [x] 18. Sync script - CLI and reporting
  - File: `libs/aegisx-mcp/scripts/sync/sync.ts` (continue)
  - Parse command-line arguments (--dry-run, --verbose)
  - Implement progress reporting and statistics
  - Add error reporting with file paths
  - Purpose: Provide user-friendly CLI interface
  - _Leverage: Node.js process.argv_
  - _Requirements: 6.0 (Manual Sync Command) - CLI features_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: CLI Developer with expertise in user experience and progress reporting | Task: Complete sync script following requirement 6.0. Parse CLI arguments (--dry-run, --verbose, --help). Implement progress indicators (spinner or progress bar). Report statistics (components found, files generated). Format error messages with file paths and suggestions. | Restrictions: Must provide clear progress feedback, handle --dry-run without writing files, make error messages actionable | Success: CLI arguments work correctly, progress is visible during execution, statistics reported clearly, errors are user-friendly | Instructions: Log CLI features implemented, user feedback mechanisms, dry-run verification. Mark complete in tasks.md._

- [x] 19. Package.json integration
  - File: `libs/aegisx-mcp/package.json`
  - Add sync scripts (sync, sync:dry-run, sync:verbose)
  - Add prebuild hook to run sync automatically
  - Verify tsx is in devDependencies
  - Purpose: Integrate sync tool with build process
  - _Leverage: Existing package.json scripts structure_
  - _Requirements: 5.0 (Build Integration)_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Build Engineer with expertise in npm scripts and build pipelines | Task: Integrate sync tool into package.json following requirement 5.0. Add scripts: "sync": "tsx scripts/sync/sync.ts", "sync:dry-run": "tsx scripts/sync/sync.ts --dry-run", "sync:verbose": "tsx scripts/sync/sync.ts --verbose". Add "prebuild": "pnpm run sync" to run sync before build. | Restrictions: Must not break existing build scripts, ensure sync runs before compilation, maintain script naming conventions | Success: All sync scripts work correctly, prebuild hook runs sync automatically, build process integrates smoothly | Instructions: Log script additions, prebuild hook verification, integration testing results. Mark complete in tasks.md._

## Phase 5: Testing

- [x] 20. Unit tests - Utilities
  - Files: `libs/aegisx-mcp/scripts/sync/__tests__/utils/*.test.ts`
  - Write tests for TypeScript parser utility
  - Write tests for JSDoc parser utility
  - Write tests for file scanner, formatter, writer utilities
  - Purpose: Ensure utility functions work correctly
  - _Leverage: Vitest testing framework_
  - _Requirements: All utility-related requirements_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer with expertise in unit testing and Vitest framework | Task: Create comprehensive unit tests for all utility functions. Test TypeScript parser (AST operations), JSDoc parser (comment extraction), file scanner (directory traversal), code formatter (output formatting), file writer (safe writes, validation). Use Vitest for testing. | Restrictions: Must test both success and failure scenarios, mock file system operations where appropriate, ensure tests are isolated | Success: All utility functions have >85% coverage, edge cases tested, tests run independently and consistently, all tests pass | Instructions: Log test coverage results, edge cases covered, mock strategies used. Mark complete in tasks.md._

- [x] 21. Unit tests - Extractors
  - Files: `libs/aegisx-mcp/scripts/sync/__tests__/extractors/*.test.ts`
  - Write tests for component extractor with sample components
  - Write tests for command extractor with sample CLI files
  - Write tests for pattern extractor
  - Purpose: Ensure extractors parse source files correctly
  - _Leverage: Vitest, test fixtures in **tests**/fixtures/_
  - _Requirements: 1.0, 2.0, 3.0 (All extraction requirements)_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer with expertise in integration testing and mock data | Task: Create unit tests for all extractors following requirements 1.0, 2.0, 3.0. Create fixture files (sample components, CLI files, patterns). Test extraction accuracy, error handling, edge cases (missing decorators, malformed JSDoc). Use Vitest. | Restrictions: Must use realistic test fixtures, test various file structures, validate extracted data completeness | Success: All extractors have >80% coverage, fixtures represent real-world scenarios, tests validate data accuracy, error handling tested | Instructions: Log fixture creation, test scenarios covered, extraction accuracy validation. Mark complete in tasks.md._

- [x] 22. Unit tests - Generators
  - Files: `libs/aegisx-mcp/scripts/sync/__tests__/generators/*.test.ts`
  - Write tests for all three generators
  - Validate generated TypeScript syntax
  - Test dry-run mode
  - Purpose: Ensure generators produce valid TypeScript
  - _Leverage: Vitest, TypeScript compiler API for validation_
  - _Requirements: 4.0 (MCP Data File Generation)_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer with expertise in code generation testing | Task: Create unit tests for all generators following requirement 4.0. Test transformation accuracy (input to output), TypeScript syntax validation (use TS compiler API), code formatting consistency, dry-run mode behavior. Use Vitest. | Restrictions: Must validate generated code compiles, test with various input data shapes, ensure dry-run doesn't write files | Success: All generators have >90% coverage, generated code always compiles, formatting is consistent, dry-run tested | Instructions: Log validation strategy, TypeScript compilation tests, dry-run verification. Mark complete in tasks.md._

- [x] 23. Integration tests - Full sync workflow
  - File: `libs/aegisx-mcp/scripts/sync/__tests__/integration/sync-workflow.test.ts`
  - Test complete sync process end-to-end
  - Verify generated files against expected output
  - Test error scenarios (missing files, permissions)
  - Purpose: Validate complete sync workflow
  - _Leverage: Vitest, test fixtures, temporary directories_
  - _Requirements: All requirements end-to-end_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Integration Test Engineer with expertise in end-to-end testing | Task: Create integration tests for complete sync workflow covering all requirements. Test full extraction → generation pipeline. Verify output files match expected structure. Test error scenarios (missing source files, permission errors, malformed data). Use temporary directories for test isolation. | Restrictions: Must clean up test files, test in isolated environment, validate actual file writes | Success: Integration tests cover all critical workflows, error scenarios handled correctly, tests are reliable and isolated | Instructions: Log test scenarios covered, error handling validation, cleanup verification. Mark complete in tasks.md._

## Phase 6: Documentation & Validation

- [x] 24. Manual testing with real data
  - Run sync against actual aegisx-ui and aegisx-cli
  - Verify generated files compile successfully
  - Compare generated data with current data files
  - Purpose: Validate sync tool works with production data
  - _Leverage: Real aegisx-ui components, real aegisx-cli commands_
  - _Requirements: All requirements validation_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer with expertise in manual testing and validation | Task: Perform manual testing with real production data covering all requirements. Run sync script against actual libs/aegisx-ui and libs/aegisx-cli. Verify generated components.ts, crud-commands.ts, patterns.ts compile without errors. Compare with current files to ensure completeness. Build aegisx-mcp and test MCP server. | Restrictions: Must not overwrite production files during testing (use --dry-run first), document any discrepancies, validate all components/commands extracted | Success: Sync runs successfully on real data, generated files compile, no components/commands missing, MCP server works with generated data | Instructions: Log validation results, any discrepancies found, component/command count comparison. Mark complete in tasks.md._

- [x] 25. README documentation
  - File: `libs/aegisx-mcp/scripts/sync/README.md`
  - Document sync tool architecture and usage
  - Add examples and troubleshooting guide
  - Document extension points for future enhancements
  - Purpose: Provide comprehensive documentation for maintainers
  - _Leverage: Design document sections_
  - _Requirements: Documentation for all features_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Technical Writer with expertise in developer documentation | Task: Create comprehensive README for sync tool covering all features. Document architecture (extractors, generators, utilities), usage (CLI commands, options), examples (common workflows), troubleshooting (common errors and solutions). Explain how to extend extractors/generators. | Restrictions: Must be clear and concise, include code examples, provide actionable troubleshooting steps | Success: Documentation is complete and easy to follow, covers all CLI options, includes helpful examples, troubleshooting guide is practical | Instructions: Log documentation structure, examples included, coverage of features. Mark complete in tasks.md._

- [x] 26. Update aegisx-mcp main README
  - File: `libs/aegisx-mcp/README.md`
  - Add section about data synchronization
  - Document that data files are auto-generated
  - Update development workflow documentation
  - Purpose: Inform users about sync automation
  - _Leverage: Existing README structure_
  - _Requirements: Documentation_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Technical Writer with expertise in user-facing documentation | Task: Update main aegisx-mcp README to document sync automation. Add "Data Synchronization" section explaining that components.ts, crud-commands.ts, patterns.ts are auto-generated. Update "Development" section with sync commands. Add note that manual edits to data files will be overwritten. | Restrictions: Must maintain existing README structure, keep it concise, provide clear warnings about auto-generation | Success: README clearly documents sync automation, users understand data files are generated, development workflow updated | Instructions: Log README changes, warnings added, user feedback considerations. Mark complete in tasks.md._

- [x] 27. Final validation and cleanup
  - Run full test suite (unit + integration)
  - Execute sync and build aegisx-mcp
  - Test MCP server with generated data
  - Clean up any debug code or console.logs
  - Purpose: Final quality assurance before completion
  - _Leverage: All tests, build scripts, MCP server_
  - _Requirements: All requirements final validation_
  - _Prompt: Implement the task for spec aegisx-mcp-sync-automation, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Senior Developer with expertise in quality assurance and code review | Task: Perform final validation covering all requirements. Run complete test suite ensuring all tests pass. Execute sync script and verify successful execution. Build aegisx-mcp with `pnpm run build`. Start MCP server and test component/command queries. Remove debug code, console.logs, TODOs. Ensure code quality standards met. | Restrictions: Must ensure all tests pass, no breaking changes to existing functionality, code is production-ready | Success: All tests pass, sync executes cleanly, aegisx-mcp builds successfully, MCP server works with generated data, code is clean and documented | Instructions: Log validation checklist results, any issues found and fixed, final test coverage. Mark complete in tasks.md._

## Summary

**Total Tasks:** 27 tasks organized in 6 phases

**Estimated Effort:**

- Phase 1 (Setup & Utilities): ~8 hours
- Phase 2 (Extractors): ~12 hours
- Phase 3 (Generators): ~6 hours
- Phase 4 (Integration & CLI): ~4 hours
- Phase 5 (Testing): ~10 hours
- Phase 6 (Documentation & Validation): ~5 hours
- **Total: ~45 hours**

**Key Dependencies:**

- Phases 1 must complete before Phase 2 and 3
- Phase 4 requires completion of Phases 1, 2, and 3
- Phase 5 can run alongside Phase 4 (some tests can be written during development)
- Phase 6 is final and requires all other phases complete

**Critical Path:**
Setup → Utilities → Extractors → Generators → Integration → Testing → Documentation → Validation
