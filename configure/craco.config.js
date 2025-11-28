const { CracoConfig } = require('@craco/craco')

module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.plugins.push(new NodePolyfillPlugin())
          return webpackConfig
        }
      }
    }
  ]
}