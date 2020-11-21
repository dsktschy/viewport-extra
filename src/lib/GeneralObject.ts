export interface GeneralObject {
  [key: string]: unknown
}

export const isGeneralObject = (value: unknown): value is GeneralObject =>
  typeof value === 'object' && value !== null
