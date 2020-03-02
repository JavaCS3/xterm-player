const config = require('./config')

module.exports = {
  mode: config.mode,
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}
