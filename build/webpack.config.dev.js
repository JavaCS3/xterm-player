const { basedir } = require('./utils')
const configBase = require('./webpack.config.base')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = Object.assign(configBase, {
  devtool: 'inline-source-map',

  devServer: {
    contentBase: basedir('../assets')
  },

  entry: basedir('../demo/index.ts'),

  output: {
    filename: 'bundle.js',
    path: basedir('../demo/dist')
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(cast|mp3)$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new HtmlWebpackPlugin({
      title: 'demo',
      template: basedir('../demo/index.html')
    })
  ]
})
