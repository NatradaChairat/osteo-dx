const { VuetifyPlugin } = require('webpack-plugin-vuetify')

module.exports = {
  configureWebpack: {
    plugins: [
      new VuetifyPlugin({
        autoImport: true,
      }),
    ],
  },
}