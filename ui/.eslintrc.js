/* .eslintrc.js */
const defaultEslint = require('@instructure/ui-eslint-config')
module.exports = Object.assign(
  {},
  defaultEslint,
  {
    rules: Object.assign(
      {},
      defaultEslint.rules,
      {
        'notice/notice': [0],
        'no-case-declarations': [0],
        'no-undefined': [0],
        'semi': [0],
        'react/require-default-props': [0]
      }
    )
  }
)
