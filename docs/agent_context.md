# HelpHut Agent Context
> This file serves as the primary reference for AI agents working with the HelpHut codebase.

## Project Overview
HelpHut is a food rescue management system for Austin nonprofits, connecting surplus food to those in need through a unified platform.

## Technical Stack
- Backend: Express.js with TypeScript
- Database: PostgreSQL with Supabase
- Frontend: React with TypeScript, TailwindCSS, and Radix UI
- Documentation: OpenAPI-driven development

## Frontend Architecture
The frontend is organized around user roles and workflows, following a portal-based architecture:

### Directory Structure
```
client/src/
├── core/                      # Core application framework
│   ├── app/                   # Main app components
│   ├── auth/                  # Authentication
│   └── store/                # Global state management
│
├── portals/                   # User-specific interfaces
│   ├── auth/                  # Authentication pages
│   ├── donor/                # Donor portal
│   ├── volunteer/            # Volunteer portal
│   ├── partner/              # Partner portal
│   └── admin/                # Admin portal
│
├── shared/                    # Shared components & utilities
│   ├── components/           # Reusable UI components
│   └── utils/                # Utility functions
│
└── workflows/                 # Business process flows
    ├── food-rescue/          # Food rescue workflow
    ├── shift-management/     # Volunteer shift workflow
    └── impact-tracking/      # Impact measurement workflow
```

### Design Principles
1. **Portal-Based Organization**
   - Each user role has a dedicated portal
   - Portals contain role-specific features and views
   - Common layouts and components are shared

2. **Workflow-Driven Development**
   - Business processes are modeled as workflows
   - Workflows are broken into discrete steps
   - Progress tracking and state management per workflow

3. **Component Architecture**
   - Shared components for consistent UI
   - Role-specific components within portals
   - Workflow components for process visualization

4. **State Management**
   - Authentication state in core
   - Workflow state per process
   - Portal-specific state when needed

## Key File Locations
- OpenAPI Spec: `docs/planning/openapi.yaml`
- Database Types: `lib/db/types.ts`
- API Types: `lib/types/generated/api.ts`
- Server Routes: `server/routes.ts`
- API Implementations: `lib/api/impl/`

## Type System
1. **Database Types** (`lib/db/types.ts`)
   - Raw database table definitions
   - SQL schema representations
   - Database-level constraints

2. **API Types** (`lib/types/generated/api.ts`)
   - Auto-generated from OpenAPI spec
   - Request/Response interfaces
   - API client definitions
   - Includes:
     - CRUD operations
     - Input validation
     - Type-safe API calls

3. **Implementation Types** (`lib/api/impl/`)
   - Server-side implementations
   - Business logic interfaces
   - Service layer types

## Route Development Process

### 1. Type Preparation
- Import generated types from `lib/api/generated/src/models/`
- Import database types from `lib/db/types`
- Define local types using Database namespace:
  ```typescript
  type Entity = Database['public']['Tables']['entity_table']['Row'];
  type EntityCreate = Database['public']['Tables']['entity_table']['Insert'];
  type EntityUpdate = Database['public']['Tables']['entity_table']['Update'];
  ```

### 2. Schema Development
- Create Zod schemas that match generated types
- Use camelCase for all field names
- Handle dates with `z.coerce.date()`
- Common patterns:
  ```typescript
  // Create schema
  const entityCreateSchema = z.object({
    fieldName: z.string(),
    dateField: z.coerce.date(),
    optionalField: z.string().optional()
  });

  // Update schema (usually partial of create)
  const entityUpdateSchema = entityCreateSchema.partial();
  ```

### 3. Route Implementation
- Use Express Router
- Apply validateRequest middleware
- Handle critical errors for business logic
- Standard CRUD pattern:
  ```typescript
  // GET list
  router.get('/', async (req, res, next) => {
    try {
      const entities = await api.entities.listEntities();
      res.json({ entities });
    } catch (error) {
      next(error);
    }
  });

  // POST create
  router.post('/', validateRequest({ body: entityCreateSchema }), 
    async (req, res, next) => {
    try {
      const entity = await api.entities.createEntity(req.body);
      res.status(201).json({ entity });
    } catch (error) {
      next(error);
    }
  });
  ```

