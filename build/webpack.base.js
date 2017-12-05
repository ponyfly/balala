const CleanWebpackPlugin = require('clean-webpack-plugin')
const {resolve} = require('path')
module.exports = {
  //entry中的app和add对应于output的name
  entry: {
    app: './app/js/main.js',
  },
  resolve:{
    extensions: ['.js']  //引用模块时哪些后缀名可以省略
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options:{
            cacheDirectory: resolve(__dirname, '..', 'tmp')
          }
        },
        include: resolve(__dirname, '..', 'app'),
        exclude: '/node_modules/'
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'static/imgs/[name].[hash:8].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    //打包前清理dist文件夹
    new CleanWebpackPlugin(['dist'], {
      root: resolve(__dirname, '..')
    })
  ]
}