import { Request, Response, NextFunction } from 'express';
import { Route, Authentication, Authorization } from '../lib';
import { NotFoundError } from '../lib/errors';
import { User, UserRole } from '../models';

export class UserController {
  user: User;

  @Route.Param('userId')
  async findById(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const user: User | null = await User.findByPk(req.params.userId);

    if (!user) {
      throw new NotFoundError();
    }

    this.user = user;

    next();
  }

  @Route.Get('/users')
  @Authentication.Authenticate()
  @Authorization.Require(UserRole.ADMIN)
  async index(_req: Request, res: Response): Promise<void> {
    const users: User[] = await User.findAll();

    res.json(users);
  }

  @Route.Get('/users/:userId')
  @Authentication.Authenticate()
  @Authorization.OnlyAdminOrSelfUser('userId')
  async find(_req: Request, res: Response): Promise<void> {
    res.json(this.user.toJSON());
  }

  @Route.Post('/users')
  @Authentication.Authenticate()
  @Authorization.Require(UserRole.ADMIN)
  async create(req: Request, res: Response): Promise<void> {
    //Apenas administradores podem definir usuários administradores.
    if (req.user?.isUser) {
      req.body.role === UserRole.USER;
    }

    const user: User = await User.create(req.body);

    res.status(201).json(user.toJSON());
  }

  @Route.Put('/users/:userId')
  @Authentication.Authenticate()
  @Authorization.OnlyAdminOrSelfUser('userId')
  async update(req: Request, res: Response): Promise<void> {
    //Apenas administradores podem definir usuários administradores.
    if (req.user?.isUser) {
      req.body.role === UserRole.USER;
    }

    await this.user.update(req.body);

    res.json(this.user.toJSON());
  }

  @Route.Delete('/users/:userId')
  @Authentication.Authenticate()
  @Authorization.OnlyAdminOrSelfUser('userId')
  async remove(req: Request, res: Response): Promise<void> {
    await this.user.destroy();

    res.status(204).json();
  }
}
