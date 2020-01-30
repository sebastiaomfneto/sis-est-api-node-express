import { Request, Response, NextFunction } from 'express';
import { Route, Authentication } from '../lib';
import { NotFoundError } from '../lib/errors';

import { Entry } from '../models';

export default class EntryController {
  entry: Entry;

  @Route.Param('entryId')
  async findById(req: Request<{ entryId: string }>, _res: Response, next: NextFunction): Promise<void> {
    const entry: Entry | null = await Entry.findByPk(req.params.entryId);

    if (!entry) {
      throw new NotFoundError();
    }

    this.entry = entry;

    next();
  }

  @Route.Get('/entries'/* , {
    responses: {
      '200': {
        description: 'Entry model instance',
        content: {
          'application/json': {
            schema: {
              type: '',
              items: {
                initialDate: { type: 'Date' }
              }
            }
          }
        }
      }
    }
  } */)
  @Authentication.Authenticate()
  async index(_req: Request, res: Response): Promise<void> {
    const entries: Entry[] = await Entry.findAll();

    res.json(entries);
  }

  @Route.Get('/entries/:entryId')
  @Authentication.Authenticate()
  async find(_req: Request, res: Response): Promise<void> {
    res.json(this.entry.toJSON());
  }

  @Route.Post('/entries')
  @Authentication.Authenticate()
  async create(req: Request, res: Response): Promise<void> {
    const entry: Entry = await Entry.create(req.body);

    res.status(201).json(entry.toJSON());
  }

  @Route.Put('/entries/:entryId')
  @Authentication.Authenticate()
  async update(req: Request, res: Response): Promise<void> {
    await this.entry.update(req.body);

    res.json(this.entry.toJSON());
  }

  @Route.Delete('/entries/:entryId')
  @Authentication.Authenticate()
  async remove(_req: Request, res: Response): Promise<void> {
    await this.entry.destroy();

    res.status(204).json();
  }
}
