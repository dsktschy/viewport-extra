type NumberStringRecord = Record<string, number | string>

export const convertToViewportContentString = (
  numberStringRecord: NumberStringRecord
) =>
  Object.entries(numberStringRecord)
    .map(([key, value]) => {
      const kebabizedKey = key
        .replace(/\s+/g, '')
        .replace(/[A-Z]+/g, s => `-${s.charAt(0)}`)
        .toLowerCase()
      return `${kebabizedKey}=${value}`
    })
    .sort()
    .join(',')

export const convertToJsonString = (numberStringRecord: NumberStringRecord) =>
  JSON.stringify(
    Object.entries(numberStringRecord)
      .sort()
      .reduce<NumberStringRecord>((result, [key, value]) => {
        result[key] = value
        return result
      }, {})
  )
