# Type System Architecture

## Overview

The application uses a layered type system to maintain separation of concerns and type safety across different parts of the application.

## Type Layers

### 1. Database Types (`lib/db/types`)
- Located in `lib/db/types.ts`
- Generated from Supabase schema
- Used **only** by database access layer (`lib/db/supabase.ts`)
- Represents the raw database schema and relationships
- Should **never** be directly used in routes or controllers

### 2. API Types (`lib/api/generated`)
- Located in `lib/api/generated/model/models.ts`
- Generated from OpenAPI specification
- Used by:
  - Route handlers (`server/routes/*`)
  - API implementation layer (`lib/api/impl/*`)
  - Request/response validation schemas
- Represents the public API contract

## Usage Guidelines

### Route Handlers
```typescript
// ✅ Correct: Use API types
import { TicketCreate, TicketUpdate } from '../../lib/api/generated/model/models';

// ❌ Incorrect: Don't use database types directly
import { Database } from '../../lib/db/types';
```

### Database Operations
```typescript
// ✅ Correct: Use database types
import { Database } from './types';
const supabase = createClient<Database>();

// ❌ Incorrect: Don't use API types for database operations
import { Ticket } from '../api/generated/model/models';
```

### API Implementation
```typescript
// ✅ Correct: Can use both API and DB types for transformation
import { Ticket } from '../generated/model/models';
import { Database } from '../../db/types';
```

## Type Flow
1. HTTP Request → API Types (validation)
2. API Types → Database Types (in implementation layer)
3. Database Types → API Types (in implementation layer)
4. API Types → HTTP Response

## Benefits
- Clear separation of concerns
- Type safety across layers
- Prevents database implementation details from leaking
- Maintains clean architecture principles 