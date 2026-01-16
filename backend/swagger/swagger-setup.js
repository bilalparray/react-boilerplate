/**
 * Swagger Setup using swagger-jsdoc (Industry Standard Approach)
 * Based on: https://medium.com/@im_AnkitTiwari/swaggerizing-your-node-js-rest-api-a-step-by-step-guide-267255bf8bbe
 * 
 * This approach uses JSDoc comments in route files to generate Swagger documentation.
 * It's more reliable than auto-scanning and follows industry best practices.
 */

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeSwaggerJson } from './swagger-writer.js';
import { generateSequelizeSchemas } from './swagger-model-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Setup Swagger using swagger-jsdoc
 * @param {Express.Application} app - Express application instance
 * @param {string} baseUrl - Base URL prefix (e.g., /api/v1)
 */
export async function setupSwagger(app, baseUrl = null) {
  const actualBaseUrl = baseUrl !== null ? baseUrl : (process.env.BASE_URL || '/api/v1');

  // Get server URL dynamically from environment variables
  let serverUrl;
  if (process.env.API_BASE_URL) {
    // Highest priority: Use API_BASE_URL if set (works for both dev and production)
    serverUrl = process.env.API_BASE_URL.replace(/\/$/, '');
  } else if (process.env.PRODUCTION_URL) {
    // Production URL from .env (e.g., https://api.wildvalleyfoods.in)
    serverUrl = process.env.PRODUCTION_URL.replace(/\/$/, '');
  } else if (process.env.NODE_ENV === 'production') {
    // Fallback: Try to construct from domain and port if available
    const domain = process.env.DOMAIN || process.env.HOST || 'localhost';
    const port = process.env.PORT || 8081;
    const protocol = process.env.PROTOCOL || (port === 443 ? 'https' : 'http');
    serverUrl = `${protocol}://${domain}${port !== 80 && port !== 443 ? `:${port}` : ''}`;
  } else {
    // Development: Use localhost
    const port = process.env.PORT || 8081;
    serverUrl = `http://localhost:${port}`;
  }

  // Swagger JSDoc options
  // swagger-jsdoc expects: { definition: {...}, apis: [...] }
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Alpine Ecommerce API',
        version: '1.0.0',
        description: `
# Alpine Ecommerce Backend API

Complete API documentation for Alpine Ecommerce e-commerce platform.

## Features
- 🔐 JWT Authentication
- 📦 Product Management
- 🛒 Order Processing
- 💳 Payment Integration (Razorpay)
- 👥 Customer Management
- 📊 Dashboard & Reports
- 📝 Error Logging

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your-token>
\`\`\`

## Base URL
- **Current Server**: ${serverUrl}${actualBaseUrl}
- **Configuration**: 
  - Set \`API_BASE_URL\` in .env for full control (recommended)
  - Or set \`PRODUCTION_URL\` for production domain
  - Or set \`DOMAIN\`, \`PORT\`, and \`PROTOCOL\` for auto-construction

## Response Format
All responses follow a consistent format:
\`\`\`json
{
  "responseStatusCode": 200,
  "isError": false,
  "errorData": null,
  "successData": { ... }
}
\`\`\`

## Error Handling
Errors are returned with appropriate status codes:
\`\`\`json
{
  "responseStatusCode": 400,
  "isError": true,
  "errorData": {
    "displayMessage": "Error description",
    "apiErrorType": 1
  }
}
\`\`\`
        `.trim(),
        contact: {
          name: 'Alpine Ecommerce API Support',
          email: process.env.SUPPORT_EMAIL || 'support@wildvalleyfoods.in'
        },
        license: {
          name: 'Proprietary'
        },
        servers: [
          {
            url: serverUrl + actualBaseUrl,
            description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server'
          }
        ],
        components: {
          securitySchemes: {
            BearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              description: 'JWT token obtained from /register or /login endpoint. Enter your token (with or without "Bearer " prefix)'
            }
          },
          schemas: {
            ErrorResponse: {
              type: 'object',
              required: ['responseStatusCode', 'isError', 'errorData'],
              properties: {
                responseStatusCode: {
                  type: 'integer',
                  description: 'HTTP status code',
                  example: 400
                },
                isError: {
                  type: 'boolean',
                  description: 'Indicates if the response is an error',
                  example: true
                },
                errorData: {
                  type: 'object',
                  required: ['displayMessage', 'apiErrorType'],
                  properties: {
                    displayMessage: {
                      type: 'string',
                      description: 'Human-readable error message',
                      example: 'Invalid input parameters'
                    },
                    apiErrorType: {
                      type: 'integer',
                      description: 'Error type identifier for frontend handling',
                      example: 1
                    }
                  }
                }
              }
            },
            SuccessResponse: {
              type: 'object',
              required: ['responseStatusCode', 'isError', 'errorData'],
              properties: {
                responseStatusCode: {
                  type: 'integer',
                  description: 'HTTP status code',
                  example: 200
                },
                isError: {
                  type: 'boolean',
                  description: 'Indicates if the response is an error',
                  example: false
                },
                errorData: {
                  type: 'null',
                  description: 'Always null for success responses'
                },
                successData: {
                  type: 'object',
                  description: 'Response data (structure varies by endpoint)'
                }
              }
            }
          },
          responses: {
            BadRequest: {
              description: 'Bad Request - Invalid input parameters',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: {
                    responseStatusCode: 400,
                    isError: true,
                    errorData: {
                      displayMessage: 'Invalid input parameters',
                      apiErrorType: 1
                    }
                  }
                }
              }
            },
            Unauthorized: {
              description: 'Unauthorized - Invalid or missing authentication token',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: {
                    responseStatusCode: 401,
                    isError: true,
                    errorData: {
                      displayMessage: 'Unauthorized - Please login',
                      apiErrorType: 1
                    }
                  }
                }
              }
            },
            Forbidden: {
              description: 'Forbidden - Insufficient permissions',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: {
                    responseStatusCode: 403,
                    isError: true,
                    errorData: {
                      displayMessage: 'Forbidden - Admin access required',
                      apiErrorType: 1
                    }
                  }
                }
              }
            },
            NotFound: {
              description: 'Not Found - Resource does not exist',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: {
                    responseStatusCode: 404,
                    isError: true,
                    errorData: {
                      displayMessage: 'Resource not found',
                      apiErrorType: 1
                    }
                  }
                }
              }
            },
            InternalServerError: {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: {
                    responseStatusCode: 500,
                    isError: true,
                    errorData: {
                      displayMessage: 'Internal server error',
                      apiErrorType: 1
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    // apis must be at top level, not inside definition
    apis: [
      // Scan all route files for JSDoc comments
      join(__dirname, '../route/**/*.js'),
      join(__dirname, '../controller/**/*.js'),
      // Also scan the main route file
      join(__dirname, '../MainRoute/*.js')
    ]
  };

  // Generate Swagger spec from JSDoc comments
  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  // Remove global security requirement - endpoints will define their own security
  // This ensures the "Authorize" button works properly in Swagger UI
  if (swaggerSpec.security) {
    delete swaggerSpec.security;
  }

  // Add Sequelize schemas
  const sequelizeSchemas = await generateSequelizeSchemas();
  if (swaggerSpec.components && swaggerSpec.components.schemas) {
    swaggerSpec.components.schemas = {
      ...swaggerSpec.components.schemas,
      ...sequelizeSchemas
    };
  }

  // Ensure security scheme is properly defined
  if (!swaggerSpec.components) {
    swaggerSpec.components = {};
  }
  if (!swaggerSpec.components.securitySchemes) {
    swaggerSpec.components.securitySchemes = {};
  }
  if (!swaggerSpec.components.securitySchemes.BearerAuth) {
    swaggerSpec.components.securitySchemes.BearerAuth = {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT token obtained from /register or /login endpoint. Enter your token (with or without "Bearer " prefix)'
    };
  }

  // Write swagger.json file
  try {
    writeSwaggerJson(swaggerSpec);
    console.log('✅ Swagger JSON written to docs/swagger.json');
  } catch (e) {
    console.warn('⚠️ Failed to write swagger.json:', e.message);
  }

  // Register Swagger UI
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Alpine Ecommerce API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true, // Keep authorization token after page refresh
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true
    }
  }));

  if (actualBaseUrl && actualBaseUrl !== '/docs') {
    const swaggerPath = `${actualBaseUrl}/docs`;
    app.use(swaggerPath, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Alpine Ecommerce API Documentation',
      customfavIcon: '/favicon.ico',
      swaggerOptions: {
        persistAuthorization: true, // Keep authorization token after page refresh
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        validatorUrl: null // Disable validator to avoid external requests
      }
    }));
    console.log(`📚 Swagger UI available at ${swaggerPath}`);
  }

  console.log('📚 Swagger UI available at /docs');
  console.log('📝 Add @swagger JSDoc comments to your route files to document endpoints');

  return swaggerSpec;
}
