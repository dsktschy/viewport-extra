import rollupPluginTypescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import { module, main, browser } from './package.json'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: module,
        format: 'es',
        sourcemap: true
      },
      {
        file: main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: browser.replace('.min', ''),
        format: 'iife',
        sourcemap: true
      },
      {
        file: browser,
        format: 'iife',
        sourcemap: false,
        plugins: [
          terser()
        ]
      }
    ],
    plugins: [
      rollupPluginTypescript()
    ]
  }
]
