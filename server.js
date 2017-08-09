var port = process.env.PORT || 8080; // application port

// include packages
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var path = require('path');




// *************************** [START] DATABASE CONNECTION ***************************************
// database connection string

var configDB = require('./database/config.js');

// configDB.url - database path

mongoose.connect(configDB.connection_string, function(err){

	// if error occurs
	if(err){
		console.log('[START ERROR] Error occured. Problem with database connection. ERROR: ', err)
	}
	else{
		console.log('[START] Connected to a Different Approach Project database.')
	}

}); //connect to database

// **************************** [END] DATABASE CONNECTION ****************************************

// application setup 
app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret : 'differentapproachproject1version1applicationforeveryone'}))

require('./app/routes.js')(app); // routes ( function call )

app.set('view engine','ejs'); 


app.listen(port); // start application

console.log('[START] Server is running at port ' + port);

