export const truncateDecimalNumber = (
  num: number,
  decimalPlaces: number,
): number => {
  const mathTrunc = (x: number): number => (x < 0 ? Math.ceil : Math.floor)(x);
  // biome-ignore lint/suspicious/noGlobalIsFinite: decimalPlaces is always number
  return isFinite(decimalPlaces)
    ? mathTrunc(num * 10 ** decimalPlaces) / 10 ** decimalPlaces
    : num;
};
