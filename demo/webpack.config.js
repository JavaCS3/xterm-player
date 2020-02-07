const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const TSLintPlugin = require('tslint-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, './index.ts'),
  mode: 'development',
  watch: true,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
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
        test: /\.(cast)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'demo',
      template: path.join(__dirname, 'index.html')
    })
    // new TSLintPlugin({
    //   files: ['./src/**/*.ts'],
    //   config: path.resolve(__dirname, './tslint.json')
    // })
  ]
}
