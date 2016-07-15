//var mongoose    =   require("mongoose");
//mongoose.connect('mongodb://localhost:27017/jdiDb');
var config = require('../configs/env');

// create instance of Schema

var mongoose = config.db;

var Schema =   mongoose.Schema;

// create schema
var noteSchema  = new Schema({
"link" : String,
"detail" : String,
"email" : String
},{timestamps:true});

// create model if not exists.
module.exports = mongoose.model('note',noteSchema);