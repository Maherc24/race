

var express = require('express');
var app = express();
//const bcrypt = require('bcrypt');
const mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

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
app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});
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
		response.send('Please login to view this page!');
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
app.get('/register', (req, res) => {
    res.sendFile('register.html', {
        root: path.join(__dirname, './')})
})

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