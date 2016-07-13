var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');
var handlebars = require('express-handlebars')
var express     =   require("express");
var bodyParser  =   require("body-parser");
var router      =   express.Router();
var Note     =   require("./models/note");

var app         =   express();

var sessionStore = new session.MemoryStore;

// View Engines
app.set('view engine', 'jade');

app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
app.use(express.static(__dirname + '/views'));
//Store all HTML files in views folder.
app.use(express.static(__dirname + '/assets'));
//Store all JS and CSS in Scripts folder.

router.get("/",function(req,res){
    //res.json({"error" : false,"message" : "Hello World"});
	res.redirect('/login');
});

router.get("/login",function(req,res){
	//res.send('Welcome to jdi - Online text pasting system using Node.js');
	//res.sendFile(__dirname + '/views'+'/login.html');
	res.render('login', { message: req.flash() });
});

router.route("/edit")
	.get(function(req,res){
		res.render('edit', { message: req.flash() } );
	})
	.post(function(req,res){
		//TODO: add data and show the status to the user
		
		var tempNote = req.body;
		
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
							res.send('note saved!');
						} else {
							throw error;
							console.log(err.message);
							return next(err);
						}
					});
					
				}
				else{
					res.send('note already existed!');
				}
				
				
			}
			
		});
		
		
		//res.send(noteOp.note.insert(req));
	});

router.get("/link",function(req,res){
	//res.send('Welcome to jdi - Online text pasting system using Node.js');
	res.render('link', { message: req.flash() } );
});

app.use('/',router);

app.get('/:link', function(req, res) {
        Note.findOne(
            {
                "$or": [
                    { link: req.params.link }
                ]
            }, function(error, obj) {
				if(obj)
				{
					res.send(obj);
					console.log(obj);
				}
				else
				{
					req.flash('error', 'Woops, looks like that note doesn\'t exist.');
					res.redirect('/');
					//res.send("note not found");
				}
                
            }
        );
		
    });



app.listen(3000);
console.log("Listening to PORT 3000");
