export const REQUEST_REQUEST: symbol = Symbol('REQUEST_REQUESTS');

export const REQUEST_PARAMS: symbol = Symbol('REQUEST_PARAMS');

export const REQUEST_QUERIES: symbol = Symbol('REQUEST_QUERIES');

export const REQUEST_BODIES: symbol = Symbol('REQUEST_BODIES');

export function Request(): PropertyDecorator {
  return function (target: Object, key: PropertyKey): void {
    target[REQUEST_REQUEST] = { key }
  }
}

Request.Param = function (name: string): ParameterDecorator {
  return function (target: Object, key: PropertyKey, index: number): void {
    target[REQUEST_PARAMS] = (target[REQUEST_PARAMS] || []).concat({ key, index, name });
  }
}

Request.Query = function (name: string): ParameterDecorator {
  return function (target: Object, key: PropertyKey, index: number): void {
    target[REQUEST_QUERIES] = (target[REQUEST_QUERIES] || []).concat({ key, index, name });
  }
}

Request.Body = function (): ParameterDecorator {
  return function (target: Object, key: PropertyKey, index: number): void {
    target[REQUEST_BODIES] = (target[REQUEST_BODIES] || []).concat({ key, index });
  }
}
