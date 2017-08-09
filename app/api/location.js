var LOCATION = require('../../database/models/location.js'); // location collection

// error messages
var apiErrorMessage = require('../errors/apiErrors.js'); // messages for APIs errors 
var serverErrorMessage = require('../errors/serverErrors.js'); // messages for server errors 

// get all locations from database collection
var _getAllLocations = function(req,res){

	LOCATION.find(function(locationError,locations){

		if(locationError){ // if error occur

			// send "500 Internal server error" to client
			res.status(500).jsonp({'message' : serverErrorMessage.serverError});
			return res.end(); // end response
		}
		else if(locations){ // if location is found

			// send "200 OK" to client
			res.status(200).jsonp(locations);
			return res.end(); // end response	
		}
		else{ // if location is not found

			// send "410 Gone" to client
			res.status(410).jsonp({'message' : apiErrorMessage.noDataError});
			return res.end(); // end response			
		}
	}).sort({'title':1}); // sort locations by title in ascending order
}

// export location request functions
module.exports = {

	GetAllLocations: _getAllLocations
}