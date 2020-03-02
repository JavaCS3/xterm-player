const path = require('path')

module.exports = {
  basedir: (...args) => path.resolve(__dirname, ...args)
}
