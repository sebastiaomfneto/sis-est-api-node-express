export class MethodNotAllowedError extends Error {
  status: number = 405;
  message: string;

  constructor(message: string = 'Method Not Allowed') {
    super(message);
  }
}
