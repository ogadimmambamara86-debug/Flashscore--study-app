// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'app',
    script: 'dist/server.js',
    env: {
      MONGODB_URI: 'your_mongodb_connection_string',
      NODE_ENV: 'production'
    }
  }]
};