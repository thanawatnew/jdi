var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
app.use(express.static(__dirname + '/view'));
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/asset'));
//Store all JS and CSS in Scripts folder.

router.get("/",function(request,response){
    //res.json({"error" : false,"message" : "Hello World"});
	response.redirect('/login');
});

router.get("/login",function(request,response){
	//response.send('Welcome to jdi - Online text pasting system using Node.js');
	response.sendFile(__dirname + '/view'+'/login.html');
});

router.get("/edit",function(request,response){
	//response.send('Welcome to jdi - Online text pasting system using Node.js');
	response.sendFile(__dirname + '/view'+'/edit.html');
});

router.get("/link",function(request,response){
	//response.send('Welcome to jdi - Online text pasting system using Node.js');
	response.sendFile(__dirname + '/view'+'/link.html');
});


app.use('/',router);

app.listen(3000);
console.log("Listening to PORT 3000");
