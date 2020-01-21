import express from 'express';
import dotenv from 'dotenv';

import { router } from './route.decorator';

dotenv.config();

const { PORT = 3000, HOST = '127.0.0.1' } = process.env;

const server: express.Express = express();

server.use(express.json());
server.use(router);

export function Application(): ClassDecorator {
  return function (_target: Function): void {
    server.listen(+PORT, HOST, (err: Error) => {
      if (err) {
        console.error(err.message);
        process.exit(1);
      }

      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  }
}
