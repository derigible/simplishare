const webpack = require('webpack')
const { resolve } = require('path')
require('dotenv').config()

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProduction = process.env.NODE_ENV === 'production'
const isProductionTest = process.env.PRODUCTIONTEST === '1'
const isTest = process.env.NODE_ENV === 'test'
const doMinify = isProduction
const analyze = process.env.ANALYZE_BUNDLE === '1'

const src = resolve(__dirname, 'src')
const build = resolve(__dirname, '__build__')

const webpackDevServerUrl = process.env.SERVER_URL || 'http://localhost:8080/'

const ENV = isProduction && !isProductionTest
? {
  'API_HOST': JSON.stringify('pinkairship.com'),
  'API_PROTOCOL': JSON.stringify('https'),
  'NODE_ENV': JSON.stringify('production')
}
: [
  'API_HOST',
  'API_PROTOCOL',
  'NODE_ENV'
].reduce((env, name) => {
  // eslint-disable-next-line no-param-reassign, immutable/no-mutation
  env[name] = JSON.stringify(process.env[name])
  return env
}, {})

Object.assign(exports, {
  context: src,
  entry: './index.js',
  output: {
    chunkFilename: '[name].[chunkhash].js',
    filename: '[name].[chunkhash].js',
    path: build,
    publicPath: 'https://static.pinkairship.com/'
  },
  module: {
    rules: require('@instructure/ui-presets/webpack/module/rules')
  },
  plugins: [
    ...require('@instructure/ui-presets/webpack/plugins')(),
    new webpack.DefinePlugin({
      'process.env': ENV
    }),
    new HtmlWebpackPlugin({
      chunksSortMode: 'dependency',
      filename: 'index.html',
      inject: true,
      template: 'index.html'
    }),
    analyze && new BundleAnalyzerPlugin()
  ].filter((p) => p),
  resolveLoader: {
    modules: [
      ...require('@instructure/ui-presets/webpack/resolveLoader').modules,
      resolve(__dirname, 'node_modules', '@instructure', 'ui-presets', 'node_modules')
    ]
  }
})

if (isProduction) {
  Object.assign(exports, {
    mode: 'production',
    plugins: [
      ...exports.plugins,
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer',
        inline: 'manifest'
      })
    ].filter((p) => p)
  })
} else {
  // development, test, etc
  Object.assign(exports, {
    mode: 'development',
    devServer: {
      clientLogLevel: 'warning',
      contentBase: './src/',
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
    },
    output: Object.assign(exports.output, {
      chunkFilename: '[name].js',
      filename: '[name].js',
      publicPath: webpackDevServerUrl
    }),
    plugins: [
      ...exports.plugins,
      new webpack.HotModuleReplacementPlugin()
    ]
  })
}
