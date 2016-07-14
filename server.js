var express     =   require("express");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

var Note     =   require("./models/note");
var User     =   require("./models/user");

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
        User.findOne(
            {_id: id},
            '-password',
            function(err, user) {
                done(err, user);
            }
        );
});


	
//use this code before any route definitions
var app         =   express();
app.use(passport.initialize());
app.use(passport.session());

var config = require('./configs/env')
var flash = require('express-flash');
var handlebars = require('express-handlebars')
var bodyParser  =   require("body-parser");
var router      =   express.Router();
require('./configs/strategies/facebook.js')();
var sessionStore = new session.MemoryStore;

// View Engines
app.set('view engine', 'jade');

app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'ANYTHINGalsjkdflksajdf'
}));
app.use(flash());

app.use(function(req, res, next){
	//res.locals.user = req.user || null;
	res.locals.loggedIn = (req.user) ? true : false;
	
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


router.get('/oauth/facebook', passport.authenticate('facebook', {
    failureRedirect: '/login',
    scope:['email']
}));

router.get('/oauth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login',
    successRedirect: '/',
    scope:['email']
}));

router.get("/",function(req,res){
    //res.json({"error" : false,"message" : "Hello World"});
	res.redirect('/login');
});

router.get("/login",function(req,res){
	//res.send('Welcome to jdi - Online text pasting system using Node.js');
	//res.sendFile(__dirname + '/views'+'/login.html');
	//console.log(req.user);
	res.render('login', { message: req.flash() ,user : req.user});
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



app.listen(config.port);
console.log("Listening to PORT "+config.port);
