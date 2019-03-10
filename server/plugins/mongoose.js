const mongoose = require('mongoose');
const plugin = require('fastify-plugin');

const connectionString = process.env.ENVIRONMENT === 'LOCAL'
  ? process.env.MONGODB_LOCAL_CONNECTION_STRING
  : process.env.MONGODB_CONNECTION_STRING;

module.exports = plugin(async (server, options, next) => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
    });
    server.decorate('mongo', {
      db: mongoose.connection,
      ObjectId: mongoose.Types.ObjectId,
    });
    server.addHook('onClose', (fastify, done) => {
      fastify.mongo.db.close(done);
    });
    next();
  } catch(error) {
    next(error);
  }
});
