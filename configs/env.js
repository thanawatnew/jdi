//module.exports = require('./env/' + process.env.NODE_ENV + '.js');
var port = 3000;

module.exports = {
    port: port,
    //db: 'mongodb://localhost/todos',
    facebook: {
        clientID: 'App ID',
        clientSecret: 'App Secret',
        callbackURL: 'http://localhost:'+ port +'/oauth/facebook/callback'
    }
};