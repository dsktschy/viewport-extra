import rollupPluginDts from 'rollup-plugin-dts'
import rollupPluginDelete from 'rollup-plugin-delete'
import packageJson from './package.json'

export default {
  input: '.types/index.d.ts',
  output: [
    {
      file: packageJson.exports['.'].import.types,
      format: 'es',
      exports: 'named'
    }
  ],
  plugins: [
    rollupPluginDelete({
      targets: `${packageJson.exports['.'].import.types}/..`
    }),
    rollupPluginDts()
  ]
}
