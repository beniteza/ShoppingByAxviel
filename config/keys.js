if (process.env.NODE_ENV == 'production') {
  //we're on the production app and db
  module.exports = require('./keys_prod');
} else {
  //we're in the dev app and db
  module.exports = require('./keys_dev');
}
