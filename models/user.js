var config = require('..//configs/env');
//var mongoose = require('mongoose'),
var mongoose = config.db;
var Schema = mongoose.Schema;
//mongoose.createConnection('mongodb://localhost:27017/jdiDb');

var UserSchema = new Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    accessToken: String,
});

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne(
        {username: possibleUsername},
        function(err, user) {
            if (!err) {
                if (!user) {
                    callback(possibleUsername);
                }
                else {
                    return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
                }
            }
            else {
                callback(null);
            }
        }
    );
};

// create model if not exists.
module.exports = mongoose.model('user', UserSchema);
