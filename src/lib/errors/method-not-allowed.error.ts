export class MethodNotAllowedError extends Error {
  status: number = 405;
  message: string = 'Method Not Allowed';

  constructor(message?: string) {
    super(message);
  }
}
