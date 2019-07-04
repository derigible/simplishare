const baseConfig = require('@instructure/ui-webpack-config')
module.exports = {
  ...baseConfig,
  plugins: [ ...baseConfig.plugins ],
  module: {
    // note: put your rules first
    rules: [...baseConfig.module.rules ]
  },
  resolveLoader: {
    alias: { ...baseConfig.resolveLoader.alias }
  }
}
