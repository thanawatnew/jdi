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
		newNote.save(function(err) {
			if (err) throw err;
			//console.log('words saved!');
			response.send('note saved!');
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
