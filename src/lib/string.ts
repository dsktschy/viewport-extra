/**
 * Minimum kebab-to-camel converter
 * Complicated string can not be handled
 */
export const camelize = (value: string): string =>
  value
    .replace(/\s+/g, '')
    .toLowerCase()
    .replace(/-./g, s => s.charAt(1).toUpperCase())

/**
 * Minimum camel-to-kebab converter
 * Complicated string can not be handled
 */
export const kebabize = (value: string): string =>
  value
    .replace(/\s+/g, '')
    .replace(/[A-Z]+/g, s => `-${s.charAt(0)}`)
    .toLowerCase()
