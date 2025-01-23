# Development Standards Reference

## Code Organization

### Directory Structure
```
/src
  ├── core/       # Core business logic
  ├── utils/      # Utility functions
  └── config/     # Configuration
```

## Quality Standards

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Error handling patterns
- Logging standards
- Security practices

### Documentation
- OpenAPI annotations
- JSDoc requirements
- README structure
- Architecture notes
- Breaking changes

## Best Practices

### Error Handling
```typescript
try {
  // Operation
} catch (error) {
  logger.error('Context:', { error, metadata });
  throw new AppError(ErrorCode.SPECIFIC_ERROR);
}
```

### Type Safety
```typescript
interface Config {
  readonly endpoint: string;
  readonly timeout: number;
}

type Result<T> = {
  data: T;
  metadata: Record<string, unknown>;
};
```

## Tools & Resources
- TypeScript
- ESLint/Prettier
- OpenAPI Tools
- Cursor AI