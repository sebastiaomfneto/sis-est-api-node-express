export class UnauthorizedError extends Error {
  status: number = 401;
  message: string;

  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}
