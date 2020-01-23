export class NotFoundError extends Error {
  status: number = 404;
  message: string = 'Not Found';

  constructor(message?: string) {
    super(message);
  }
}
