// if (process.env.NODE_ENV == 'production') {
//   //we're on the production app and db
//   module.exports = require('./keys_prod');
// } else {
//   //we're in the dev app and db
//   module.exports = require('./keys_dev');
// }

module.exports = {
  mongoURI: 'mongodb://beniteza:!stop4me@ds119323.mlab.com:19323/shopping-prod'
};
