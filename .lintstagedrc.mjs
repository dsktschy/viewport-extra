import path from 'node:path'

/** @type {import('lint-staged').Config} */
export default {
  '(*.js|*.mjs|*.cjs|*.ts|*.mts|*.cts)': absolutePathList => {
    const relativePaths = absolutePathList
      .map(absolutePath => path.relative(process.cwd(), absolutePath))
      .filter(relativePath => !relativePath.startsWith('examples/'))
      .join(' ')
    if (!relativePaths) return []
    return [
      `cspell lint --no-must-find-files ${relativePaths}`,
      `prettier --write ${relativePaths}`,
      // Disable ignoring filenames that starts with dot
      // https://stackoverflow.com/a/71829427
      `eslint --fix --ignore-pattern "!.*" --max-warnings 0 ${relativePaths}`
    ]
  },
  '!(*.js|*.mjs|*.cjs|*.ts|*.mts|*.cts)': absolutePathList => {
    const relativePaths = absolutePathList
      .map(absolutePath => path.relative(process.cwd(), absolutePath))
      .filter(relativePath => !relativePath.startsWith('examples/'))
      .filter(
        relativePath =>
          !['.release-please-manifest.json', 'CHANGELOG.md'].includes(
            relativePath
          )
      )
      .join(' ')
    if (!relativePaths) return []
    return [
      `cspell lint --no-must-find-files ${relativePaths}`,
      `prettier --write --ignore-unknown ${relativePaths}`
    ]
  }
}
