const config = require('./config')
const { basedir } = require('./utils')
const configBase = require('./webpack.config.base')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = Object.assign(configBase, {
  devtool: config.isProdEnv ? 'source-map' : 'eval',

  entry: {
    'index.min': basedir('../demo/index.ts')
  },

  output: {
    filename: 'bundle.min.js',
    path: basedir('../docs')
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' }
          // {
          //   loader: 'postcss-loader',
          //   options: { plugins: [require('autoprefixer')] }
          // }
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.(cast|mp3)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'assets/'
        }
      }
    ]
  },

  externals: {
    xterm: '{ Terminal: Terminal }'
  },

  optimization: {
    noEmitOnErrors: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        include: /\.min\.js$/
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.min\.css$/,
        cssProcessorOptions: {
          map: { inline: false, annotation: true }
        }
      })
    ]
  },

  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
    new HtmlWebpackPlugin({
      title: 'demo',
      template: basedir('../demo/index.html'),
      minify: {
        collapseWhitespace: true
      }
    })
    // new BundleAnalyzerPlugin()
  ]
})
