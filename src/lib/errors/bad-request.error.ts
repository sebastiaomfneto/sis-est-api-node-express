export class BadRequestError extends Error {
  status: number = 400;
  message: string;

  constructor(message: string = 'Bad Request') {
    super(message);
  }
}
