type NumberStringRecord = Record<string, number | string>

export const convertToJsonString = (numberStringRecord: NumberStringRecord) =>
  JSON.stringify(
    Object.entries(numberStringRecord)
      .sort()
      .reduce<NumberStringRecord>((result, [key, value]) => {
        result[key] = value
        return result
      }, {})
  )
