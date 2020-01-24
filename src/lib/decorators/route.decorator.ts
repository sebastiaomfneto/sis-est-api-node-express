import express from 'express';
import { Model, ModelCtor } from 'sequelize';
import { REQUEST_REQUEST, REQUEST_PARAMS, REQUEST_QUERIES, REQUEST_BODIES } from './request.decorator';
import { RESPONSE_RESPONSE } from './response.decorator';
import { AUTHENTICATION_AUTHENTICATE, getJwtTokenPayload, AUTHENTICATION_USER } from './authentication.decorator';
import { AUTHENTICATION_REQUIRE } from './authorization.decorator';
import { RequestMetadata } from '../interfaces/request-metadata';
import { UnauthorizedError, ForbiddenError } from '../errors';

declare global {
  namespace Express {
    interface Request {
      user?: Model
    }
  }
}

function buildStatusHandler(status: number): express.Handler {
  return (_req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(status);

    next();
  }
}

function buildAuthenticationHandler(target: Object, key: PropertyKey): express.Handler {
  return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    if ((target[AUTHENTICATION_AUTHENTICATE] || []).find((i: any) => i.key === key)) {
      const { User }: { User: ModelCtor<Model> } = require('../../models/user.model');

      try {
        const token: string | undefined = req.headers.authorization?.replace(/Bearer\s/g, '');

        if (!token) {
          throw new UnauthorizedError();
        }

        const jwtPayload: string = getJwtTokenPayload(token) as string;

        const user: Model | null = await User.findByPk(jwtPayload);

        if (!user) {
          throw new UnauthorizedError();
        }

        req.user = user;

        next();
      } catch (e) {
        next(e);
      }
    } else {
      next();
    }
  }
}

function buildAuthorizationHandler(target: Object, key: PropertyKey): express.Handler {
  return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const authorization: { key: number, role: string } | null = (target[AUTHENTICATION_REQUIRE] || []).find((i: any) => i.key === key);

    if (authorization && authorization.role !== (req.user as any).role) {
      return next(new ForbiddenError());
    }

    next();
  }
}

function buildFinalHandler(target: Object, key: PropertyKey, descriptor: PropertyDescriptor): express.Handler {
  return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
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

    (target[REQUEST_PARAMS] || []).filter((i: RequestMetadata) => i.key === key)
      .forEach((p: RequestMetadata) => {
        args[p.index] = req.params[p.name as string];
      });

    (target[REQUEST_QUERIES] || []).filter((i: RequestMetadata) => i.key === key)
      .forEach((q: RequestMetadata) => {
        args[q.index] = req.query[q.name as string];
      });

    (target[REQUEST_BODIES] || []).filter((i: RequestMetadata) => i.key === key)
      .forEach((b: RequestMetadata) => {
        args[b.index] = req.body;
      });

    (target[AUTHENTICATION_USER] || []).filter((i: any) => i.key === key)
      .forEach((u: RequestMetadata) => {
        args[u.index] = req.user;
      });

    try {
      const data: any = await descriptor.value.call(target, ...args);

      res.json(data);
    } catch (e) {
      next(e);
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
    router.route(path).get(buildAuthenticationHandler(target, key), buildAuthorizationHandler(target, key), buildFinalHandler(target, key, descriptor));
  }
}

Route.Post = function (path: string): MethodDecorator {
  return function (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).post(buildAuthenticationHandler(target, key), buildAuthorizationHandler(target, key), buildStatusHandler(201), buildFinalHandler(target, key, descriptor)
    );
  }
}

Route.Put = function (path: string): MethodDecorator {
  return function (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).put(buildAuthenticationHandler(target, key), buildAuthorizationHandler(target, key), buildFinalHandler(target, key, descriptor));
  }
}

Route.Delete = function (path: string): MethodDecorator {
  return function (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).delete(buildAuthenticationHandler(target, key), buildAuthorizationHandler(target, key), buildStatusHandler(204), buildFinalHandler(target, key, descriptor));
  }
}
