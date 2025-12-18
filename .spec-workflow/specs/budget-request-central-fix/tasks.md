# Budget Request Central Fix - Tasks

**Version:** 1.0.0
**Created:** 2025-12-17
**Status:** Ready for Implementation

---

## Phase 1: Code Changes (Priority: HIGH)

- [x] 1.1 Update create() method to accept null department_id
  - File: apps/api/src/layers/domains/inventory/budget/budgetRequests/budget-requests.service.ts
  - Lines: 87-148
  - Remove auto-populate logic that throws USER_NO_DEPARTMENT error
  - Accept department_id from request data directly, allow null values
  - Add audit logging when department_id is null
  - Simplify method from ~60 lines to ~30 lines
  - _Leverage: Existing this.logger, this.generateRequestNumber(), super.create() methods_
  - _Requirements: BR-1, TR-1_
  - _Prompt: Role: Backend Service Developer | Task: Update the BudgetRequestsService.create() method to support central budget requests with null department_id by removing auto-populate logic (lines 100-132) and accepting department_id from request directly, maintaining backward compatibility with department-specific requests | Restrictions: Do not modify method signature, do not remove request_number generation logic, do not change other methods in the service, must add audit logging for central requests | Success: Auto-populate logic completely removed, method accepts null department_id without throwing error, audit log written when department_id is null, method simplified to approximately 30 lines, TypeScript compilation passes, no breaking changes to existing functionality_

- [x] 1.2 Update approveFinance() method to skip allocations for central requests
  - File: apps/api/src/layers/domains/inventory/budget/budgetRequests/budget-requests.service.ts
  - Lines: 618-628
  - Replace error throw with skip logic when department_id is null
  - Use continue statement to skip budget_allocations creation
  - Add audit logging for skipped allocations
  - Allow finance approval to complete successfully
  - _Leverage: Existing this.logger, continue statement for loop control_
  - _Requirements: BR-2, TR-2_
  - _Prompt: Role: Backend Service Developer | Task: Update the BudgetRequestsService.approveFinance() method to skip allocation creation for central budget requests by replacing error throw with skip logic and continue statement, while maintaining allocation creation for department-specific requests | Restrictions: Do not modify method signature, do not remove status update logic, do not change allocation creation logic for department-specific requests, must add audit logging for skipped allocations | Success: Error throw for null department_id removed, skip logic added with continue statement, audit log written when allocations skipped, finance approval succeeds for central requests, TypeScript compilation passes, department-specific requests still create allocations_

---

## Phase 2: Testing (Priority: HIGH)

- [x] 2.1 Write unit tests for central budget request support
  - File: apps/api/src/layers/domains/inventory/budget/budgetRequests/budget-requests.service.spec.ts
  - Test create() with null department_id (should succeed)
  - Test create() does not throw USER_NO_DEPARTMENT error
  - Test approveFinance() with null department_id (should succeed)
  - Test approveFinance() skips allocation creation for null department_id
  - Test backward compatibility with department-specific requests
  - _Leverage: Existing test utilities, mocking patterns in spec file, Jest matchers_
  - _Requirements: BR-1, BR-2, BR-3_
  - _Prompt: Role: QA Engineer / Test Developer | Task: Write comprehensive unit tests for central budget request support covering create() method with null department_id and approveFinance() with null department_id, verifying no errors thrown, allocations skipped, and backward compatibility maintained | Restrictions: Do not modify service implementation, do not skip test cases, must mock database calls appropriately, must test both success and edge cases | Success: All 5 test cases implemented (create with null, no USER_NO_DEPARTMENT error, approve finance without allocations, skip allocation creation, department-specific still works), tests pass with npm test or pnpm test, code coverage maintained or improved, mock setup is clean and reusable_

- [x] 2.2 Perform integration testing of full workflow
  - Test: POST /api/inventory/budget/budget-requests with null department_id
  - Test: Full workflow Create → Submit → Dept Approve → Finance Approve
  - Start API server and use curl or Postman for testing
  - Verify all endpoints return correct status codes (201 Created, 200 OK)
  - Verify no errors in server logs
  - Verify audit messages appear in logs
  - _Leverage: curl or Postman, server logs from pnpm run dev:api, existing test user tokens_
  - _Requirements: BR-1, BR-2, BR-3_
  - _Prompt: Role: QA Engineer | Task: Perform end-to-end integration testing of central budget request workflow by testing API endpoints with real server, verifying create request with null department_id succeeds and full approval workflow completes successfully without allocation errors | Restrictions: Do not modify any code, must use real API server not mocks, must verify logs for audit messages, must test with actual authentication tokens | Success: Create request with null department_id succeeds (201 Created), full approval workflow completes successfully, finance approval succeeds without allocation errors, server logs show audit messages, no error responses or stack traces_

---

## Phase 3: Documentation (Priority: MEDIUM)

