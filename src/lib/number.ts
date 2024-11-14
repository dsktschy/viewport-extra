import { type Content } from './Content.js'

export const createPartialContent = (num: number): Partial<Content> => ({
  minWidth: num
})
