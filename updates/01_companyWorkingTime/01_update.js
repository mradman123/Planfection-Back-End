var COMPANY = require('../../database/models/company.js'); // company collection
var work = require('../../app/workingTime/workingTimeManagement.js'); // manage working hours

// Update working time of every company to default value ( check decription.txt )
var _update01 = function(req,res){

	COMPANY.update({}, {'$set' : { 'workingTime' : work.CreateDefaultWorkingTime()}}, { multi: true }, function(updateError, result) {
		// if error occur
		if(updateError){

			// send "500 Internal server error" to client
			res.status(500).jsonp({'message' : 'Update fail!'});
			return res.end(); // end response
		}
		// if everything went ok
		else{

			// send "200 OK" to client
			res.status(200).jsonp({'message': 'Update success!'});
			return res.end(); // end response
		}
	});
}

module.exports = {

	Update01 : _update01	
}