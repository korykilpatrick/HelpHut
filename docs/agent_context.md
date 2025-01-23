# HelpHut Agent Context
> This file serves as the primary reference for AI agents working with the HelpHut codebase.

## Project Overview
HelpHut is a food rescue management system for Austin nonprofits, connecting surplus food to those in need through a unified platform.

## Technical Stack
- Backend: Express.js with TypeScript
- Database: PostgreSQL with Supabase
- Frontend: (In planning)
- Documentation: OpenAPI-driven development

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

## Development Principles
1. **OpenAPI-First Development**
   - All API changes must start with OpenAPI spec updates
   - Spec drives type generation and validation
   - Located at `docs/planning/openapi.yaml`

2. **Type Safety**
   - Use TypeScript strict mode

3. **Modular Architecture**
   - Clear separation of concerns
   - Reusable components and utilities

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
2. Implement proper error handling
3. Add logging where appropriate
4. Update documentation (including this file if prompted to)

### After Changes
1. Verify type safety
2. Update affected documentation
3. Document breaking changes

## Quality Standards
- All code must pass TypeScript strict checks
- Follow established naming conventions
- Include error handling
- Add appropriate logging
- Update documentation

## Common Gotchas
1. Always check for null/undefined in type definitions
2. Use proper error handling with typed errors
3. Keep database operations within transaction boundaries
4. Maintain proper logging context
5. Remember API types are auto-generated - modify OpenAPI spec instead of type files

## Need Help?
1. Check OpenAPI spec first
2. Review type definitions (both API and DB)
3. Look for similar patterns in existing code
4. Consult documentation in `docs/` directory 