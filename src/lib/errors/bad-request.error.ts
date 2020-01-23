export class BadRequestError extends Error {
  status: number = 400;
  message: string = 'Bad Request';

  constructor(message?: string) {
    super(message);
  }
}
