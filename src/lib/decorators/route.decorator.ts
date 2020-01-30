import express, { Handler, Request, Response, NextFunction } from 'express';

export const router: express.Router = express.Router();

export function Route() { }

Route.Param = function (name: string): MethodDecorator {
  return function (target: Object, _key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.param(name, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await (descriptor.value as Handler).call(target, req, res, next);
      } catch (e) {
        next(e);
      }
    });
  }
}

Route.Get = function (path: string): MethodDecorator {
  return function (target: Object, _key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).get(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        (descriptor.value as Handler).bind(target, req, res, next);
      } catch (e) {
        next(e);
      }
    });
  }
}

Route.Post = function (path: string): MethodDecorator {
  return function (target: Object, _key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).post(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await (descriptor.value as Handler).call(target, req, res, next);
      } catch (e) {
        next(e);
      }
    });
  }
}

Route.Put = function (path: string): MethodDecorator {
  return function (target: Object, _key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).put(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await (descriptor.value as Handler).call(target, req, res, next);
      } catch (e) {
        next(e);
      }
    });
  }
}

Route.Delete = function (path: string): MethodDecorator {
  return function (target: Object, _key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).delete(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await (descriptor.value as Handler).call(target, req, res, next);
      } catch (e) {
        next(e);
      }
    });
  }
}
