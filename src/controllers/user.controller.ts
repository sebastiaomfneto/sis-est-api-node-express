import { Route, Request } from '../lib';
import { NotFoundError, BadRequestError } from '../lib/errors';

import { User } from '../models';

export class UserController {
  user: User;

  @Route.Param('userId')
  async findById(userId: string): Promise<void> {
    const user: User | null = await User.findByPk(userId);

    if (!user) {
      throw new NotFoundError();
    }

    this.user = user;
  }

  @Route.Get('/users')
  async index(): Promise<User[]> {
    return await User.findAll();
  }

  @Route.Get('/users/:userId')
  async find(): Promise<User> {
    return this.user;
  }

  @Route.Post('/users')
  async create(@Request.Body() body: Partial<User>): Promise<User> {
    try {
      return await User.create(body);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Route.Put('/users/:userId')
  async update(@Request.Body() body: Partial<User>): Promise<User> {
    await this.user.update(body);

    return this.user;
  }

  @Route.Delete('/users/:userId')
  async remove(): Promise<void> {
    await this.user.destroy();
  }
}
