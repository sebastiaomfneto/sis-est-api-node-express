import jwt from 'jsonwebtoken';

const { JWT_SECRET = 'secret' } = process.env;

export const AUTHENTICATION_AUTHENTICATE: symbol = Symbol('AUTHENTICATION_AUTHENTICATE');

export const AUTHENTICATION_USER: symbol = Symbol('AUTHENTICATION_USER');

export const getJwtTokenPayload = function (token): string | { [key: string]: any } | null {
  return jwt.decode(token);
}

export const buildJwtToken = function (payload: string): string {
  return jwt.sign(payload, JWT_SECRET);
}

export function Authentication() { }

Authentication.Authenticate = function (): MethodDecorator {
  return function (target: Object, key: PropertyKey): void {
    target[AUTHENTICATION_AUTHENTICATE] = (target[AUTHENTICATION_AUTHENTICATE] || []).concat({ key });
  }
}

Authentication.User = function(): ParameterDecorator {
  return function (target: Object, key: PropertyKey, index: number): void {
    target[AUTHENTICATION_USER] = (target[AUTHENTICATION_USER] || []).concat({ key, index });
  }
}
