module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/search': {
        target: 'http://localhost:3000',
      },
    },
  }
}
