export class ForbiddenError extends Error {
  status: number = 403;
  message: string;

  constructor(message: string = 'Forbidden') {
    super(message);
  }
}
