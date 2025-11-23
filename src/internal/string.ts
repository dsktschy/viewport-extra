export const camelizeKebabCaseString = (str: string): string =>
  str
    .replace(/\s+/g, "")
    .toLowerCase()
    .replace(/-./g, (s) => s[1].toUpperCase());

export const kebabizeCamelCaseString = (str: string): string =>
  str
    .replace(/\s+/g, "")
    .replace(/[A-Z]+/g, (s) => `-${s[0]}`)
    .toLowerCase();
