var mongoose    =   require("mongoose");
mongoose.createConnection('mongodb://localhost:27017/jdiDb');
/*
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function(callback){
	console.log("Connection Succeeded."); /* Once the database connection has succeeded, the code in db.once is executed. */
//});

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