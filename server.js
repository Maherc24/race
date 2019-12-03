

var express = require('express');
var app = express();
//const bcrypt = require('bcrypt');
var bcrypt = require('bcrypt-nodejs'); 
const mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var localStorage = require('node-localstorage')
var cookieParser = require('cookie-parser'); 
var flash = require('connect-flash');
//images = [{image:"https://www.suspensiondesigner.com/wp-content/uploads/2018/12/background_cropped.jpeg"}];
//var paypal = require('paypal-checkout');
//var client = require('braintree-web/client');
//var paypalCheckout = require('braintree-web/paypal-checkout');

//paypal.Button.render({
  //braintree: {
    //client: client,
    //paypalCheckout: paypalCheckout
  //},
  // The rest of your configuration
//}, '/profile');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
var connection = mysql.createConnection({
	host     : 'sql2.freemysqlhosting.net',
	user     : 'sql2313905',
	password : 'cM2!jD6%',
	database : 'sql2313905',
	//insecureAuth : true,
	port : 3306
});

app.use(passport.initialize()); 
app.use(passport.session());
app.use(flash());

app.use(cookieParser()); //read cookies for auth

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
//app.get("/register", function(req, res){
  //});

   
   app.post('/register', passport.authenticate('local-signup', { 
	successRedirect : '/login', // redirect to the secure profile section 
	failureRedirect : '/register', // redirect back to the signup page if there is an error 
	failureFlash : true, // allow flash messages 
   }));
   
   app.get('/register', function(req, res) { 
	// render the page and pass in any flash data if it exists 
	res.render('register.ejs'); 
   }); 

   passport.serializeUser(function(user, done) { 
	done(null, user.Id); // Very important to ensure the case if the Id from your database table is the same as it is here 
}); 
passport.deserializeUser(function(Id, done) {    // LOCAL SIGNUP ============================================================ 
 
	connection.query("SELECT * FROM users WHERE Id = ? ",[Id], function(err, rows){ 
		 done(err, rows[0]); 
	 }); 
 }); 

 // ========================================================================= 
 // ========================================================================= 
 // we are using named strategies since we have one for login and one for signup 
 // by default, if there was no name, it would just be called 'local' 

passport.use( 
	 'local-signup', 
	 new LocalStrategy({ 
		 // by default, local strategy uses username and password, we will override with email 
		 usernameField : 'username', 
		 passwordField : 'password', 
		 passReqToCallback : true // allows us to pass back the entire request to the callback 
	 }, 
	 function(req, username, password, done) { 
		 // find a user whose email is the same as the forms email 
		 // we are checking to see if the user trying to login already exists 
		 connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) { 
			 if (err) 
				 return done(err); 
			 if (rows.length) { 
				 return done(null, false, req.flash('signupMessage', 'That username is already taken.')); 
			 } else { 
				 // if there is no user with that username 
				 // create the user 
				 var newUserMysql = { 
					 username: username, 
					 email: req.body.email, 
					 password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model 
				 }; 

				 var insertQuery = "INSERT INTO users ( username, email, password ) values (?,?,?)"; 

				 connection.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.password],function(err, rows) { 
					 newUserMysql.Id = rows.insertId; 

					 return done(null, newUserMysql); 
				 }); 
			 } 
		 }); 
	 }) 
 ); 
 app.get('/profile', function(req, res) { 
	res.render('profile.ejs', { 
	 user : req.user // get the user out of session and pass to template 
	}); 
   }); 

  
   var connection = mysql.createConnection({
	host     : 'sql2.freemysqlhosting.net',
	user     : 'sql2313905',
	password : 'cM2!jD6%',
	database : 'sql2313905',
	//insecureAuth : true,
	port : 3306
});

