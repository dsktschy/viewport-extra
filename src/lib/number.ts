export const numberIsFinite: typeof Number.isFinite =
  __TYPESCRIPT_TARGET__ !== "es5"
    ? /* eslint-disable-next-line compat/compat */
      Number.isFinite
    : // biome-ignore lint/suspicious/noGlobalIsFinite:
      (maybeNumber) => typeof maybeNumber === "number" && isFinite(maybeNumber);

export const mathTrunc: typeof Math.trunc =
  __TYPESCRIPT_TARGET__ !== "es5"
    ? /* eslint-disable-next-line compat/compat */
      Math.trunc
    : (num) => (num < 0 ? Math.ceil : Math.floor)(num);

export const numberIsNaN: typeof Number.isNaN =
  __TYPESCRIPT_TARGET__ !== "es5"
    ? /* eslint-disable-next-line compat/compat */
      Number.isNaN
    : // biome-ignore lint/suspicious/noSelfCompare:
      (maybeNumber) => maybeNumber !== maybeNumber;

export const truncateDecimalNumber = (
  num: number,
  decimalPlaces: number,
): number =>
  numberIsFinite(decimalPlaces)
    ? mathTrunc(num * 10 ** decimalPlaces) / 10 ** decimalPlaces
    : num;
