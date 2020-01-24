import { UserRole } from "../../models";

export const AUTHENTICATION_REQUIRE: symbol = Symbol('AUTHENTICATION_REQUIRE');

export function Authorization() { }

Authorization.Require = function (role: UserRole): MethodDecorator {
  return function (target: Object, key: PropertyKey): void {
    target[AUTHENTICATION_REQUIRE] = (target[AUTHENTICATION_REQUIRE] || []).concat({ key, role });
  }
}
