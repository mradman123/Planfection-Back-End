var COMPANY = require('../../database/models/company.js'); // company collection
var USER = require('../../database/models/user.js'); // user collection
var USERROLE = require('../../database/models/userRole.js'); // userRole collection

// error messages
var apiErrorMessage = require('../errors/apiErrors.js'); // messages for APIs errors 
var serverErrorMessage = require('../errors/serverErrors.js'); // messages for server errors 

// success messages
var registerSuccess = require('../success/register.js'); // messages for successful register operations

var passwordHash = require('password-hash'); // hash password

var work = require('../workingTime/workingTimeManagement.js'); // manage working hours


var _addAdmin = function (user, companyId, userRole, res){

	try{
		// create new user	
		var newUser = new USER();
		newUser.role = userRole.title;
		newUser.email = user.email;
		newUser.firstName = user.firstName;
		newUser.lastName = user.lastName;
		newUser.password = passwordHash.generate(user.password);
		newUser.phoneNumber = user.phoneNumber;						
		newUser.dateOfBirth = '';
		newUser.address = user.address;
		newUser.location = user.location;
		newUser.appointments = new Array();
		newUser.logins = new Array();

		newUser.companyId = companyId; // id of company

		newUser.save(function(newUserError,CreatedUser){
			if(newUserError){
				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			// if everything went ok
			else if(CreatedUser){

				// send "200 OK" to client
				res.status(200).jsonp({'message': registerSuccess.newCompany});
				return res.end(); // end response	
			}
			else{
				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
		}); // save user
	}
	catch(error){
		// send "500 Internal server error" to client
		res.status(500).jsonp({'message' : serverErrorMessage.serverError});
		return res.end(); // end response
	}	
}

// register new company
var _registerCompany = function(req,res){

	try{


		if(req.body.User){

			// find employee role
			USERROLE.findOne({'title': 'AdministratorTvrtke'},function(userRoleError,userRole){
				// if error occur
				if(userRoleError){

					// send "500 Internal server error" to client
					res.status(500).jsonp({'message' : serverErrorMessage.serverError});
					return res.end(); // end response
				}
				// if role of user is found
				else if(userRole){
					

					// check if user with email already exists
					USER.findOne({'email': req.body.User.email},function(userError,user){
						// if error occur
						if(userError){
							// send "500 Internal server error" to client
							res.status(500).jsonp({'message' : serverErrorMessage.serverError});
							return res.end(); // end response
						}
						// if email already in use
						else if(user){
							console.log("MAIL SE KORISTI");
							// send "400 Bad Request" to client
							res.status(400).jsonp({'message' : apiErrorMessage.emailInUse});
							return res.end(); // end response
						}
						// if everything is ok
						else{

							// create new company
							var newCompany = new COMPANY();

							newCompany.title= req.body.Company.title;
							newCompany.address= req.body.Company.address;
							newCompany.location= req.body.Company.location;
							newCompany.OIB= req.body.Company.OIB;
							newCompany.email = req.body.Company.email;
							newCompany.phoneNumber= req.body.Company.phoneNumber;
							newCompany.expirationDate= req.body.Company.expirationDate;
							newCompany.services = new Array();
							newCompany.appointments = new Array();
							newCompany.servExecs = new Array();
							newCompany.clients = new Array();
							newCompany.companyType= req.body.Company.companyType;
							// create default working time
							newCompany.workingTime = work.CreateDefaultWorkingTime();


							// save new company
							newCompany.save(function(newCompanyError,CreatedCompany){
								// if error occur
								if(newCompanyError){
									// send "500 Internal server error" to client
									res.status(500).jsonp({'message' : serverErrorMessage.serverError});
									return res.end(); // end response
								}
								else if(CreatedCompany){
									// create new admin for company		
									_addAdmin(req.body.User, CreatedCompany._id, userRole, res);
								}
								else{
									// send "500 Internal server error" to client
									res.status(500).jsonp({'message' : serverErrorMessage.serverError});
									return res.end(); // end response
								}
							});						
						}
					});
				}
				// if role of user is not found
				else{

					// send "503 Service Unavailable" to client
					res.status(503).jsonp({'message' : serverErrorMessage.serviceUnaviableError});
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
	catch(error){
		// send "500 Internal server error" to client
		res.status(500).jsonp({'message' : serverErrorMessage.serverError});
		return res.end(); // end response
	}
}


// export register request functions
module.exports = {

	RegisterCompany: _registerCompany
	
}