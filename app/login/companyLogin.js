var jwt = require('jsonwebtoken'); // used for tokens
var jwToken = require('../jwtSecret.js'); // 'City' database model

var validatePassword = require('./validatePassword.js'); // validate password

var USER = require('../../database/models/user.js'); // user collection
var COMPANY = require('../../database/models/company.js'); // company collection  

// error messages
var serverErrorMessage = require('../errors/serverErrors.js'); // messages for server errors 
var loginErrorMessage = require('../errors/loginErrors.js'); // messages for server errors 

var sortCompany = require('../sortCompany/sortCompany.js'); // library for sorting company

// get date of today in DD.MM.YYYY. format
function _dateToday(){
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; // January is 0
	var yyyy = today.getFullYear();

	if(dd < 10)
    	dd = '0' + dd
	
	if(mm<10)
	    mm = '0' + mm
	
	return dd + '.' + mm + '.' + yyyy + '.';
}

// check if application is expired for a user
function IsExpired(expirationDate){
  	
  	try{
  		
  		var today = _dateToday();
		return new Date(today.split('.')[2] + '-' + today.split('.')[1] + '-' + today.split('.')[0] + ' ' + '00:00:00') > new Date(expirationDate.split('.')[2] + '-' + expirationDate.split('.')[1] + '-' + expirationDate.split('.')[0] + ' ' + '00:00:00')
  	}
  	catch(err){
  		return false;
  	}
  	
}

// record login
function _recordLogin(userId, req){

	// record of login
	var record = {
		time : new Date().getHours() + ':' + new Date().getMinutes(), // time in HH:MM format
		date : _dateToday(), // date in DD.MM.YYYY. format,
		UTCoffset : new Date().getTimezoneOffset(), // difference between UTC and recorded time ( server's time ) in minutes
		ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress // ip address of client
	}

	// update user
	USER.update({
		'_id': userId
	},{
		$push: 
			{'logins': record} // add new record to logins
	},
		function(updateError, result) {
		// if error occur
		if (updateError)
			return false;
		// if everything went ok
		else
			return true;
	});
}

// login logic for user in a company
function _companyLoginLogic(email, password, req, res){
	
	// find user by email
	USER.findOne({'email': email},function(userError,user){
			
		if(userError){ // if error occur
			console.log("ERROR U PRETRAZI BAZE USER!");
			// send "500 Internal server error" to client
			res.status(500).jsonp({'message' : serverErrorMessage.serverError});
			return res.end(); // end response

		}
		else if(user){ // if user is found

			// compare passwords
			if(validatePassword.Validate(password,user.password)){ // password match

				// user login success

				// find company by companyId from user
				COMPANY.findOne({'_id': user.companyId},function(companyError,company){

					if(companyError){ // if server error occur
						console.log("ERROR U PRETRAZI BAZE COMPANY!");
						// send "500 Internal server error" to client
						res.status(500).jsonp({'message' : serverErrorMessage.serverError});
						return res.end(); // end response
					}
					else if(company){ // if company is found

						// if application expired
						if(IsExpired(company['expirationDate'])){

							// send "401 Unauthorized" to client
							res.status(401).jsonp({'message' : loginErrorMessage.expiredApplicationError});
							return res.end(); // end response
						}
						else{

							// save user and company with token
							//var jwtJson = { User: user, Company: company};

							var jwtJson = { User: user};

							// create a token
						    var token = jwt.sign(jwtJson, jwToken.secret);

						    // record login
						    _recordLogin(user['_id'],req);

						    // sort company
							var sortedCompany = sortCompany.Sort(company);

						    // send "200 OK" to client
							res.status(200).jsonp({User: user, Company: sortedCompany, Token: token});
							return res.end(); // end response
						}

					}
					else{ // if user has no company

						// send "401 Unauthorized" to client
						res.status(401).jsonp({'message' : loginErrorMessage.companyError});
						return res.end(); // end response
					}
				});
			}
			else{ // wrong password					

				// send "400 Bad Request" to client
				res.status(400).jsonp({'message' : loginErrorMessage.wrongPasswordError});
				return res.end(); // end response
			}
		}
		else{ // user is not found

			// send "400 Bad Request" to client
			res.status(400).jsonp({'message' : loginErrorMessage.wrongEmailError});
			return res.end(); // end response
		}
	});
}

// get request and execute _companyLoginLogic
function _companyLogin(req,res){	
	
	_companyLoginLogic(req.body.email,req.body.password, req, res);	
}


// export login functions
module.exports = {

	CompanyLogin: _companyLogin

}