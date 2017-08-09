var USER = require('../../database/models/user.js'); // user collection

var validatePassword = require('../login/validatePassword.js'); // password manipulation

// error messages
var apiErrorMessage = require('../errors/apiErrors.js'); // messages for APIs errors 
var serverErrorMessage = require('../errors/serverErrors.js'); // messages for server errors 
// success messages
var userSuccess = require('../success/user.js'); // messages for successful user operations



// get user by id
var _getUserById = function(req,res){

	// if there is UserId
	if(req.query.UserId){
		USER.findOne({'_id': req.query.UserId},function(userError,user){

			if(userError){ // if error occur

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else if(user){ // if user is found
				// send "200 OK" to client
				res.status(200).jsonp(user);
				return res.end(); // end response
			}
			else{ // if user is not found

				// send "406 Gone" to client
				res.status(406).jsonp({'message' : apiErrorMessage.noDataError});
				return res.end(); // end response			
			}
		});
	}
	// if UserId does not exists
	else{

		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
}

// get all user for specific company from database collection
var _getCompanyUsers = function(req,res){
	
	if(req.query.CompanyId){
		USER.find({'companyId' : req.query.CompanyId},function(userError,users){

			if(userError){ // if error occur

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else if(users){ // if location is found

				// send "200 OK" to client
				res.status(200).jsonp(users);
				return res.end(); // end response	
			}
			else{ // if location is not found

				// send "410 Gone" to client
				res.status(410).jsonp({'message' : apiErrorMessage.noDataError});
				return res.end(); // end response			
			}
		}).sort({'firstName':1}); // sort users by firstName in ascending order
	}
	else{
		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
	
}

var _editUserDetails = function(req, res){

	// if all parameters exists
	if(req.body.UserId && req.body.PhoneNumber && req.body.Address && req.body.Location && req.body.DateOfBirth){

		// update company
		USER.update({
			'_id': req.body.UserId
		},{
			$set: 
				{
					'phoneNumber': req.body.PhoneNumber,
					'address': req.body.Address,
					'location': req.body.Location,
					'dateOfBirth': req.body.DateOfBirth

				} // change properties
		},
			function(updateError, result) {
			if (updateError){

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else{
				// send "200 OK" to client
				res.status(200).jsonp({'message': userSuccess.userEdit});
				return res.end(); // end response	
			}
		});	
	}
	// if any parameter missing
	else{

		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
}

// delete employee
var _deleteEmployee = function(req,res){

	if(req.body.UserId){

		USER.remove( { '_id' : req.body.UserId }, function(deleteError,result){
			if(deleteError){
				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else{
				// send "200 OK" to client
				res.status(200).jsonp({'message' : userSuccess.employeeDeleted});
				return res.end(); // end response				
			}
		});
	}
	else{
		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
}

var _changeUserPasword = function(userId,newPassword,res){

	// if all parameters exists
	if(userId && newPassword){

		// update company
		USER.update({
			'_id': userId
		},{
			$set: 
				{
					'password': validatePassword.HashPassword(newPassword)

				} // change password
		},
			function(updateError, result) {
			if (updateError){

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else{
				// send "200 OK" to client
				res.status(200).jsonp({'message': userSuccess.userPasswordChange});
				return res.end(); // end response	
			}
		});	
	}
	// if any parameter missing
	else{

		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
}

var _changePassowrd = function(req,res){
	
	// if there all all parameters
	if(req.body.UserId && req.body.OldPassword && req.body.NewPassword){
		USER.findOne({'_id': req.body.UserId},function(userError,user){

			if(userError){ // if error occur

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else if(user){ // if user is found
				
				if(validatePassword.Validate(req.body.OldPassword,user['password'])){
					// change password
					_changeUserPasword(req.body.UserId,req.body.NewPassword,res);
				}
				else{
					// send "400 Bad Request" to client
					res.status(400).jsonp({'message' : apiErrorMessage.wrongPassword});
					return res.end(); // end response	
				}
			}
			else{ // if user is not found

				// send "406 Gone" to client
				res.status(406).jsonp({'message' : apiErrorMessage.noDataError});
				return res.end(); // end response			
			}
		});
	}
	// if UserId does not exists
	else{

		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
}

// export user request functions
module.exports = {

	GetCompanyUsers: _getCompanyUsers,
	DeleteEmployee: _deleteEmployee,
	GetUserById: _getUserById,
	EditUser: _editUserDetails,
	ChangePassowrd: _changePassowrd
}