const sources: WeakMap<Function, Function> = new WeakMap<Function, Function>();

export function DI() { }

DI.Provide = function (): ClassDecorator {
  return function (target: Function): void {
    sources.set(target, () => Object.create(target.prototype));
  }
}

DI.Inject = function (source: any): PropertyDecorator {
  return function (target: Object, key: string | symbol): void {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      get: sources.has(source)
        ? sources.get(source) as () => any
        : () => null,
      writable: false
    });
  }
}
