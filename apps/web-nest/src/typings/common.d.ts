/** The common type namespace */
declare namespace CommonType {
  /** The strategic pattern */
  interface StrategicPattern {
    /** The condition */
    condition: boolean;
    /** If the condition is true, then call the action function */
    callback: () => void;
  }

  /**
   * The option type
   *
   * @property value: The option value
   * @property label: The option label
   */
  type Option<K = string> = { label: string; value: K };

  /**
   *  The yes or no type
   *  @property 0: No
   *  @property 1: Yes
   */

  type YesOrNo = '0' | '1';

  /** add null to all properties */
  type RecordNullable<T> = {
    [K in keyof T]?: null | T[K];
  };
}
