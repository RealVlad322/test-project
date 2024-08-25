declare global {
  // helper functions
  function isArray<T = any>(
    x: T,
    // @ts-ignore
  ): x is Extract<T, any[]> extends never ? any[] : T extends any[] ? Flatten<T>[] : never;
  function isObject(x: unknown): x is { [key: string | number | symbol]: any };
  function isBoolean(x: unknown): x is boolean;
  function isNumber(x: unknown): x is number;
  function isInteger(x: unknown): x is number;
  function isString(x: unknown): x is string;
  function isNil(x: unknown): x is null | undefined;
  function isFunction<T extends Function>(x: unknown): x is T;
  function isId(x: unknown): x is import('mongoose').Types.ObjectId;
  function notEmpty<T>(x: T): x is NonNullable<T>;

  // @evojs/context
  const magicThis: import('@evojs/context').Context | undefined;

  interface ContextPayload {
    cached: boolean;
    userId: import('mongoose').Types.ObjectId;
    debug: string;
    accountId: import('mongoose').Types.ObjectId;
  }

  // common
  type SomeError = Error & { cause?: any; data?: any; [key: string]: any };

  interface Type<T = any> {
    new (...args: any): T;
    [key: string | symbol]: any;
  }

  type Flatten<T> = T extends any[] ? T[number] : T;

  type PickByType<O, T> = Pick<O, { [P in keyof O]: O[P] extends T ? P : never }[keyof O]>;
  type OmitByType<O, T> = Pick<O, { [P in keyof O]: O[P] extends T ? never : P }[keyof O]>;

  type DeepPartial<T> = T extends { [key: string]: any }
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;
}

export {};
