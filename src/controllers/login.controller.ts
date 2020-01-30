import { Request, Response } from 'express';
import { Route, buildJwtToken } from '../lib';
import { User } from '../models';

@Route('/login')
export class LoginController {

  @Route.Post()
  async create(req: Request, res: Response): Promise<void> {
    const user: User = await User.autenticate(req.body.userName, req.body.password);

    const token: string = buildJwtToken(user.id.toString());

    res.status(201).json(token);
  }
}