### 4. Error Handling Strategy
- Focus on business-critical errors first
- Add error handling based on user impact
- Common error patterns:
  ```typescript
  // Critical business logic errors
  if (!donor) {
    throw new ValidationError('Donor not found');
  }

  // Data integrity errors
  if (donation.status === 'completed') {
    throw new StateError('Cannot modify completed donation');
  }

  // Optional enhancement errors
  try {
    await sendNotification(user);
  } catch (error) {
    // Log but don't fail the request
    console.warn('Notification failed:', error);
  }
  ```

### 5. Case Transformation Rules
- Routes receive camelCase from clients
- Database operations use snake_case
- Case transformation is automatic via middleware
- No manual case conversion needed in route handlers

### Common Patterns
1. **Date Handling**
   ```typescript
   // In schema
   dateField: z.coerce.date()
   // Automatically handles ISO strings
   ```

2. **Optional Fields**
   ```typescript
   // In schema
   optionalField: z.string().optional()
   ```

3. **Enums**
   ```typescript
   // Define constants
   const STATUS = ['Active', 'Inactive'] as const;
   // In schema
   status: z.enum(STATUS)
   ```

4. **Refinements**
   ```typescript
   // Add custom validation
   schema.refine(
     data => data.startDate < data.endDate,
     { message: "End date must be after start date" }
   )
   ```

### Route Checklist
- [ ] Import required types (API & DB)
- [ ] Define local type aliases
- [ ] Create Zod schemas
- [ ] Implement CRUD routes
- [ ] Add critical error handling
- [ ] Handle business logic errors
- [ ] Export router

## Development Principles
1. **OpenAPI-First Development**
   - All API changes must start with OpenAPI spec updates
   - Spec drives type generation and validation
   - Located at `docs/planning/openapi.yaml`

2. **Type Safety**
   - Use TypeScript strict mode
   - Validate all inputs at boundaries
   - Handle nullability explicitly

3. **Modular Architecture**
   - Clear separation of concerns
   - Reusable components and utilities
   - Feature-specific error handling

4. **Documentation Requirements**
   - JSDoc comments for functions and classes
   - README updates for new features
   - Breaking changes must be documented

## Required Workflows

### Before Making Changes
1. Review OpenAPI spec for affected endpoints
2. Check existing implementations
3. Verify type definitions
4. Plan implementation approach

### During Implementation
1. Follow TypeScript strict guidelines
2. Implement critical error handling
3. Add logging where appropriate
4. Update documentation

### After Changes
1. Verify type safety
2. Test critical paths
3. Document breaking changes

## Quality Standards
- All code must pass TypeScript strict checks
- Follow established naming conventions
- Handle critical errors
- Add appropriate logging
- Update documentation

## Common Gotchas
1. Always check for null/undefined in type definitions
2. Handle critical business logic errors first
3. Keep database operations within transaction boundaries
4. Maintain proper logging context
5. Remember API types are auto-generated - modify OpenAPI spec instead of type files

## Need Help?
1. Check OpenAPI spec first
2. Review type definitions (both API and DB)
3. Look for similar patterns in existing code
4. Consult documentation in `docs/` directory

## Frontend Development Workflow

### Adding New Features
1. **Portal Features**
   - Add feature config to portal configuration
   - Create feature components in portal directory
   - Update portal routes in AppRoutes.tsx

2. **Workflows**
   - Define workflow steps and states
   - Create workflow components
   - Implement state management
   - Add to relevant portal(s)

3. **Shared Components**
   - Place in shared/components
   - Use consistent styling (TailwindCSS)
   - Document props and usage
   - Consider accessibility

### Code Organization Rules
1. **Component Structure**
   - One component per file
   - Co-locate related components
   - Keep components focused and small
   - Use TypeScript interfaces for props

2. **State Management**
   - Use React Query for API state
   - Local state for UI interactions
   - Context for cross-cutting concerns
   - Document state shape and updates

3. **Styling Guidelines**
   - Use Tailwind utility classes
   - Follow component-first approach
   - Maintain consistent spacing
   - Use design system tokens

4. **Testing Requirements**
   - Component unit tests
   - Workflow integration tests
   - Accessibility testing
   - Visual regression tests 