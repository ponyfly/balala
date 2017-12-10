const merge = require('webpack-merge')
const common = require('./webpack.base')
const HtmlWebapckPlugin = require('html-webpack-plugin')
const {resolve } = require('path')
const os = require('os')

let localhost  = ''
try {
  const network = os.networkInterfaces()
  if(Object.keys(network)[0] === 'WLAN') {
    localhost = network[Object.keys(network)[0]][0].address
  } else {
    localhost = network[Object.keys(network)[0]][1].address
  }
} catch (e) {
  localhost = 'localhost'
}

module.exports = merge(common, {
  output: {
    path: resolve(__dirname, '..', 'dist'),
    filename: '[name].js'
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
    host: localhost,
    port: 8092,
    open: true
  },
  plugins: [
    new HtmlWebapckPlugin({
      template: './app/index.html',
      filename: 'index.html',
      inject: true
    })
  ]
})