/*var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin',
	//insecureAuth : true,
	port : 3000
});
*/
connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
  });
  
  app.get('/createusers', function(req, res){ 
	let sql = 'CREATE TABLE users (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, username varchar(255), email varchar(255), password varchar(255));' 
	let query = connection.query(sql, (err,res) => { 
	 if(err) throw err; 
	}); 
		 
	res.send("SQL Worked"); 
	}); 

	app.get('/login', function(req, res) { 
 
		// render the page and pass in any flash data if it exists 
		res.render('login.ejs', { message: req.flash('loginMessage') }); 
	   });

	   app.post('/login', passport.authenticate('local-login', { 
		successRedirect : '/profile', // redirect to the secure profile section 
		failureRedirect : '/login', // redirect back to the signup page if there is an error 
		failureFlash : true // allow flash messages 
}), 
	function(req, res) { 
		console.log("hello"); 

		if (req.body.remember) { 
		  req.session.cookie.maxAge = 1000 * 60 * 3; 
		} else { 
		  req.session.cookie.expires = false; 
		} 
	res.redirect('/'); 
});
passport.use( 
	'local-login', 
	new LocalStrategy({ 
		// by default, local strategy uses username and password, we will override with email 
		usernameField : 'username', 
		passwordField : 'password', 
		passReqToCallback : true // allows us to pass back the entire request to the callback 
	}, 
	function(req, username, password, done) { // callback with email and password from our form 
		connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){ 
			if (err) 
				return done(err); 
			if (!rows.length) { 
				return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash 
			} 

			if (!bcrypt.compareSync(password, rows[0].password)) 
			return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata 

		// all is well, return successful user 
		return done(null, rows[0]); 
	}); 
}) 
); 


	app.get('/logout', function(req, res) { 
		req.logout(); 
		res.redirect('/'); 
	   }); 
	   

  /*app.post('/auth', function(request, response) {
	var username = username;
	var password = password;
	if (username && password) {
				username = admin;
				password = admin;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		}); 
*/

 app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/loggedin');
			} else {
				response.redirect('/register');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/', (req, res) => {
    res.sendFile('home.html', {
        root: path.join(__dirname, './')})
})
/*app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});
*/
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});


app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		//response.send('Welcome back, ' + request.session.username + '!');
		response.redirect('/')
	} else {
		response.send('Please login to view this page!<br><br><a href="/login">Login</a>');
	}
	response.end();
});

app.get('/loggedin', function(request, response) {
		if (request.session.loggedin) {
			response.redirect('/kpi');
		} else {
			response.send('Please login to view this page!');
		}
		response.end();
});

app.get('/about', (req, res) => {
    res.sendFile('about.html', {
        root: path.join(__dirname, './')})
})
app.get('/kpi', (req, res) => {
    res.sendFile('kpi.html', {
        root: path.join(__dirname, './')})
})

app.get('/library', (req, res) => {
    res.sendFile('library.html', {
        root: path.join(__dirname, './')})
})
app.get('/loggedin', (req, res) => {
 res.sendFile('loggedin.html', {
        root: path.join(__dirname, './')})
})

app.get('/design', (req, res) => {
    res.sendFile('design.html', {
        root: path.join(__dirname, './')})
})
app.get('/contact', (req, res) => {
    res.sendFile('contact.html', {
		root: path.join(__dirname, './')})
})

app.get('/software', (req, res) => {
    res.sendFile('software.html', {
		root: path.join(__dirname, './')})
})		
app.get('/login', (req, res) => {
    res.sendFile('login.html', {
        root: path.join(__dirname, './')})
})
/*app.get('/register', (req, res) => {
    res.sendFile('views/register.ejs', {
        root: path.join(__dirname, './')})
})
*/
/*app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.use(express.json())*/

const users = []

app.get('/users', (req, res) => {

    res.json(users)
})

/*app.post('/users', async (req, res) => {
try {
const salt = await bcrypt.genSalt()
const hashedPassword = await bcrypt.hash(req.body.password, salt)
console.log(salt)
console.log(hashedPassword)
const user = { name: req.body.name, password: hashedPassword }
users.push(user)
res.status(201).send()
} catch {
    res.status(500).send('error')
}
})

app.post('/users/login', async (req, res) => {

    const user = user.find(user => user.name = req.body.name)
    if (user == null) {
    return res.status(400).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send('success') } else {res.send('Not Allowed')
        }
      
    } 


    catch {res.status(500).send()
}
	})
	*/



/*app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});*/

app.listen(3000)