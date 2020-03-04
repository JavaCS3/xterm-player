const config = require('./config')
const { basedir } = require('./utils')
const configBase = require('./webpack.config.base')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TSLintPlugin = require('tslint-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = Object.assign(configBase, {
  devtool: config.isProdEnv ? 'source-map' : 'eval',

  entry: {
    'xterm-player': [
      basedir('../src/Player.ts'),
      basedir('../src/ui/ui.css')
    ],
    'xterm-player.min': [
      basedir('../src/Player.ts'),
      basedir('../src/ui/ui.css')
    ]
  },

  output: {
    path: basedir('../dist'),
    filename: 'js/[name].js',
    library: 'XtermPlayer',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
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
      }
    ]
  },

  externals: {
    xterm: {
      commonjs: ['xterm', 'Terminal'],
      commonjs2: ['xterm', 'Terminal'],
      amd: ['xterm', 'Terminal'],
      root: 'Terminal'
    }
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
    new TSLintPlugin({
      files: [basedir('../src/**/*.ts')],
      config: basedir('../tslint.json')
    })
  ]
})
