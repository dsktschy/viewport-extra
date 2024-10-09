import rollupPluginTypescript from '@rollup/plugin-typescript'
import rollupPluginDelete from 'rollup-plugin-delete'
import rollupPluginTerser from '@rollup/plugin-terser'
import packageJson from './package.json'

// Copyright
const banner =
  '/*!\n' +
  ` * Viewport Extra v${packageJson.version}\n` +
  ' * (c) dsktschy\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const outro =
  // To export class constructor without default key
  // https://github.com/rollup/rollup/issues/1961#issuecomment-534977678
  'exports = exports.default;\n' +
  // To handle with types in test
  'exports.default = exports;'

// Global variable name for iife
const name = 'ViewportExtra'

// Exit on error if not watching
// https://github.com/rollup/plugins/issues/258#issuecomment-848402026
const noEmitOnError = !process.env.ROLLUP_WATCH

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.exports['.'].import.default,
        format: 'es',
        exports: 'named',
        sourcemap: 'hidden',
        banner
      },
      {
        file: packageJson.exports['.'].require.default,
        format: 'cjs',
        exports: 'named',
        sourcemap: 'hidden',
        banner,
        outro
      }
    ],
    plugins: [
      rollupPluginDelete({
        targets: [
          `${packageJson.exports['.'].import.default}/..`,
          `${packageJson.exports['.'].require.default}/..`
        ]
      }),
      rollupPluginTypescript({ target: 'es5', noEmitOnError })
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.jsdelivr.replace('.min', ''),
        format: 'iife',
        exports: 'named',
        sourcemap: false,
        banner,
        outro,
        name
      },
      {
        file: packageJson.jsdelivr,
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
      rollupPluginDelete({ targets: `${packageJson.jsdelivr}/..` }),
      rollupPluginTypescript({ target: 'es5', noEmitOnError })
    ]
  }
]
