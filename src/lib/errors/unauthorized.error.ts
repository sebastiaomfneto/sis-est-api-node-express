export class UnauthorizedError extends Error {
  status: number = 401;
  message: string = 'Unauthorized';

  constructor(message?: string) {
    super(message);
  }
}
