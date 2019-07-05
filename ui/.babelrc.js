/* Necessary to import into .bablerc because ui-presets uses v6 of Babel. once on v7 and using babel-loader v8 then can remove */
module.exports = {
  presets: [[ require('@instructure/ui-babel-preset'), {
    themeable: true,
    coverage: Boolean(process.env.COVERAGE)
  }], "@babel/preset-flow"],
  plugins: [
    'recharts'
  ],
  env: {
    production: {
      plugins: ['transform-react-remove-prop-types']
    }
  }
}
