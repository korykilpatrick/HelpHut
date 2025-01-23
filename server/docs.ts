import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export async function createDocsRouter() {
  const router = Router();
  
  // Read and parse OpenAPI spec
  const openapiPath = join(__dirname, '../docs/planning/openapi.yaml');
  const openapiContent = await readFile(openapiPath, 'utf8');
  const openapiSpec = parse(openapiContent);

  // Configure Swagger UI
  const options = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
  };

  // Mount Swagger UI
  router.use('/', swaggerUi.serve);
  router.get('/', swaggerUi.setup(openapiSpec, options));

  return router;
} 