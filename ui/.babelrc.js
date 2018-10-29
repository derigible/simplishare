/* Necessary to import into .bablerc because ui-presets uses v6 of Babel. once on v7 and using babel-loader v8 then can remove */
module.exports = {
  presets: [[ require('@instructure/ui-presets/babel'), {
    themeable: true,
    coverage: Boolean(process.env.COVERAGE)
  }]],
  plugins: [
    ["transform-runtime", {"polyfill": false}],
    'recharts'
  ],
  env: {
    production: {
      plugins: ['transform-react-remove-prop-types']
    }
  }
}
