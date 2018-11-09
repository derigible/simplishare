const webpack = require('webpack')
const { resolve } = require('path')
require('dotenv').config()

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProduction = process.env.NODE_ENV === 'production'
const isProductionTest = process.env.PRODUCTIONTEST === '1'
const isTest = process.env.NODE_ENV === 'test'
const doMinify = isProduction && process.env.JS_BUILD_MINIFY !== '0'
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
  performance: {
    // e2e build skips minifying, and errors if stuff is too big.
    // in case the fudge factors are slightly off, we don't want
    // something to sneak onto master only to break the frd prod build.
    // so in that case we just warn.
    hints: doMinify ? 'warning' : 'error',
    maxAssetSize: (doMinify ? 1 : 2) * 100000, // TODO: dial down these max numbers asap!
    maxEntrypointSize: (doMinify ? 1 : 3) * 80000
  },
  entry: {
    bundle: './index.js'
  },
  output: {
    chunkFilename: '[name].[chunkhash].js',
    filename: '[name].[chunkhash].js',
    path: build,
    publicPath: 'https://static.pinkairship.com/'
  },
  resolve: {
    alias: {
      '@instructure/ui-icons$': 'invalid',
      '@instructure/ui-core$': 'invalid'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: src,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              cacheDirectory: !isProduction
            }
          }
        ]
      },
      ...require('@instructure/ui-presets/webpack/module/rules')
    ]
  },
  plugins: [
    ...require('@instructure/ui-presets/webpack/plugins')(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': ENV
    }),
    new HtmlWebpackPlugin({
      chunksSortMode: 'dependency',
      filename: 'index.html',
      inject: true,
      template: 'index.html',
      minify: doMinify ? {
        collapseWhitespace: true,
        minifyCSS: true,
        removeAttributeQuotes: true,
        removeOptionalTags: true,
        removeScriptTypeAttributes: true
      } : {}
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
    bail: true,
    devtool: false, // webpack build uses too much memory with source maps
    entry: Object.assign(exports.entry, {
      vendor: 'babel-polyfill middle-router react react-activestorage-provider react-redux redux redux-logger'.split(' '),
      commons: [
        'ui-alerts', 'ui-a11y', 'ui-billboard', 'ui-buttons',
        'ui-layout', 'ui-overlays','ui-toggle-details'
      ].map(pkg => `@instructure/${pkg}/lib/components`)
       .concat([
         'FormFieldGroup', 'FormField', 'Select', 'TextArea', 'TextInput', 'RadioInput', 'RadioInputGroup', 'FileDrop',
         'Checkbox'
        ].map(pkg => `@instructure/ui-forms/lib/components/${pkg}`))
       .concat(['@instructure/ui-themeable/lib'])
       .concat([
         'Text', 'Heading', 'Link', 'Pill', 'Table', 'Spinner'
       ].map(pkg => `@instructure/ui-elements/lib/components/${pkg}`))
       .concat([
         'View', 'Flex', 'Grid'
       ].map(pkg => `@instructure/ui-layout/lib/components/${pkg}`))
    }),
    plugins: [
      ...exports.plugins,
      doMinify && new webpack.optimize.UglifyJsPlugin({
        comments: /sourceMappingUrl/,
        compress: {
          screw_ie8: true,
          unsafe: true,
          warnings: false
        },
        mangle: {
          screw_ie8: true
        },
        sourceMap: true
      }),
      new webpack.optimize.CommonsChunkPlugin({
        minChunks: 2,
        name: ['vendor', 'commons', 'manifest']
      }),
      new HtmlWebpackPlugin({
        chunks: ['bundle', 'vendor', 'commons', 'manifest'],
        chunksSortMode: 'dependency',
        filename: 'index.html',
        inject: true,
        template: 'index.html',
        minify: doMinify ? {
          collapseWhitespace: true,
          minifyCSS: true,
          removeAttributeQuotes: true,
          removeOptionalTags: true,
          removeScriptTypeAttributes: true
        } : {}
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer',
        inline: 'manifest'
      }),
      doMinify && new CompressionPlugin({
        threshold: 1024
      })
    ].filter((p) => p)
  })
} else {
  // development, test, etc
  Object.assign(exports, {
    cache: true,
    devtool: isTest ? false : 'cheap-eval-source-map', // report issues with OOM w/ cheap-source-map
    devServer: {
      clientLogLevel: 'warning',
      compress: true,
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
      pathinfo: true,
      publicPath: webpackDevServerUrl
    }),
    plugins: [
      ...exports.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        chunks: ['bundle'],
        filename: 'index.html',
        inject: true,
        template: 'index.html'
      })
    ]
  })
}
