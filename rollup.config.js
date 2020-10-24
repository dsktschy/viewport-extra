import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import { module, main, browser } from './package.json'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: module,
        format: 'es',
        exports: 'named',
        sourcemap: true
      },
      {
        file: main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: browser.replace('.min', ''),
        format: 'iife',
        exports: 'named',
        sourcemap: true,
        name: 'ViewportExtra'
      },
      {
        file: browser,
        format: 'iife',
        exports: 'named',
        sourcemap: false,
        name: 'ViewportExtra',
        plugins: [
          terser()
        ]
      }
    ],
    plugins: [
      typescript(),
      json()
    ]
  }
]
