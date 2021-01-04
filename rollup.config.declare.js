import rollupPluginDts from 'rollup-plugin-dts'
import rollupPluginDelete from 'rollup-plugin-delete'
import * as packageJson from './package.json'

export default {
  input: '.types/index.d.ts',
  output: [
    {
      file: packageJson.types,
      format: 'es',
      exports: 'named'
    }
  ],
  plugins: [
    rollupPluginDelete({ targets: `${packageJson.types}/..` }),
    rollupPluginDts()
  ]
}
