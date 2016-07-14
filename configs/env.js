//module.exports = require('./env/' + process.env.NODE_ENV + '.js');
var port = 3000;

module.exports = {
    port: port,
    //db: 'mongodb://localhost/todos',
    facebook: {
        clientID: '262437214133860',
        clientSecret: 'fa52705176ddb392e23a19ba161db543',
        callbackURL: 'http://localhost:'+ port +'/oauth/facebook/callback'
    }
};