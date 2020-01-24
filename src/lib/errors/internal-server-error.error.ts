export class InternalServerError extends Error {
  status: number = 500;
  message: string;

  constructor(message: string = 'Internal Server Error') {
    super(message);
  }
}
