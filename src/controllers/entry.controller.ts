import { Route } from '../lib';

export default class EntryController {
  @Route.Get('/entries')
  async index(@Route.Query('id') id?: number): Promise<any[]> {
    return [{ id }];
  }

  @Route.Get('/entries/:id')
  async find(@Route.Param('id') id: number): Promise<any> {
    return { id };
  }

  @Route.Post('/entries')
  async create(@Route.Body() body: any): Promise<any> {
    return { ...body };
  }

  @Route.Put('/entries/:id')
  async update(@Route.Param('id') id: number, @Route.Body() body: any): Promise<any> {
    return { id, ...body };
  }

  @Route.Delete('/entries/:id')
  async remove(@Route.Param('id') id: number): Promise<any> {
    return { id };
  }
}
