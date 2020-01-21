import express from 'express';

const ROUTE_PARAMS: symbol = Symbol('ROUTE_PARAMS');

const ROUTE_QUERIES: symbol = Symbol('ROUTE_QUERIES');

const ROUTE_BODIES: symbol = Symbol('ROUTE_BODIES');

function buildArgs(target: any, key: PropertyKey, req: express.Request): any[] {
  const args: any[] = [];

  if (!target[ROUTE_PARAMS]) {
    target[ROUTE_PARAMS] = [];
  }

  if (!target[ROUTE_QUERIES]) {
    target[ROUTE_QUERIES] = [];
  }

  if (!target[ROUTE_BODIES]) {
    target[ROUTE_BODIES] = [];
  }

  const params = target[ROUTE_PARAMS].filter((i: any) => i.key === key);
  const queries = target[ROUTE_QUERIES].filter((i: any) => i.key === key);
  const bodies = target[ROUTE_BODIES].filter((i: any) => i.key === key);

  params.forEach((p: any) => {
    args[p.index] = req.params[p.name];
  });

  queries.forEach((q: any) => {
    args[q.index] = req.query[q.name];
  });

  bodies.forEach((b: any) => {
    args[b.index] = req.body;
  });

  return args;
}

export const router: express.Router = express.Router();

export function Route() { }

Route.Param = function (name: string): ParameterDecorator {
  return function (target: any, key: PropertyKey, index: number): void {
    if (!target[ROUTE_PARAMS]) {
      target[ROUTE_PARAMS] = [];
    }

    target[ROUTE_PARAMS].push({ key, index, name });
  }
}

Route.Query = function (name: string): ParameterDecorator {
  return function (target: any, key: PropertyKey, index: number): void {
    if (!target[ROUTE_QUERIES]) {
      target[ROUTE_QUERIES] = [];
    }

    target[ROUTE_QUERIES].push({ key, index, name });
  }
}

Route.Body = function (): ParameterDecorator {
  return function (target: any, key: PropertyKey, index: number): void {
    if (!target[ROUTE_BODIES]) {
      target[ROUTE_BODIES] = [];
    }

    target[ROUTE_BODIES].push({ key, index });
  }
}

Route.Get = function (path: string): MethodDecorator {
  return function (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).get(async (req: express.Request, res: express.Response) => {
      target.constructor(req, res);

      try {
        res.status(200);

        const data: any = await descriptor.value.call(target, ...buildArgs(target, key, req));

        res.json(data);
      } catch (e) {
        res.status(e.status || 500).json(e.message);
      }
    });
  }
}

Route.Post = function (path: string): MethodDecorator {
  return function (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).post(async (req: express.Request, res: express.Response) => {
      target.constructor(req, res);

      try {
        res.status(201);

        const data: any = await descriptor.value.call(target, ...buildArgs(target, key, req));

        res.json(data);
      } catch (e) {
        res.status(e.status || 500).json(e.message);
      }
    });
  }
}

Route.Put = function (path: string): MethodDecorator {
  return function (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).put(async (req: express.Request, res: express.Response) => {
      target.constructor(req, res);

      try {
        res.status(200);

        const data: any = await descriptor.value.call(target, ...buildArgs(target, key, req));

        res.json(data);
      } catch (e) {
        res.status(e.status || 500).json(e.message);
      }
    });
  }
}

Route.Delete = function (path: string): MethodDecorator {
  return function (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void {
    router.route(path).delete(async (req: express.Request, res: express.Response) => {
      target.constructor(req, res);

      try {
        res.status(204);

        const data: any = await descriptor.value.call(target, ...buildArgs(target, key, req));

        res.json(data);
      } catch (e) {
        res.status(e.status || 500).json(e.message);
      }
    });
  }
}
