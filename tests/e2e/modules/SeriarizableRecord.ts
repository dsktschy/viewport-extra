type SeriarizableValue =
  | string
  | number
  | boolean
  | null
  | SeriarizableValue[]
  | { [key: string]: SeriarizableValue }

type SeriarizableRecord = Record<string, SeriarizableValue>

export const convertToJsonString = (seriarizableRecord: SeriarizableRecord) =>
  JSON.stringify(
    Object.entries(seriarizableRecord)
      .sort()
      .reduce<SeriarizableRecord>((result, [key, value]) => {
        result[key] = value
        return result
      }, {})
  )
