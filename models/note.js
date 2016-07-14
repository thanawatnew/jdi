var mongoose    =   require("mongoose");
mongoose.createConnection('mongodb://localhost:27017/jdiDb');

// create instance of Schema
var Schema =   mongoose.Schema;

// create schema
var noteSchema  = new Schema({
"link" : String,
"detail" : String,
"userEmail" : String
},{timestamps:true});

// create model if not exists.
module.exports = mongoose.model('note',noteSchema);