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
//*/
var app         =   express();
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
	
//use this code before any route definitions
app.use(passport.initialize());
app.use(passport.session());

var config = require('./configs/env')
var flash = require('express-flash');
var handlebars = require('express-handlebars')
var bodyParser  =   require("body-parser");
var router      =   express.Router();
require('./configs/strategies/facebook.js')();
require('./configs/strategies/google.js')();
var sessionStore = new session.MemoryStore;

// View Engines
app.set('view engine', 'jade');

app.use(cookieParser('secret'));

app.use(flash());

app.use(function(req, res, next){
	res.locals.user = req.user || null;
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


function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

//facebook
router.get('/oauth/facebook', passport.authenticate('facebook', {
    failureRedirect: '/login',
    scope:['email']
}));

router.get('/oauth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login',
    successRedirect: '/',
    scope:['email']
}));

// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/oauth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
app.get('/oauth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/login',
                failureRedirect : '/'
        }));
//*/
router.get("/",function(req,res){
    //res.json({"error" : false,"message" : "Hello World"});
	res.redirect('/login');
});

router.get("/login",function(req,res){
	//res.send('Welcome to jdi - Online text pasting system using Node.js');
	//res.sendFile(__dirname + '/views'+'/login.html');
	//console.log(req.user);
	console.log(req.user);
	console.log(res.locals.user);
	if(typeof(req.flash()) !== 'undefined')
		res.render('login', { message: req.flash()});
	else res.render('login', { message: ''});
});

router.get("/logout",function(req,res){
	req.logout();
    req.session.destroy();
	//req.flash('success_messages', 'message: logged out successfully');
    res.redirect('/login');
	//res.render('login', { message: 'logged out successfully'});
});
router.route("/add")
	.get(function(req,res){
		if(!req.user){
			req.flash('error_messages', 'message: please login to add a note');
			res.redirect('/login');
		}
		else
			res.render('add', { message: req.flash() } );
	})
	.post(function(req,res){
		//TODO: add data and show the status to the user
		var tempNote = req.body;
		tempNote.email = req.user.email;
		var notUnique = true;
		//while(notUnique)
		//{
				if(tempNote.link.length<7) 
					tempNote.link = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
				console.log(tempNote.link);
			var newNote = new Note({
				link : tempNote.link,
				detail : tempNote.detail,
				email : tempNote.email
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
								//res.send('note saved!');
								notUnique=false;
								res.redirect('/'+tempNote.link);
							} else {
								throw error;
								console.log(err.message);
								return next(err);
							}
						});
						
					}
					else{
						//res.send('note already existed!');
						req.flash('error_messages', "message: Woops, looks like the random link name doesn't work, please submit again");
						//continue;
						//res.redirect('/add');
						res.render('add', { message: req.flash(), detail: tempNote.detail } );
					}
					
					
				}
				
			});
		//}
		
		
		//res.send(noteOp.note.insert(req));
	});

router.route("/edit/:link").get(function(req,res){
	//res.send('Welcome to jdi - Online text pasting system using Node.js');
	Note.findOne(
            {
                "$or": [
                    { link: req.params.link }
                ]
            }, function(error, obj) {
				if(obj)
				{
					console.log(obj);
					if(req.user && obj.email == req.user.email)
						res.render('edit', { message: req.flash(), note: obj } );
					else
					{
						req.flash('error_messages', "message: Woops, looks like you can't edit that note.");
						res.redirect('/login');
					}
					//res.send(obj);
					//console.log(obj);
				}
				else
				{
					req.flash('error_messages', 'message: Woops, looks like that note doesn\'t exist.');
					res.redirect('/login');
					//res.send("note not found");
				}
                
            }
        );
	
	})
	.post(function(req,res){
			if(req.user)
			{
				var linkToChangeInto = req.body.link;
				var linkToBeChanged = req.param.link;
				console.log('linkToChangeInto.length = ');
				console.log(linkToChangeInto.length);
				console.log(linkToChangeInto.length<7);
				if(linkToChangeInto.length<7)
				{
					req.flash('error_messages', "message: link need to have more than 6 characters, so note wasn't updated");
					res.render('edit',{note:{detail:req.body.detail,link:req.body.link},message:"message: link need to have more than 6 characters, so note wasn't updated"});
					//res.redirect('/edit/'+linkToBeChanged);
				}
				else
				{
					
					var conditions = { "$or":[{link: linkToBeChanged}, {email: req.user.email}] };
					var update = { "$set": { link: linkToChangeInto, detail: req.body.detail}};
					var options = { upsert: false};
					
					/*
					Note.update(conditions, update, options, function (err, data) {// callback
						console.log(data);
						if (err) 
						{
							req.flash('error_messages', "message: error occurred, so note wasn't updated");
							res.render('edit',{note:{detail:req.body.detail,link:req.body.link}});
							//return console.error(err);
							//res.redirect('/edit/'+linkToBeChanged);
						}
						else
						{	
							req.flash('success_messages', 'message: Your note was updated');
							//res.render('edit',{note:{detail:req.body.detail,link:req.body.link}});
							res.redirect('/'+linkToChangeInto);
						}
					});
					//*/
					console.log('conditions:');
					console.log(conditions);
					console.log('update:');
					console.log(update);
					Note.findOneAndUpdate(conditions, update, { new: true }, function(err, doc) {
						if (err) 
						{
							console.log("message: error occurred, so note wasn't updated");
							console.log(err);
							req.flash('error_messages', "message: error occurred, so note wasn't updated");
							res.render('edit',{note:{detail:req.body.detail,link:req.body.link}});
							//return console.error(err);
							//res.redirect('/edit/'+linkToBeChanged);
						}
						else
						{	
							req.flash('success_messages', 'message: Your note was updated');
							res.render('edit',{note:{detail:req.body.detail,link:req.body.link}});
							//res.redirect('/login');
						}
					});
				}
				
				//res.render('link', { message: req.flash(), note:obj } );
			}
			else{
				console.log("'message: please login before edit a note");
				req.flash('error_messages', 'message: please login before edit a note');
				res.redirect('/login');
				//res.render('edit',{note:{detail:req.body.detail,link:req.body.link}});
			}			
			
			
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
					//res.send(obj);
					res.render('show', { message: req.flash(), note: obj } );
					console.log(obj);
				}
				else
				{
					req.flash('error_messages', 'message: Woops, looks like that note doesn\'t exist.');
					res.redirect('/login');
					//res.send("note not found");
				}
                
            }
        );
		
    });



app.listen(config.port);
console.log("Listening to PORT "+config.port);
