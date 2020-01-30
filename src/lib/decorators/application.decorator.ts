import express from 'express';
import dotenv from 'dotenv';
import { router } from './route.decorator';
import { NotFoundError } from '../errors';
import swaggerUiExpress from 'swagger-ui-express';
import { OpenAPIObject } from 'openapi3-ts';
import * as packageJson from '../../../package.json';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      swaggerDoc?: OpenAPIObject
    }
  }
}

const { APP_PORT = '3000', APP_HOST = '127.0.0.1' } = process.env;

const swaggerDocument: OpenAPIObject = {
  openapi: '3.0.1',
  info: {
    version: packageJson.version,
    title: packageJson.name,
    description: packageJson.description,
  },
  servers: [
    {
      url: 'http://localhost:3000/'
    }
  ],
  paths: {},
  components: {
    schemas: {},
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

const server: express.Express = express();

server.use(express.json());
server.use(router);

server.use('/swagger', swaggerUiExpress.serve);
server.route('/swagger').get(
  (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    swaggerDocument.host = req.get('host');
    swaggerDocument.components!.schemas = require('./model.decorator').swaggerDocumentComponentsSchemas;
    swaggerDocument.paths = require('./route.decorator').swaggerDocumentPaths;

    req.swaggerDoc = swaggerDocument;
    next();
  },
  swaggerUiExpress.setup()
);

process.on('unhandledRejection', (err: any, promise: Promise<any>) => {
  console.error(err);
  process.exit(1);
});

server.use(async (_req: express.Request, _res: express.Response, next: express.NextFunction) => {
  next(new NotFoundError());
});

server.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(err.status ?? 500).json(err);
});

export function Application(): ClassDecorator {
  return function (): void {
    server.listen(parseInt(APP_PORT), APP_HOST, (err: Error) => {
      if (err) {
        console.error(err.message);
        process.exit(1);
      }

      console.log(`Server is running on http://${APP_HOST}:${APP_PORT}`);
    });
  }
}
