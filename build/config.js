const isDevEnv = process.env.NODE_ENV != 'production'
const isProdEnv = process.env.NODE_ENV == 'production'

module.exports = {
  isDevEnv,
  isProdEnv,
  mode: isProdEnv ? 'production' : 'development'
}
