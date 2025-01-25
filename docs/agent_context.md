# HelpHut Agent Context
> This file serves as the primary reference for AI agents working with the HelpHut codebase.

## Project Overview
HelpHut is a food rescue management system for Austin nonprofits, connecting surplus food to those in need through a unified platform.

## Technical Stack
- Backend: Express.js with TypeScript
- Database: PostgreSQL with Supabase
- Frontend: React with TypeScript, TailwindCSS, Redux and Radix UI
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

## Base Components
Located in `client/src/shared/components/base/`, these foundational UI components should be used to maintain consistency:

### Available Components
- `BaseInput`: Form inputs with variants, labels, and error states
- `BaseLink`: Navigation links with internal/external handling
- `BaseText`: Typography component with size, weight, and style variants
- `BaseBadge`: Status indicators and tags with variants
- `BaseCard`: Container component with header/footer options

### Quick Usage Examples
```tsx
// Input with label and error
<BaseInput
  label="Email"
  error={true}
  helperText="Invalid email format"
/>

// Internal navigation link
<BaseLink to="/dashboard" variant="primary">
  Go to Dashboard
</BaseLink>

// Text with variants
<BaseText size="lg" weight="semibold" variant="success">
  Status: Complete
</BaseText>

// Badge with icon
<BaseBadge variant="warning" icon={<AlertIcon />}>
  Pending Review
</BaseBadge>

// Card with sections
<BaseCard
  header={<h2>Card Title</h2>}
  footer={<Button>Submit</Button>}
  variant="elevated"
>
  Content goes here
</BaseCard>
```

### Component Guidelines
1. Always use base components for consistent styling
2. Extend with composition rather than modification
3. Maintain accessibility features
4. Follow existing variant patterns

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

### 4. Ticket Creation Pattern
- Tickets are created automatically when donations are created
- Implementation in donation creation route:
  ```typescript
  // POST /donations
  router.post('/', async (req, res, next) => {
    try {
      // Create donation and ticket in same transaction
      const { donation, ticket } = await api.donations.createWithTicket(req.body);
      res.status(201).json({ donation, ticket });
    } catch (error) {
      next(error);
    }
  });
  ```
- Benefits:
  - Guaranteed ticket creation
  - Atomic operations
  - Clear audit trail
  - Immediate volunteer matching possible
  - Simpler state management

### 5. Error Handling Strategy
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

### 6. Case Transformation Rules
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

## Authentication Implementation Notes

### Data Flow & Case Transformation
1. **Case Convention Rules**
   - Frontend (Client) → camelCase
   - Database → snake_case
   - API Layer → Handles transformation
   - Use `lib/utils/case-transform.ts` utilities:
     ```typescript
     import { toCamelCase, toSnakeCase } from '../../utils/case-transform';
     ```

2. **Data Flow Pattern**
   ```
   Client (camelCase) 
     → API Validation (camelCase)
     → Database Operation (snake_case)
     → Response Transform (camelCase)
     → Client
   ```

3. **Implementation Checklist**
   - [ ] Verify database schema in `docs/planning/db.sql`
   - [ ] Check existing utilities in `lib/utils/`
   - [ ] Use type-safe case transformations
   - [ ] Add logging for data flow tracking
   - [ ] Handle critical errors first

4. **Common Gotchas**
   - Always check database schema before adding new fields
   - Use existing utilities instead of creating new ones
   - Keep TypeScript types in sync with database schema
   - Add comprehensive logging for debugging
   - Transform case at API boundaries, not in business logic

5. **Debugging Strategy**
   - Check schema first
   - Verify case transformation
   - Follow data flow through logs
   - Handle database constraints
   - Use TypeScript for early error catching

## Portal-Based Navigation Guidelines

### Portal State Management
1. **Portal Context**
   - Use Redux for portal state
   - Track current portal, sidebar state, and navigation path
   - Handle portal switching via `PortalSwitcher`

2. **Route Structure**
   ```typescript
   <Route path="/portal-name" element={<PortalLayout config={portalConfig}><Outlet /></PortalLayout>}>
     <Route path="dashboard" element={<DashboardPage />} />
     <Route path="feature" element={<FeaturePage />} />
   </Route>
   ```

3. **Portal Configuration**
   - Define portal config in separate files
   - Include portal ID, title, and navigation items
   - Use consistent navigation structure across portals

### Common Navigation Pitfalls
1. **Portal Switching**
   - Always update portal state when switching
   - Clear portal-specific state when changing portals
   - Handle deep links correctly

2. **Layout Consistency**
   - Use `PortalLayout` for all portal pages
   - Maintain consistent navigation structure
   - Handle responsive states uniformly

3. **State Management**
   - Scope state to portal where possible
   - Share common state through core store
   - Clear portal state on exit

## Component Architecture Patterns

### Portal Page Structure
```typescript
export function PortalPage() {
  // 1. Queries and state
  const { data, isLoading } = useQuery({ ... });
  
  // 2. Mutations and handlers
  const mutation = useMutation({ ... });
  
  // 3. Effects and derived state
  useEffect(() => { ... }, []);
  
  // 4. Loading states
  if (isLoading) return <LoadingState />;
  
  // 5. Error states
  if (error) return <ErrorState error={error} />;
  
  // 6. Success state
  return (
    <div className="container mx-auto py-8">
      <PageHeader />
      <MainContent data={data} />
      <PageActions onAction={mutation.mutate} />
    </div>
  );
}
```

### Component Best Practices
1. **State Management**
   - Use React Query for server state
   - Local state for UI interactions
   - Redux for cross-cutting concerns

2. **Error Handling**
   - Handle loading states consistently
   - Show appropriate error messages
   - Provide retry mechanisms

3. **Data Flow**
   - Pass minimal props
   - Use composition for complex UIs
   - Handle loading/error at appropriate levels

4. **Performance**
   - Implement proper memoization
   - Use virtualization for long lists
   - Lazy load portal components

// ... existing code ... 