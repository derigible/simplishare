const webpack = require('webpack')
const baseConfig = require('@instructure/ui-webpack-config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

require('dotenv').config()

const ENV = [
  'API_HOST',
  'API_PROTOCOL',
  'NODE_ENV'
].reduce((env, name) => {
  // eslint-disable-next-line no-param-reassign, immutable/no-mutation
  env[name] = JSON.stringify(process.env[name])
  return env
}, {})

const webpackDevServerUrl = process.env.SERVER_URL || 'http://localhost:8080/'

const buildPlugins = [
  new webpack.DefinePlugin({
      'process.env': ENV
  }),
  new HtmlWebpackPlugin({
    chunksSortMode: 'dependency',
    filename: 'index.html',
    inject: true,
    template: 'new_src/index.html'
  }),
  new webpack.HotModuleReplacementPlugin()
]

const buildConfig = {
  mode: 'development',
  devServer: {
    clientLogLevel: 'warning',
    contentBase: './new_src/',
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    inline: true,
    noInfo: false,
    publicPath: webpackDevServerUrl,
    stats: {
      assets: true,
      cached: true,
      cachedAssets: false,
      children: false,
      chunkModules: false,
      chunkOrigins: false,
      chunks: false,
      colors: true,
      errorDetails: true,
      errors: true,
      hash: true,
      modules: false,
      publicPath: true,
      reasons: false,
      source: false,
      timings: true,
      version: false,
      warnings: false
    }
  }
}
const buildOutput = {
  chunkFilename: '[name].js',
  filename: '[name].js',
  publicPath: webpackDevServerUrl
}

module.exports = {
  ...baseConfig,
  ...buildConfig,
  output: {
    ...baseConfig.output,
    ...buildOutput
  },
  plugins: [ ...baseConfig.plugins, ...buildPlugins ],
  module: {
    // note: put your rules first
    rules: [...baseConfig.module.rules ]
  },
  resolveLoader: {
    alias: { ...baseConfig.resolveLoader.alias }
  }
}
