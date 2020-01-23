import express from 'express';

import { REQUEST_REQUEST, REQUEST_PARAMS, REQUEST_QUERIES, REQUEST_BODIES } from './request.decorator';
import { RESPONSE_RESPONSE } from './response.decorator';

function withStatus(status: number): express.Handler {
  return (_req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(status);

    next();
  }
}

function withHandler(target: Object, key: PropertyKey, descriptor: PropertyDescriptor): express.Handler {
  return async (req: express.Request, res: express.Response): Promise<void> => {
    if (target[REQUEST_REQUEST]?.key) {
      Object.defineProperty(target, target[REQUEST_REQUEST].key, {
        configurable: true,
        enumerable: true,
        value: req,
        writable: false
      });
    }

    if (target[RESPONSE_RESPONSE]?.key) {
      Object.defineProperty(target, target[RESPONSE_RESPONSE].key, {
        configurable: true,
        enumerable: true,
        value: res,
        writable: false
      });
    }

    const args: any[] = [];

    (target[REQUEST_PARAMS] || []).filter((i: any) => i.key === key)
      .forEach((p: any) => {
        args[p.index] = req.params[p.name];
      });

    (target[REQUEST_QUERIES] || []).filter((i: any) => i.key === key)
      .forEach((q: any) => {
        args[q.index] = req.query[q.name];
      });

    (target[REQUEST_BODIES] || []).filter((i: any) => i.key === key)
      .forEach((b: any) => {
        args[b.index] = req.body;
      });

    try {
      const data: any = await descriptor.value.call(target, ...args);

      res.json(data);
    } catch (e) {
      res.status(e.status || 500).json(e.message);
    }
  }
}

export const router: express.Router = express.Router();

export function Route() { }

Route.Param = function (name: string): MethodDecorator {
  return function (target: Object, _key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.param(name, async (req: express.Request, _res: express.Response, next: express.NextFunction): Promise<void> => {
      try {
        await descriptor.value.call(target, req.params[name]);

        next();
      } catch (e) {
        next(e);
      }
    });
  }
}

Route.Get = function (path: string): MethodDecorator {
  return function (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).get(withHandler(target, key, descriptor));
  }
}

Route.Post = function (path: string): MethodDecorator {
  return function (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).post(withStatus(201), withHandler(target, key, descriptor)
    );
  }
}

Route.Put = function (path: string): MethodDecorator {
  return function (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).put(withHandler(target, key, descriptor));
  }
}

Route.Delete = function (path: string): MethodDecorator {
  return function (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).delete(withStatus(204), withHandler(target, key, descriptor));
  }
}
