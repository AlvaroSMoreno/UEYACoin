var express = require('express');
var app = express();
var cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser')
var PORT = process.env.PORT || 3000;
var mysql = require('mysql');
var stripe = require('stripe')(sk);
var querystring = require('querystring'); 
var expressWs = require('express-ws')(app);
 
app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});
 
app.get('/', function(req, res, next){
  console.log('get route', req.testing);
  res.end();
});
 
app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);
});
 
app.listen(3000);


var con = mysql.createConnection({
  host: "YOUR_HOST",
  user: "YOUR_USER",
  password: "YOUR_PASS",
  database: "YOUR_DB",
  debug: false
});
con.connect(function(err) {
    if (err) throw err
    console.log("Connected to DB");
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/app', function(req, res) {
	console.log(req.query);
	res.sendFile(path.resolve(__dirname, 'public/app.html'));
});

app.post('/login', function(req, res) {
	console.log(req.body);
	con.query("SELECT * FROM users WHERE user = '"+req.body.user+"' AND pass='"+req.body.pass+"'", function (err, result) {
	    if (err) throw err;
	    console.log(result[0]!=undefined);
	    if(result[0]!=undefined) {
	    	var q = querystring.stringify({
		    	"pk": pk,
		    	"user": req.body.user
		    });
	   		res.send('/app?'+q);
	    }
	});
});

app.post('/register', function(req, res) {
	console.log(req.body);
	var sql = "INSERT INTO users (user, pass) VALUES ('"+req.body.user+"', '"+req.body.pass+"')";
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  console.log("Se inserto correctamente!");
	});
	res.redirect("/");
});

app.post('/getSession', function(req, res) {
	var session;
	(async () => {
		var q = querystring.stringify({
			"pk": req.body.pk,
			"user": req.body.user
		});
	  session = await stripe.checkout.sessions.create({
	    payment_method_types: ['card'],
	    line_items: [{
	      name: 'Custom Payment',
	      description: 'Product',
	      amount: req.body.amount,
	      currency: 'mxn',
	      quantity: 1,
	    }],
	    success_url: 'http://localhost:3000/success',
	    cancel_url: 'http://localhost:3000/cancel',
	  });
	  console.log(session);
	  res.send(session.id);
	})();
});

app.listen(PORT, function() {
	console.log('Corriendo servicio en puerto:', PORT);
});