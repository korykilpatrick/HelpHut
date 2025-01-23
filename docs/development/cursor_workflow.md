# Cursor Development Workflow

## Feature Implementation Flow

### 1. Specification First
```mermaid
graph TD
    A[Review Requirements] --> B[Update OpenAPI Spec]
    B --> C[Generate Types/Interfaces]
    C --> D[Write Test Specs]
    D --> E[Begin Implementation]
```

### 2. Test-Driven Development
```mermaid
graph TD
    A[Write Unit Tests] --> B[Write Integration Tests]
    B --> C[Implement Feature]
    C --> D[Verify Coverage]
    D --> E[Document Changes]
```

### 3. Implementation Checklist
- [ ] OpenAPI spec updated
- [ ] Types/interfaces defined
- [ ] Test cases written
- [ ] Core implementation complete
- [ ] Error handling verified
- [ ] Documentation updated

### 4. Quality Gates
Each feature must pass:
- Test coverage ≥ 80%
- Type safety checks
- OpenAPI validation
- Documentation completeness
- Performance benchmarks

### 5. Documentation Requirements
- OpenAPI annotations
- JSDoc comments
- README updates
- Architecture notes
- Breaking change docs

## Cursor Agent Instructions

### Input Format
```
TASK:
[Clear task description]

CONTEXT:
- Relevant files/components
- Business requirements
- Technical constraints

REQUIREMENTS:
1. [Specific requirement]
2. [Edge cases to handle]
3. [Performance needs]

TESTS:
- Unit test scenarios
- Integration test cases
- Coverage expectations
```

### Output Format
```
ANALYSIS:
- Implementation approach
- Affected components
- Potential risks

IMPLEMENTATION:
1. OpenAPI changes
2. Type definitions
3. Test implementations
4. Core feature code
5. Documentation updates

VERIFICATION:
- Test coverage report
- Type safety checks
- Performance metrics
``` 