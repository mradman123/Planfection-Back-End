var DOMAIN = require('../../database/models/domain.js'); // domain collection

// error messages
var domainErrorMessage = require('../errors/crossDomainErrors.js'); // messages for cross-domain errors 
var serverErrorMessage = require('../errors/serverErrors.js'); // messages for server errors 

var jwt = require('jsonwebtoken'); // used for tokens
var jwToken = require('../jwtSecret.js'); // secret for JWT

// alow cross-domain requests
var _allowCrossDomain = function(res){
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "X-Requested-With");
}

// check if application allow requests from a domain
var _allowedDomain = function(req,res,next){
	
	DOMAIN.findOne({'title': req.headers.host},function(domainError,domain){

		if(domainError){ // if error occur
			console.log("ERROR U PRETRAZI DOMENE: ",domainError);
			// send "500 Internal server error" to client
			res.status(500).jsonp({'message' : serverErrorMessage.serverError});
			return res.end(); // end response
		}
		else if(domain){ // if domain is found

			// execute function
			next(req,res);			
		}
		else{ // if domain is not found

			// send "401 Unauthorized" to client
			res.status(401).jsonp({'message' : domainErrorMessage.domainNotAllowedError});
			return res.end(); // end response			
		}
	});
}

// check if application allow API requests from a domain
var _allowedDomainAPI = function(req,res,next){
	
	// store token from 'x-access-token' (header) in token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	DOMAIN.findOne({'title': req.headers.host},function(domainError,domain){

		if(domainError){ // if error occur

			// send "500 Internal server error" to client
			res.status(500).jsonp({'message' : serverErrorMessage.serverError});
			return res.end(); // end response
		}
		else if(domain){ // if domain is found
			// verify token
			jwt.verify(token, jwToken.secret, function(tokenError, tokenInfo) {     
				// if error occur
		    	if(tokenError){
		        
		        	// send "500 Internal server error" to client
					res.status(500).jsonp({'message' : serverErrorMessage.serverError});
					return res.end(); // end response 
		      	} 
		      	else{ // if everything is ok 

		        	// execute function
					next(req,res);
		      	}
		    });	
		}
		else{ // if domain is not found

			// send "401 Unauthorized" to client
			res.status(401).jsonp({'message' : domainErrorMessage.domainNotAllowedError});
			return res.end(); // end response			
		}
	});
}

// check if application allow API requests from a domain
var _allowedDomainRegister = function(req,res,next){	
	
	DOMAIN.findOne({'title': req.headers.host},function(domainError,domain){

		if(domainError){ // if error occur

			// send "500 Internal server error" to client
			res.status(500).jsonp({'message' : serverErrorMessage.serverError});
			return res.end(); // end response
		}
		else if(domain){ // if domain is found
			
        	// execute function
			next(req,res); 
		}
		else{ // if domain is not found

			// send "401 Unauthorized" to client
			res.status(401).jsonp({'message' : domainErrorMessage.domainNotAllowedError});
			return res.end(); // end response			
		}
	});
}

// handle cross-domain login
var _handleCrossDomainLogin = function(req,res,next){
	_allowCrossDomain(res); // allow cross-domain requests
	_allowedDomain(req,res,next); // check if domain is allowed and execute function
}

// handle cross-domain API
var _handleCrossDomainAPI = function(req,res,next){
	_allowCrossDomain(res); // allow cross-domain requests
	_allowedDomainAPI(req,res,next); // check if domain API request is allowed and execute function 
}

// handle cross-domain register
var _handleCrossDomainRegister = function(req,res,next){
	_allowCrossDomain(res); // allow cross-domain requests
	_allowedDomainRegister(req,res,next); // check if domain register request is allowed and execute function 
}

// export cross-domain request functions
module.exports = {

	HandleCrossDomainLogin: _handleCrossDomainLogin,
	HandleCrossDomainAPI: _handleCrossDomainAPI,
	HandleCrossDomainRegister: _handleCrossDomainRegister
}