import { Route, Request, Authentication } from '../lib';
import { NotFoundError, BadRequestError } from '../lib/errors';

import { Parameter } from '../models';

export class ParameterController {
  parameter: Parameter;

  @Route.Param('parameterId')
  async findById(parameterId: string): Promise<void> {
    const parameter: Parameter | null = await Parameter.findByPk(parameterId);

    if (!parameter) {
      throw new NotFoundError();
    }

    this.parameter = parameter;
  }

  @Route.Get('/parameters')
  @Authentication.Authenticate()
  async index(): Promise<Parameter[]> {
    return await Parameter.findAll();
  }

  @Route.Get('/parameters/:parameterId')
  @Authentication.Authenticate()
  async find(): Promise<Parameter> {
    return this.parameter;
  }

  @Route.Post('/parameters')
  @Authentication.Authenticate()
  async create(@Request.Body() body: Partial<Parameter>): Promise<Parameter> {
    try {
      return await Parameter.create(body);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Route.Put('/parameters/:parameterId')
  @Authentication.Authenticate()
  async update(@Request.Body() body: Partial<Parameter>): Promise<Parameter> {
    await this.parameter.update(body);

    return this.parameter;
  }
}
