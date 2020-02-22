const webpack = require('webpack')
const path = require('path')

const isDevEnv = process.env.NODE_ENV != 'production'
const isProdEnv = process.env.NODE_ENV == 'production'

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TSLintPlugin = require('tslint-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const config = {
  mode: 'production',
  devtool: 'source-maps',
  entry: {
    'xterm-player': path.resolve(__dirname, './src/Player.ts'),
    'xterm-player.min': path.resolve(__dirname, './src/Player.ts')
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    library: 'webpackNumbers',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true
  },
  optimization: {
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
          map: {
            inline: false,
            annotation: true
          }
        }
      })
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
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
    new webpack.NoEmitOnErrorsPlugin(),
    new TSLintPlugin({
      files: ['./src/**/*.ts'],
      config: path.resolve(__dirname, './tslint.json')
    })
  ],
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
  }
}

// Apply the configurations for the development environment
if (isDevEnv) {
  // Configurations
  config.mode = 'development'
  config.devtool = 'eval'

  // Remove .min files
  delete config.entry['xterm-player.min']
}

module.exports = config
