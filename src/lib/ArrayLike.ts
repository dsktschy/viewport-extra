export const arrayFrom: typeof Array.from =
  __TYPESCRIPT_TARGET__ !== "es5"
    ? /* eslint-disable-next-line compat/compat */
      Array.from
    : <T>(arrayLike: ArrayLike<T>) =>
        (Array.prototype as T[]).slice.call(arrayLike);
