export { };

/**
 * Type helper utilities for advanced TypeScript type manipulation.
 */
declare global {
  /**
   * Make all properties of T deep readonly.
   */
  type DeepReadonly<T> = T extends (infer R)[]
    ? DeepReadonlyArray<R>
    : T extends Function
    ? T
    : T extends object
    ? DeepReadonlyObject<T>
    : T;

  interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

  type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
  };

  /**
   * Make all properties of T deep partial.
   */
  type DeepPartial<T> = T extends object
    ? {
        [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

  /**
   * Extract the type of array elements.
   */
  type ArrayElement<ArrayType extends readonly unknown[]> = 
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

  /**
   * Make specified keys required.
   */
  type RequireKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

  /**
   * Make specified keys optional.
   */
  type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

  /**
   * Get the union type of all the values in an object type T.
   */
  type ValueOf<T> = T[keyof T];

  /**
   * Get the union type of all property names in T that are assignable to type V.
   */
  type KeysMatching<T, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
  }[keyof T];

  /**
   * Get the type of a Promise.
   */
  type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

  /**
   * Convert union type to intersection type.
   */
  type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;

  /**
   * Exclude null and undefined from T.
   */
  type NonNullable<T> = T extends null | undefined ? never : T;

  /**
   * Extract non-function property names from type T.
   */
  type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
  }[keyof T];

  /**
   * Extract function property names from type T.
   */
  type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
  }[keyof T];

  /**
   * Pick only non-function properties from type T.
   */
  type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

  /**
   * Pick only function properties from type T.
   */
  type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

  /**
   * Make all properties nullable (can be null).
   */
  type Nullable<T> = {
    [P in keyof T]: T[P] | null;
  };

  /**
   * Merge two types, with properties in B overwriting properties in A.
   */
  type Merge<A, B> = Omit<A, keyof B> & B;

  /**
   * Get keys that are in T but not in U.
   */
  type Diff<T, U> = T extends U ? never : T;

  /**
   * Get a type with only the properties of T that are also in U.
   */
  type Intersection<T, U> = Pick<T, Extract<keyof T, keyof U>>;
}
