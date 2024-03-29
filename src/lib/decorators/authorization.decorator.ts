import { Handler, Request, Response, NextFunction } from 'express';
import { UserRole } from "../../models";
import { ForbiddenError } from '../errors';

export function Authorization() { }

Authorization.Require = function (role: UserRole): MethodDecorator {
  return function (target: Object, _key: PropertyKey, descriptor: PropertyDescriptor): void {
    const { value }: { value?: Handler } = descriptor;

    descriptor.value = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (req.user?.role === role) {
        value?.call(target, req, res, next);
      } else {
        next(new ForbiddenError());
      }
    }
  }
}

Authorization.OnlyAdminOrSelfUser = function (userIdParam: string): MethodDecorator {
  return function (target: Object, _key: PropertyKey, descriptor: PropertyDescriptor): void {
    const { value }: { value?: Handler } = descriptor;

    descriptor.value = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (req.user?.isAdmin || req.user?.id.toString() === req.params[userIdParam]) {
        value?.call(target, req, res, next);
      } else {
        next(new ForbiddenError());
      }
    }
  }
}
