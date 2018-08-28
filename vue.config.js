module.exports = {
  chainWebpack: config => {
    // CSV loader
    config.module
      .rule('csv')
      .test(/\.csv$/)
      .use('csv-loader')
        .loader('csv-loader')
        .options ({
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true
        })
  }
}