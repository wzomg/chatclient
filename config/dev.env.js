'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  IMG_URL: '"http://localhost:5555/chat/"',
  SOCKET_URL: '"http://localhost:9999/"'
})
