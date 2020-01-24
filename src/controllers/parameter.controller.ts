import { Request, Response, NextFunction } from 'express';
import { Route, Authentication } from '../lib';
import { NotFoundError } from '../lib/errors';

import { Parameter } from '../models';

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

  @Route.Get('/parameters')
  @Authentication.Authenticate()
  async index(_req: Request, res: Response): Promise<void> {
    const parameters: Parameter[] = await Parameter.findAll();

    res.json(parameters);
  }

  @Route.Get('/parameters/:parameterId')
  @Authentication.Authenticate()
  async find(_req: Request, res: Response): Promise<void> {
    res.json(this.parameter);
  }

  @Route.Post('/parameters')
  @Authentication.Authenticate()
  async create(req: Request, res: Response): Promise<void> {
    const parameter: Parameter = await Parameter.create(req.body);

    res.status(201).json(parameter.toJSON());
  }

  @Route.Put('/parameters/:parameterId')
  @Authentication.Authenticate()
  async update(req: Request, res: Response): Promise<void> {
    await this.parameter.update(req.body);

    res.json(this.parameter.toJSON());
  }
}
