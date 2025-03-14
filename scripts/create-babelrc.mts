/**
 * Create .babelrc.json
 * Babel does not affect artifacts
 * It is used to generate code to know required polyfills for ES5 artifacts
 */
import fs from 'node:fs/promises'

await fs.mkdir('.polyfillcheck', { recursive: true })
await fs.writeFile(
  '.polyfillcheck/.babelrc.json',
  `${JSON.stringify(
    {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { ie: '11' },
            useBuiltIns: 'usage',
            corejs: '3.41.0',
            debug: true
          }
        ]
      ],
      generatorOpts: {
        auxiliaryCommentBefore: `*
 * https://github.com/zloirock/core-js/tree/master/packages/core-js/modules
 `
      }
    },
    undefined,
    2
  )}\n`
)
