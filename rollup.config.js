import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import { eslint } from 'rollup-plugin-eslint'
import globby from 'globby'
import { module, main, browser, jest } from './package.json'

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
        plugins: [terser()]
      }
    ],
    plugins: [
      del({ targets: [`${module}/..`, `${main}/..`, `${browser}/..`] }),
      eslint(), // eslint-disable-line @typescript-eslint/no-unsafe-call
      typescript(),
      json()
    ]
  },
  {
    input: globby.sync('src/**/*.test.ts'),
    output: jest.roots.map(root => ({
      dir: root,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    })),
    plugins: [
      del({ targets: jest.roots }),
      eslint(), // eslint-disable-line @typescript-eslint/no-unsafe-call
      typescript(),
      json()
    ]
  }
]
