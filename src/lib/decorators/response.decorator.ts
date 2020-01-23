export const RESPONSE_RESPONSE: symbol = Symbol('RESPONSE_RESPONSES');

export function Response(): PropertyDecorator {
  return function (target: Object, key: PropertyKey): void {
    target[RESPONSE_RESPONSE] = { key };
  }
}
