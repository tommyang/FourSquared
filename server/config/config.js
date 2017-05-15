/**
 * Config var for app
**/
module.exports = {
  mongoDBUrl: process.env.MONGODB_URL || process.env.MONGOLAB_URI  || 'mongodb://localhost:27017/webstormtroopers',
  port: 3000,
  secret: process.env.SECRET || 'mysecret'
};
