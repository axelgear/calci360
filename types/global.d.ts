export { };

/**
 * Declarations that enter the global namespace, or augment existing declarations in the global namespace.
 */
declare global {
  /**
   * Boolean and its string form.
   */
  type Booleanish = boolean | BooleanString;
  /**
   * String form of boolean.
   */
  type BooleanString = "true" | "false";
  /**
   * Number and its string form.
   */
  type Numberish = number | string;
  /**
   * Any human-readable type, including string, number, bigint.
   */
  type Readable = string | number | bigint;
  /**
   * Want to bypass warnings and use any?
   */
  type Any = Parameters<typeof alert>[0];
  /**
   * Whatever it is, it's an object anyway.
   */
  type AnyObject = Record<PropertyKey, Any>;
  /**
   * Why does Record need to manually specify the key type? Redundant.
   * @template T - The type of value.
   */
  type RecordValue<T> = Record<PropertyKey, T>;
  /**
   * Tuple representing a 2D point.
   */
  type TwoD = [number, number];
  /**
   * Tuple representing a 3D point.
   */
  type ThreeD = [number, number, number];
  /**
   * Tuple representing a 4D point.
   */
  type FourD = [number, number, number, number];
  /**
   * Specified type or a parameterless function returning the specified type.
   * @template T - The specified type and the type returned by the parameterless function.
   */
  type TypeOrReturnToType<T> = T | (() => T);
  /**
   * This object is created internally and returned from `setTimeout()` and `setInterval()`. It can be passed to `clearTimeout()` or `clearInterval()` to cancel the scheduled action.
   *
   * By default, when a timer is scheduled using `setTimeout()` or `setInterval()`, the Node.js event loop will continue running as long as the timer is active. Each `Timeout` object returned by these functions exports `timeout.ref()` and `timeout.unref()` functions that can be used to control this default behavior.
   */
  interface Timeout extends NodeJS.Timeout { }
  /**
   * SCSS variable values. The numbers property contains values converted to number type.
   */
  interface IScssVariables extends DeepReadonly<Record<string, string> & { numbers: Record<string, number> }> { }
  /**
   * Use SCSS variable values. The numbers property contains values converted to number type.
   */
  declare function useScssVariables(): IScssVariables;
  
  interface Window {
    /**
     * ActiveX object only available in Internet Explorer, returns undefined in modern browsers.
     */
    ActiveXObject: undefined;
  }
  
  interface Document {
    /**
     * Text selection object available in Internet Explorer.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/getSelection)
     */
    selection: Selection | null;
  }
  
  interface ScreenOrientation {
    /**
     * The `lock()` property of the `ScreenOrientation` interface locks the orientation of the document to a specified orientation.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/ScreenOrientation/lock)
     */
    lock(type: "any" | "natural" | "landscape" | "portrait" | OrientationType): Promise<void>;
  }
}
