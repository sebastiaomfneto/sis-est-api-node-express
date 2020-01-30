import { Request, Response, NextFunction } from 'express';
import { Route, Authentication, Authorization } from '../lib';
import { NotFoundError } from '../lib/errors';
import { Parameter, UserRole } from '../models';

@Route('/parameters')
export class ParameterController {
  parameter: Parameter;

  @Route.Param('parameterId')
  async findById(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const parameter: Parameter | null = await Parameter.findByPk(req.params.parameterId);

    if (!parameter) {
      throw new NotFoundError();
    }

    this.parameter = parameter;

    next();
  }

  @Route.Get()
  @Authentication.Authenticate()
  @Authorization.Require(UserRole.ADMIN)
  async index(_req: Request, res: Response): Promise<void> {
    const parameters: Parameter[] = await Parameter.findAll();

    res.json(parameters);
  }

  @Route.Get('/:parameterId')
  @Authentication.Authenticate()
  @Authorization.Require(UserRole.ADMIN)
  async find(_req: Request, res: Response): Promise<void> {
    res.json(this.parameter);
  }

  @Route.Put('/:parameterId')
  @Authentication.Authenticate()
  @Authorization.Require(UserRole.ADMIN)
  async update(req: Request, res: Response): Promise<void> {
    await this.parameter.update(req.body);

    res.json(this.parameter.toJSON());
  }
}
