const webpack = require('webpack')
const {resolve, join} = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.base')
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebapckPlugin = require('html-webpack-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(common, {
  output: {
    path: resolve(__dirname, '..', 'dist'),
    filename: 'static/js/[name]-[chunkhash:8].js',
    publicPath: 'http://balala.j.cn/sharetest/'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            {
              loader: 'postcss-loader'
            }
          ],
          publicPath: 'http://balala.j.cn/sharetest/',
        })
      }
    ]
  },
  plugins: [
    new UglifyWebpackPlugin({
      sourceMap: true,
      uglifyOptions: {
        compress: true,
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new OptimizeCssPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vender',
      minChunks: function (module) {
        return module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(join(__dirname, '../node_modules')) === 0
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vender']
    }),
    //根据模块的相对路径生成一个hash值作为模块id，一旦模块内容改变，则hash改变
    new webpack.HashedModuleIdsPlugin(),
    new ExtractTextPlugin({
      filename: "static/css/[name].[contenthash:8].css"
    }),
    //根据模板文件生成index.html
    new HtmlWebapckPlugin({
      template: './app/index.html',
      filename: 'index.html',
      inject: true,
      hash:false,
      minify: {
        removeComments: true,
        collapseWhitespace: false
      }
    })
  ]
})