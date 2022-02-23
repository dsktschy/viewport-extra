/**
 * https://github.com/okonet/lint-staged#eslint--7-1
 */

const { ESLint } = require('eslint')

const removeIgnoredFiles = async files => {
  const eslint = new ESLint()
  const isIgnored = await Promise.all(
    files.map(file => {
      return eslint.isPathIgnored(file)
    })
  )
  const filteredFiles = files.filter((_, i) => !isIgnored[i])
  return filteredFiles.join(' ')
}

module.exports = {
  '!(*.{ts,js})': async files => {
    return [`prettier -w ${files.join(' ')}`]
  },
  '*.{ts,js}': async files => {
    const filesToLint = await removeIgnoredFiles(files)
    return [
      `eslint --max-warnings=0 ${filesToLint}`,
      `prettier -w ${files.join(' ')}`
    ]
  }
}
