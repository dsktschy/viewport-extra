export const truncateDecimalNumber = (
  num: number,
  decimalPlaces: number,
): number => {
  const mathTrunc = (x: number): number => (x < 0 ? Math.ceil : Math.floor)(x);
  return Number.isFinite(decimalPlaces)
    ? mathTrunc(num * 10 ** decimalPlaces) / 10 ** decimalPlaces
    : num;
};
