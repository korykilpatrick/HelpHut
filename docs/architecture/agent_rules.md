# Agent Rules & Workflow

## Core Principles
1. Always maintain documentation synchronization
2. Follow OpenAPI-first development
3. Enforce type safety everywhere
4. Maintain modular architecture
5. Always get user verification for data model changes

## Structural Analysis Requirements

### Pre-Code Generation Analysis
Before creating or modifying any code, perform these analytical steps:

1. Component Placement Analysis:
   ```template
   STRUCTURAL ANALYSIS:
   
   1. Purpose Assessment:
      - Component responsibility: [description]
      - Data flow direction: [in/out]
      - Dependencies: [list]
   
   2. Location Determination:
      - Proposed directory: [path]
      - Justification: [explanation]
      - Alternative locations considered: [list + why rejected]
   
   3. Integration Impact:
      - Coupling assessment: [high/medium/low]
      - Required imports: [list]
      - Circular dependency risk: [yes/no + details]
   ```

2. Modular Design Verification:
   - Single Responsibility check
   - Interface segregation opportunity
   - Dependency inversion needs
   - Encapsulation boundaries
   - Extension points

3. AI-Friendly Structure Requirements:
   - Clear file naming patterns
   - Consistent directory organization
   - Explicit type definitions
   - Self-documenting structure
   - Predictable import paths

### File Organization Principles
1. Group by Feature:
   ```
   /feature-name
     /models
     /services
     /controllers
     /types
   ```

2. Group by Layer:
   ```
   /models
   /services
   /controllers
   /repositories
   ```

### Code Placement Checklist
Before creating new files:
- [ ] Verify no existing component can be extended
- [ ] Check for similar patterns elsewhere in codebase
- [ ] Validate directory structure matches purpose
- [ ] Confirm naming aligns with conventions
- [ ] Assess impact on build/bundle size
- [ ] Consider future scale requirements

## Critical Change Verification

### Required User Approval
The following changes MUST be approved by the user before proceeding:
1. Data Model Modifications:
   - Schema changes
   - New model additions
   - Field modifications
   - Relationship changes
   - Enum updates

2. OpenAPI Specification Changes:
   - Endpoint modifications
   - Request/Response schema updates
   - Security requirement changes
   - New API routes
   - Parameter changes

### Verification Process
1. Stop current implementation
2. Present proposed changes:
   ```template
   DATA MODEL/OPENAPI CHANGES REQUIRING APPROVAL:
   
   Current Structure:
   [Show current state]
   
   Proposed Changes:
   [List all modifications]
   
   Impact Analysis:
   - Affected Components: [list]
   - Migration Requirements: [if any]
   - Breaking Changes: [yes/no + details]
   
   Please review and confirm these changes before proceeding.
   ```
3. Wait for explicit user approval
4. Document approved changes in ADR
5. Resume implementation

## Mandatory Workflow Steps

### 1. Pre-Implementation Requirements
- [ ] Verify OpenAPI spec exists for the feature
- [ ] Check for existing related components
- [ ] Validate architectural alignment

### 2. Implementation Order
1. Implementation:
   - [ ] Type definitions
   - [ ] Interface definitions
   - [ ] Core logic implementation
   - [ ] Error handling
   - [ ] Integration code

2. Documentation:
   - [ ] Update API documentation
   - [ ] Add implementation notes
   - [ ] Update related component references
   - [ ] Generate TypeDoc/JSDoc

### 3. Quality Gates
Before completing any implementation:
- [ ] Type safety verification
- [ ] Style guide compliance
- [ ] Performance impact assessment
- [ ] Security check
- [ ] Documentation completeness

## Response Templates

### New Feature Implementation
```template
1. Core Implementation:
   [Provide implementation]
   
2. Documentation Updates:
   [Provide documentation changes]
   
3. Quality Verification:
   - Type Safety: [status]
   - Style Compliance: [status]
```

### Code Modification
```template
1. Impact Analysis:
   - Affected Components: [list]
   
2. Implementation Changes:
   [Provide code changes]
   
3. Documentation Updates:
   [Provide documentation changes]
```

## Directory Structure Maintenance

### Required Project Structure
```
/docs
  /api           # OpenAPI documentation
  /architecture  # ADRs and design docs
  /guides        # Implementation guides
/src
  /types        # Type definitions
  /interfaces   # Interface definitions
  /core         # Core business logic
  /utils        # Utility functions
  /config       # Configuration
```

## Error Response Protocol
When encountering issues:
1. Identify missing prerequisites
2. Request necessary context
3. Suggest architectural improvements
4. Provide specific error details

## Documentation Requirements

### For Each Component
- Purpose and responsibility
- Interface documentation
- Usage examples
- Dependencies
- Performance considerations

### For Each API Endpoint
- OpenAPI specification
- Request/Response examples
- Error scenarios
- Rate limiting details
- Security requirements

## Quality Enforcement

### Code Generation Rules
1. Always include error handling
2. Use strong typing
3. Follow SOLID principles
4. Include performance considerations
5. Add logging points

## Security Requirements
- Input validation
- Authentication checks
- Authorization verification
- Data sanitization