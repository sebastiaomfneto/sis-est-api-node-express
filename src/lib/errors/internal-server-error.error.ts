export class InternalServerError extends Error {
  status: number = 500;
  message: string = 'Internal Server Error';

  constructor(message?: string) {
    super(message);
  }
}
