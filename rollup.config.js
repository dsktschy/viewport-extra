import rollupPluginTypescript from '@rollup/plugin-typescript'
import rollupPluginDelete from 'rollup-plugin-delete'
import rollupPluginJson from '@rollup/plugin-json'
import { terser as rollupPluginTerser } from 'rollup-plugin-terser'
import globby from 'globby'
import * as packageJson from './package.json'

const outro =
  // To export class constructor without default key
  // https://github.com/rollup/rollup/issues/1961#issuecomment-534977678
  'exports = exports.default;\n' +
  // To handle with types in test
  'exports.default = exports;'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.module,
        format: 'es',
        exports: 'named',
        sourcemap: true
      },
      {
        file: packageJson.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
        outro
      }
    ],
    plugins: [
      rollupPluginDelete({
        targets: [`${packageJson.module}/..`, `${packageJson.main}/..`]
      }),
      rollupPluginTypescript({ target: 'esnext' }),
      rollupPluginJson()
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.browser.replace('.min', ''),
        format: 'iife',
        exports: 'named',
        sourcemap: true,
        name: 'ViewportExtra',
        outro
      },
      {
        file: packageJson.browser,
        format: 'iife',
        exports: 'named',
        sourcemap: false,
        name: 'ViewportExtra',
        outro,
        plugins: [
          rollupPluginTerser({
            format: {
              // Copyright of tslib is not required
              // https://github.com/microsoft/tslib/pull/96
              comments: false
            }
          })
        ]
      }
    ],
    plugins: [
      rollupPluginDelete({ targets: `${packageJson.browser}/..` }),
      rollupPluginTypescript({ target: 'es5' }),
      rollupPluginJson()
    ]
  },
  {
    input: globby.sync('src/**/*.test.ts'),
    output: packageJson.jest.roots.map(root => ({
      dir: root,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    })),
    plugins: [
      rollupPluginDelete({ targets: packageJson.jest.roots }),
      rollupPluginTypescript({ target: 'esnext' }),
      rollupPluginJson()
    ]
  }
]
