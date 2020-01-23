import { Route, Request } from '../lib';
import { NotFoundError, BadRequestError } from '../lib/errors';

import { Entry } from '../models';

export default class EntryController {
  entry: Entry;

  @Route.Param('entryId')
  async findById(entryId: string): Promise<void> {
    const entry: Entry | null = await Entry.findByPk(entryId);

    if (!entry) {
      throw new NotFoundError();
    }

    this.entry = entry;
  }

  @Route.Get('/entries')
  async index(): Promise<Entry[]> {
    return await Entry.findAll();
  }

  @Route.Get('/entries/:entryId')
  async find(): Promise<Entry> {
    return this.entry;
  }

  @Route.Post('/entries')
  async create(@Request.Body() body: Partial<Entry>): Promise<Entry> {
    try {
      return await Entry.create(body);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Route.Put('/entries/:entryId')
  async update(@Request.Body() body: Partial<Entry>): Promise<Entry> {
    await this.entry.update(body);

    return this.entry;
  }

  @Route.Delete('/entries/:entryId')
  async remove(): Promise<void> {
    await this.entry.destroy();
  }
}