- [x] 3.1 Update API documentation in Swagger
  - Update: Swagger/OpenAPI schema for budget requests endpoints
  - Document department_id field as optional and nullable
  - Add example request showing central request with null department_id
  - Update error codes documentation (USER_NO_DEPARTMENT removed from create endpoint)
  - Verify in Swagger UI: http://localhost:4249/documentation
  - _Leverage: Existing Swagger decorators in route files, TypeBox schema definitions_
  - _Requirements: BR-1, BR-2_
  - _Prompt: Role: Technical Writer / API Documentation Specialist | Task: Update API documentation in Swagger to reflect central budget request support by documenting nullable department_id field and adding example showing central request creation | Restrictions: Do not modify route handlers, must follow existing documentation format, must include both central and department-specific examples | Success: Swagger UI displays updated schema, department_id documented as optional and nullable, example request with null department_id added, error code documentation updated to remove USER_NO_DEPARTMENT from create endpoint_

- [x] 3.2 Add JSDoc comments to modified methods
  - File: apps/api/src/layers/domains/inventory/budget/budgetRequests/budget-requests.service.ts
  - Add JSDoc comments to create() method explaining null department_id behavior
  - Add JSDoc comments to approveFinance() method explaining allocation skipping
  - Include @param, @returns, @throws tags
  - Document central request concept and use cases
  - Verify TypeScript intellisense shows documentation in IDE
  - _Leverage: Existing JSDoc patterns in service file, TypeScript types for accurate documentation_
  - _Requirements: BR-1, BR-2_
  - _Prompt: Role: Code Documentation Specialist | Task: Add comprehensive JSDoc comments to create() and approveFinance() methods documenting null department_id behavior, central request concept, and allocation skipping logic | Restrictions: Do not modify method implementations, must follow JSDoc syntax, must include @param and @returns tags | Success: JSDoc comments added to both methods, null department_id behavior documented, examples included in comments, TypeScript intellisense shows documentation in IDE_

---

## Phase 4: Deployment (Priority: MEDIUM)

- [ ] 4.1 Create pull request and conduct code review
  - Branch: feature/budget-request-central-fix
  - Target: develop branch
  - Create pull request with descriptive title and body
  - Include: Service method changes, tests, documentation updates
  - Request code review from team members
  - Address review comments and make necessary changes
  - Ensure all CI checks pass (build, tests, linting)
  - _Leverage: Git commands, project's PR template structure_
  - _Requirements: All (BR-1, BR-2, BR-3, TR-1, TR-2)_
  - _Prompt: Role: Development Lead | Task: Create pull request and coordinate code review for budget request central fix implementation including all service changes, tests, and documentation | Restrictions: Do not merge without approval, must ensure all tests pass, must follow project's PR template | Success: Pull request created with descriptive title and body, all CI checks pass (build tests linting), code review completed and approved, no merge conflicts, ready for deployment_

- [ ] 4.2 Deploy to staging environment
  - Merge approved PR to develop branch
  - Deploy to staging environment
  - Run smoke tests on staging server
  - Verify central budget request creation works
  - Verify finance approval workflow completes
  - Check server logs for audit messages
  - Monitor for any errors or warnings
  - _Leverage: Deployment scripts, staging environment configuration_
  - _Requirements: All (BR-1, BR-2, BR-3)_
  - _Prompt: Role: DevOps Engineer | Task: Deploy budget request central fix to staging environment, run smoke tests to verify central budget request creation and finance approval workflow, monitor logs for errors | Restrictions: Do not deploy to production without staging verification, must run smoke tests before declaring success, must monitor logs for at least 30 minutes | Success: Deployed successfully to staging, smoke tests pass (create with null department_id, finance approval completes), no errors in server logs, audit messages appear correctly, staging environment stable_

- [ ] 4.3 Deploy to production environment
  - Create release branch from develop
  - Deploy to production environment
  - Monitor server logs for 1 hour after deployment
  - Verify users can create central budget requests
  - Monitor for any error reports from users
  - Have rollback plan ready in case of issues
  - _Leverage: Production deployment procedures, monitoring tools, rollback scripts_
  - _Requirements: All (BR-1, BR-2, BR-3)_
  - _Prompt: Role: Release Manager / DevOps Engineer | Task: Deploy budget request central fix to production environment, monitor closely for errors, and verify users can successfully create central budget requests | Restrictions: Must have rollback plan ready, must monitor logs for at least 1 hour, must verify with actual users, do not ignore any warnings or errors | Success: Deployed successfully to production, no errors reported in first hour, users can create central requests (department_id null), finance approval workflow completes successfully, no rollback needed, production environment stable_

---

## Summary

**Total Tasks:** 10
**Estimated Time:** 5-6 hours
**Priority:** High priority items must be completed first

**Status Tracking:**

- 🔵 TODO: Task not started
- 🟡 IN PROGRESS: Task currently being worked on
- ✅ DONE: Task completed

**Dependencies:**

- Task 2.1 and 2.2 depend on Task 1.1 and 1.2
- Task 4.1 depends on all Phase 1 and Phase 2 tasks
- Task 4.2 depends on Task 4.1
- Task 4.3 depends on Task 4.2

**Risk Assessment:**

- Task 1.1 (Low risk): Simple logic removal
- Task 1.2 (Low risk): Skip logic addition
- Task 2.1 (Low risk): Unit tests easily fixed
- Task 2.2 (Medium risk): Integration test with real server
- Task 4.3 (High risk): Production deployment requires monitoring

**Success Criteria:**

- Phase 1: Code compiles, null department_id accepted, no auto-populate logic
- Phase 2: All tests pass, no errors in integration testing
- Phase 3: Documentation updated, Swagger shows changes
- Phase 4: Deployed to production, users can create central requests, zero errors reported
