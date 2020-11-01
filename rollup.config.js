import rollupPluginTypescript from '@rollup/plugin-typescript'
import rollupPluginDelete from 'rollup-plugin-delete'
import rollupPluginJson from '@rollup/plugin-json'
import { terser as rollupPluginTerser } from 'rollup-plugin-terser'
import { eslint as rollupPluginEslint } from 'rollup-plugin-eslint'
import globby from 'globby'
import * as packageJson from './package.json'

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
        sourcemap: true
      },
      {
        file: packageJson.browser.replace('.min', ''),
        format: 'iife',
        exports: 'named',
        sourcemap: true,
        name: 'ViewportExtra'
      },
      {
        file: packageJson.browser,
        format: 'iife',
        exports: 'named',
        sourcemap: false,
        name: 'ViewportExtra',
        plugins: [rollupPluginTerser()]
      }
    ],
    plugins: [
      rollupPluginDelete({
        targets: [
          `${packageJson.module}/..`,
          `${packageJson.main}/..`,
          `${packageJson.browser}/..`
        ]
      }),
      rollupPluginEslint(), // eslint-disable-line @typescript-eslint/no-unsafe-call
      rollupPluginTypescript(),
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
      rollupPluginEslint(), // eslint-disable-line @typescript-eslint/no-unsafe-call
      rollupPluginTypescript(),
      rollupPluginJson()
    ]
  }
]
