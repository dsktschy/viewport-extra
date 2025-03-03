export const camelizeKebabCaseString = (str: string): string =>
  str
    .replace(/\s+/g, "")
    .toLowerCase()
    .replace(/-./g, (s) => s.charAt(1).toUpperCase());

export const kebabizeCamelCaseString = (str: string): string =>
  str
    .replace(/\s+/g, "")
    .replace(/[A-Z]+/g, (s) => `-${s.charAt(0)}`)
    .toLowerCase();
