var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();
var Note     =   require("./models/note");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
app.use(express.static(__dirname + '/views'));
//Store all HTML files in views folder.
app.use(express.static(__dirname + '/assets'));
//Store all JS and CSS in Scripts folder.

router.get("/",function(request,response){
    //res.json({"error" : false,"message" : "Hello World"});
	response.redirect('/login');
});

router.get("/login",function(request,response){
	//response.send('Welcome to jdi - Online text pasting system using Node.js');
	response.sendFile(__dirname + '/views'+'/login.html');
});

router.route("/edit")
	.get(function(request,response){
		response.sendFile(__dirname + '/views'+'/edit.html');
	})
	.post(function(request,response){
		//TODO: add data and show the status to the user
		
		var tempNote = request.body;
		
		var newNote = new Note({
			link : tempNote.link,
			detail : tempNote.detail,
			userEmail : tempNote.userEmail
		});
		
		// Setup stuff
		var query = { link: tempNote.link },
			update = { expire: new Date() },
			options = { upsert: false };

		// Find the document
		Note.findOneAndUpdate(query, update, options, function(error, result) {
			if (!error) {
				// If the document doesn't exist
				if (!result) {
					// Create it
					//newNote = new Note();
					// Save the document
					newNote.save(function(error) {
						if (!error) {
							// Do something with the document
							response.send('note saved!');
						} else {
							throw error;
							console.log(err.message);
							return next(err);
						}
					});
					
				}
				else{
					response.send('note already existed!');
				}
				
				
			}
			
		});
		
		
		//response.send(noteOp.note.insert(request));
	});

router.get("/link",function(request,response){
	//response.send('Welcome to jdi - Online text pasting system using Node.js');
	response.sendFile(__dirname + '/views'+'/link.html');
});


app.use('/',router);

app.listen(3000);
console.log("Listening to PORT 3000");
