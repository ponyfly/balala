const merge = require('webpack-merge')
const common = require('./webpack.base')
const HtmlWebapckPlugin = require('html-webpack-plugin')
const {resolve } = require('path')

module.exports = merge(common, {
  output: {
    path: resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: '../dist',
    host: '192.168.199.167',
    port: 8092,
    open: true
  },
  plugins: [
    new HtmlWebapckPlugin({
      template: './app/index.html',
      filename: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false
      }
    })
  ]
})