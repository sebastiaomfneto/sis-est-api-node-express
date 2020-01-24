import { Handler, Request, Response, NextFunction } from 'express';
import { ModelCtor, Model } from 'sequelize/types';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';

declare global {
  namespace Express {
    interface Request {
      user?: Model
    }
  }
}

const { JWT_SECRET = 'secret' } = process.env;

export const buildJwtToken = function (payload: string): string {
  return jwt.sign(payload, JWT_SECRET);
}

export function Authentication() { }

Authentication.Authenticate = function (): MethodDecorator {
  return function (target: Object, _key: PropertyKey, descriptor: PropertyDescriptor): void {
    const { value }: { value?: Handler } = descriptor;

    descriptor.value = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { User }: { User: ModelCtor<Model> } = require('../../models/user.model');

      const token: string | undefined = req.headers.authorization?.replace(/Bearer\s/g, '');

      if (!token) {
        return next(new UnauthorizedError());
      }

      const jwtPayload: string = jwt.decode(token) as string;

      const user: Model | null = await User.findByPk(jwtPayload);

      if (!user) {
        return next(new UnauthorizedError());
      }

      req.user = user;
      value?.call(target, req, res, next);
    }
  }
}
