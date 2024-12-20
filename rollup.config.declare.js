import path from 'node:path'
import { fileURLToPath } from 'node:url'
import rollupPluginDelete from 'rollup-plugin-delete'
import rollupPluginDts from 'rollup-plugin-dts'
import packageJson from './package.json' with { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const importDefaultPath = path.resolve(
  __dirname,
  packageJson.exports['.'].import.default
)
const importTypesPath = path.resolve(
  __dirname,
  packageJson.exports['.'].import.types
)
const requireDefaultPath = path.resolve(
  __dirname,
  packageJson.exports['.'].require.default
)

export default {
  input: path.resolve(__dirname, '.types/index.d.ts'),
  output: [
    {
      file: importTypesPath,
      format: 'es',
      exports: 'named'
    },
    {
      file: `${importDefaultPath}/../index.d.ts`,
      format: 'es',
      exports: 'named'
    },
    {
      file: `${requireDefaultPath}/../index.d.ts`,
      format: 'es',
      exports: 'named'
    }
  ],
  plugins: [
    rollupPluginDelete({
      targets: [
        importTypesPath,
        `${importDefaultPath}/../index.d.ts`,
        `${requireDefaultPath}/../index.d.ts`
      ]
    }),
    rollupPluginDts()
  ]
}
