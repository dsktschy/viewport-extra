import * as packageJson from '../package.json'
import { ensureViewportElement } from './lib/Document'

if (typeof window !== 'undefined') ensureViewportElement(document)

export const version = packageJson.version

const ViewportExtra = {
  version: packageJson.version
}
export default ViewportExtra
