# Production-Grade OpenAPI 3.1 Documentation System

## Overview

This is a complete refactoring of the Swagger/OpenAPI documentation system to achieve **.NET Swashbuckle / NestJS Swagger quality**. The new architecture ensures:

- ✅ **100% Route Coverage** - Every route is automatically discovered
- ✅ **Always in Sync** - Documentation matches code exactly
- ✅ **Production Ready** - Complete error responses, auth, pagination
- ✅ **Maintainable** - Single source of truth, no duplication

## Architecture

### Core Components

1. **`swagger.config.js`** - Centralized configuration
   - Server URL detection (environment-based)
   - API versioning
   - Default tags and metadata

2. **`schema-registry.js`** - Schema definitions
   - Global error/success response schemas
   - Pagination and filtering schemas
   - Reusable components

3. **`route-registry.js`** - Route metadata registry
   - Tracks all routes at registration time
   - Stores metadata (tags, auth, parameters, etc.)
   - Never misses a route

4. **`route-scanner.js`** - Comprehensive route discovery
   - Recursively traverses Express router stack
   - Discovers nested routers
   - Detects authentication and file upload middleware

5. **`openapi-builder.js`** - OpenAPI spec builder
   - Builds complete OpenAPI 3.1 specification
   - Infers request/response schemas
   - Handles versioning and security

6. **`swagger-autosetup.js`** - Main entry point
   - Orchestrates the entire process
   - Registers Swagger UI endpoints

## Features

### ✅ Complete Route Discovery
- Discovers all routes including deeply nested routers
- Handles dynamic routes with path parameters
- Detects middleware (auth, file upload)

### ✅ Request/Response Schemas
- Infers schemas from handler functions
- Supports file uploads (multipart/form-data)
- Extracts query parameters automatically

### ✅ Error Response Documentation
All endpoints automatically include:
- `400` - Bad Request
- `401` - Unauthorized (if auth required)
- `403` - Forbidden (if auth required)
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### ✅ Authentication
- JWT Bearer token support
- Automatic detection of auth middleware
- Swagger UI "Authorize" button

### ✅ Pagination & Filtering
- Reusable pagination schemas
- Query parameter extraction
- Sorting and filtering support

### ✅ Dynamic Base URL
- Environment-based server URLs
- Supports multiple environments (dev/prod)
- Request-based URL detection

## Usage

The system works automatically. Just start your server:

```bash
npm start
```

Swagger UI will be available at:
- `http://localhost:8081/docs`
- `http://localhost:8081/api/v1/docs` (if baseUrl is set)

## Configuration

### Environment Variables

```bash
# Base URL for API routes
BASE_URL=/api/v1

# API base URL for Swagger servers
API_BASE_URL=https://your-vps-domain.com

# Port
PORT=8081

# Support email
SUPPORT_EMAIL=support@example.com
```

### Customizing Schemas

To add custom request/response schemas, edit `swagger/schema-registry.js`:

```javascript
export const MyCustomSchema = {
  type: 'object',
  properties: {
    // Your schema definition
  }
};
```

### Adding Route Metadata

Routes are automatically discovered, but you can enhance metadata by modifying the route scanner or using JSDoc comments in controllers.

## Migration from Old System

The old `swagger-autosetup.js` has been backed up to `swagger-autosetup.old.js`. The new system:

1. **Automatically discovers all routes** - No manual registration needed
2. **Infers schemas from code** - No manual schema definitions required
3. **Handles errors automatically** - All endpoints get error responses
4. **Detects auth automatically** - No manual security configuration

## Troubleshooting

### Routes Not Appearing

1. Check that routes are registered before `setupSwagger()` is called
2. Verify routes are using Express Router correctly
3. Check console output for route discovery statistics

### Wrong Base URL

1. Set `API_BASE_URL` environment variable
2. Check `swagger.config.js` for URL detection logic
3. Verify `BASE_URL` is set correctly

### Missing Schemas

1. Check `swagger-model-generator.js` for Sequelize model schemas
2. Verify controller functions are properly exported
3. Check `swagger-controller-scanner.js` for controller mapping

## Statistics

The system provides route statistics on startup:

```
✅ Discovered 45 routes (30 direct routes, 15 nested routers)
📊 Route Statistics: {
  total: 45,
  byMethod: { get: 20, post: 15, put: 5, delete: 5 },
  byTag: { 'Products': 10, 'Orders': 8, ... }
}
```

## Next Steps

To further enhance the system:

1. **Add Zod/Joi validation** - Integrate with `zod-to-openapi` or `joi-to-swagger`
2. **Add decorators** - Create a decorator pattern for route metadata
3. **Add tests** - Unit tests for route discovery and schema generation
4. **Add CI/CD** - Auto-generate and publish API docs

## Support

For issues or questions, check:
- `swagger/ARCHITECTURE_ANALYSIS.md` - Why the old system was broken
- `swagger/README.md` - This file
- Console output - Route discovery statistics

