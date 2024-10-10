import path from 'node:path'
import { fileURLToPath } from 'node:url'
import rollupPluginTypescript from '@rollup/plugin-typescript'
import rollupPluginDelete from 'rollup-plugin-delete'
import rollupPluginTerser from '@rollup/plugin-terser'
import packageJson from './package.json' with { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Copyright
const banner =
  '/*!\n' +
  ` * Viewport Extra v${packageJson.version}\n` +
  ' * (c) dsktschy\n' +
  ' * Released under the MIT License.\n' +
  ' */'

// Enable to use class constructor without default key for iife
// https://github.com/rollup/rollup/issues/1961#issuecomment-534977678
const outro = 'exports = exports.default;\n' + 'exports.default = exports;'

// Global variable name for iife
const name = 'ViewportExtra'

const importDefaultPath = path.resolve(
  __dirname,
  packageJson.exports['.'].import.default
)
const requireDefaultPath = path.resolve(
  __dirname,
  packageJson.exports['.'].require.default
)
const jsdelivrPath = path.resolve(__dirname, packageJson.jsdelivr)
const nonMinifiedJsdelivrPath = jsdelivrPath.replace(/\.min\.js$/, '.js')

export default {
  input: path.resolve(__dirname, 'src/index.ts'),
  output: [
    {
      file: importDefaultPath,
      format: 'es',
      exports: 'named',
      sourcemap: 'hidden',
      banner
    },
    {
      file: requireDefaultPath,
      format: 'cjs',
      exports: 'named',
      sourcemap: 'hidden',
      banner,
      outro
    },
    {
      file: nonMinifiedJsdelivrPath,
      format: 'iife',
      exports: 'named',
      sourcemap: false,
      banner,
      outro,
      name
    },
    {
      file: jsdelivrPath,
      format: 'iife',
      exports: 'named',
      sourcemap: 'hidden',
      outro,
      name,
      plugins: [
        rollupPluginTerser({
          format: {
            // Copyright of tslib is not required
            // https://github.com/microsoft/tslib/pull/96
            comments: false,
            preamble: banner
          }
        })
      ]
    }
  ],
  plugins: [
    rollupPluginDelete({
      targets: [
        importDefaultPath,
        `${importDefaultPath}.map`,
        requireDefaultPath,
        `${requireDefaultPath}.map`,
        nonMinifiedJsdelivrPath,
        jsdelivrPath,
        `${jsdelivrPath}.map`
      ]
    }),
    rollupPluginTypescript({
      target: 'es5',
      filterRoot: './src',
      // Exit on error if not watching
      // https://github.com/rollup/plugins/issues/258#issuecomment-848402026
      noEmitOnError: !process.env.ROLLUP_WATCH
    })
  ]
}
