import express from 'express';
import dotenv from 'dotenv';
import { router } from './route.decorator';
import { NotFoundError } from '../errors'

dotenv.config();

const { PORT = '3000', HOST = '127.0.0.1' } = process.env;

const server: express.Express = express();

server.use(express.json());
server.use(router);

process.on('unhandledRejection', (err: any, promise: Promise<any>) => {
  console.error(err);
  process.exit(1);
});

server.use(async (_req: express.Request, _res: express.Response, next: express.NextFunction) => {
  next(new NotFoundError());
});

server.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(err.status || 500).json(err);
});

export function Application(): ClassDecorator {
  return function (): void {
    server.listen(parseInt(PORT), HOST, (err: Error) => {
      if (err) {
        console.error(err.message);
        process.exit(1);
      }

      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  }
}
