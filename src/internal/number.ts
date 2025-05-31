export const mathTrunc: typeof Math.trunc =
  __TYPESCRIPT_TARGET__ !== "es5"
    ? /* eslint-disable-next-line compat/compat */
      Math.trunc
    : (num) => (num < 0 ? Math.ceil : Math.floor)(num);

export const truncateDecimalNumber = (
  num: number,
  decimalPlaces: number,
): number =>
  // biome-ignore lint/suspicious/noGlobalIsFinite: isFinite is safe to use here
  isFinite(decimalPlaces)
    ? mathTrunc(num * 10 ** decimalPlaces) / 10 ** decimalPlaces
    : num;
