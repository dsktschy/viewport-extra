type StringRecord = Record<string, string>

export const convertToViewportContentString = (stringRecord: StringRecord) =>
  Object.entries(stringRecord)
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join(',')
