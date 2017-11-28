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
    host: '192.168.2.198',
    port: 8094,
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
    }),
    new HtmlWebapckPlugin({
      template: './app/recommend.html',
      filename: 'recommend.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false
      }
    })
  ]
})