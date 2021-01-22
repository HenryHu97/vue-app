module.exports = {
  publicPath: './',
  outputDir: 'dist',
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html"
    }
  },
  // lintOnSave: process.env.NODE_ENV !== 'production'
  lintOnSave: false,
  devServer: {
    open: true,
    openPage: "index.html",
    port: 9000,
    proxy: {
      '/apis' : {
        target: "http://www.shuiyue.info:12300",
        pathRewrite: {'/apis' : ""}
      }
    }
  }
}

