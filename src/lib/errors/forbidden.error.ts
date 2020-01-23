export class ForbiddenError extends Error {
  status: number = 403;
  message: string = 'Forbidden';

  constructor(message?: string) {
    super(message);
  }
}
