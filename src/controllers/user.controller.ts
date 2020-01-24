import { Route, Request, buildJwtToken, Authentication, Authorization } from '../lib';
import { NotFoundError, BadRequestError, UnauthorizedError } from '../lib/errors';

import { User, UserLogin, UserRole } from '../models';

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
  @Authentication.Authenticate()
  async index(): Promise<User[]> {
    return await User.findAll();
  }

  @Route.Get('/users/:userId')
  @Authentication.Authenticate()
  async find(): Promise<User> {
    return this.user;
  }

  @Route.Post('/users')
  @Authentication.Authenticate()
  @Authorization.Require(UserRole.ADMIN)
  async create(@Request.Body() body: Partial<User>): Promise<User> {
    try {
      return await User.create(body);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Route.Put('/users/:userId')
  @Authentication.Authenticate()
  async update(@Request.Body() body: Partial<User>): Promise<User> {
    await this.user.update(body);

    return this.user;
  }

  @Route.Delete('/users/:userId')
  @Authentication.Authenticate()
  async remove(): Promise<void> {
    await this.user.destroy();
  }

  @Route.Post('/users/login')
  async login(@Request.Body() { userName, password }: UserLogin): Promise<string> {
    try {
      const user: User = await User.autenticate(userName, password);

      return buildJwtToken(user.id.toString());
    } catch (e) {
      throw new UnauthorizedError(e.message);
    }
  }
}
