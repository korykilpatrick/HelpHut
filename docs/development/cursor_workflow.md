# Cursor Development Workflow

## Feature Implementation Flow

### 1. Specification First
```mermaid
graph TD
    A[Review Requirements] --> B[Update OpenAPI Spec]
    B --> C[Generate Types/Interfaces]
    C --> D[Begin Implementation]
```

### 2. Development Flow
```mermaid
graph TD
    A[Implement Feature] --> B[Verify Implementation]
    B --> C[Document Changes]
```

### 3. Implementation Checklist
- [ ] OpenAPI spec updated
- [ ] Types/interfaces defined
- [ ] Core implementation complete
- [ ] Error handling verified
- [ ] Documentation updated

### 4. Quality Gates
Each feature must pass:
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
3. Core feature code
4. Documentation updates

VERIFICATION:
- Type safety checks
- Performance metrics
``` 