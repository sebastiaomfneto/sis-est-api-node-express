export class NotFoundError extends Error {
  status: number = 404;
  message: string;

  constructor(message: string = 'Not Found') {
    super(message);
  }
}
