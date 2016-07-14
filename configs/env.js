//module.exports = require('./env/' + process.env.NODE_ENV + '.js');
var port = 3000;

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/jdiDb');
module.exports = {
    port: port,
    db: mongoose,
    facebook: {
        clientID: '262437214133860',
        clientSecret: 'fa52705176ddb392e23a19ba161db543',
        callbackURL: 'http://localhost:'+ port +'/oauth/facebook/callback'
    },
	google: {
		clientID:'547649472772-752ugta7ca5mtsqqpelq1eflud5jver6.apps.googleusercontent.com',
		clientSecret:'UUxqiJrkYHkT0I1VTJ_l6hOt',
        callbackURL: 'http://localhost:'+ port +'/oauth/google/callback'
    }
};