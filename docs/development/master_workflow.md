# Master Development Workflow

## Overview
This document serves as the central reference for development processes, combining agent rules, development workflows, testing guidelines, and coding standards.

## Process Flow

### 1. Pre-Development
```mermaid
graph TD
    A[Review Requirements] --> B[Check OpenAPI Spec]
    B --> C[Review Agent Rules]
    C --> D[Plan Implementation]
```

### 2. Development Cycle
```mermaid
graph TD
    A[Write Tests] --> B[Generate Code]
    B --> C[Verify Implementation]
    C --> D[Update Documentation]
    D --> E[Review & Iterate]
```

## Workflow Checklist

### Initial Setup
- [ ] Review OpenAPI specification
- [ ] Check existing implementations
- [ ] Plan test coverage

### Test Development
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Write E2E tests if needed
- [ ] Verify test coverage meets standards

### Implementation
- [ ] Follow coding standards
- [ ] Implement type-safe code
- [ ] Handle errors appropriately
- [ ] Add proper logging
- [ ] Document code

### Documentation
- [ ] Update OpenAPI spec if needed
- [ ] Add/update JSDoc comments
- [ ] Update README if needed
- [ ] Document breaking changes

### Review Process
- [ ] Run all tests
- [ ] Verify coverage requirements
- [ ] Run linter
- [ ] Self-review code
- [ ] Request AI review
- [ ] Address feedback

## AI Agent Integration

### Context Requirements
When working with the AI agent, provide:

1. Relevant file contents
2. Clear task description
3. Affected components
4. Test requirements
5. Expected behavior

### Code Generation Rules

#### Input Format
```
Task: [Clear description of what needs to be done]
Context: [Relevant background information]
Files: [List of affected files]
Requirements:
- [Specific requirement 1]
- [Specific requirement 2]
Tests: [Test requirements]
```

#### Output Verification
- [ ] Matches coding standards
- [ ] Includes proper types
- [ ] Handles errors
- [ ] Includes tests
- [ ] Properly documented

## Quality Gates

### 1. Code Quality
```mermaid
graph TD
    A[Linting] --> B[Type Checking]
    B --> C[Test Coverage]
    C --> D[Documentation]
```

#### Requirements
- Linting passes
- No type errors
- Test coverage ≥ 80%
- Documentation complete

### 2. Testing
```mermaid
graph TD
    A[Unit Tests] --> B[Integration Tests]
    B --> C[E2E Tests]
    C --> D[Coverage Report]
```

#### Coverage Thresholds
- Lines: 80%
- Branches: 80%
- Functions: 90%
- Statements: 80%

### 3. Documentation
```mermaid
graph TD
    A[Code Comments] --> B[API Documentation]
    B --> C[README Updates]
    C --> D[Breaking Changes]
```

### Test Organization
```
/tests
  /unit          # Unit tests
  /integration   # Integration tests
  /e2e           # End-to-end tests
  /fixtures      # Test data
  /helpers       # Test utilities
```
## Troubleshooting

### Common Issues
1. Failed Tests
   - Check test logs
   - Verify test environment
   - Check for race conditions

2. Type Errors
   - Review type definitions
   - Check import paths
   - Verify generic types

3. Coverage Issues
   - Identify uncovered paths
   - Add missing tests
   - Check excluded files

## Reference

### Related Documents
- [Coding Standards](./guides/coding_standards.md)
- [Testing Guidelines](./guides/testing_guidelines.md)
- [Development Workflow](./guides/development_workflow.md)
- [Agent Rules](../architecture/agent_rules.md)

### Tools
- TypeScript
- Vite
- Cypress
- ESLint
- Prettier
- Cursor AI

### Resources
- OpenAPI Specification
- TypeScript Documentation
- Jest Documentation
- Cypress Documentation 


