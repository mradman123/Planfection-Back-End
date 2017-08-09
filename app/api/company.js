var COMPANY = require('../../database/models/company.js'); // company collection
var USER = require('../../database/models/user.js'); // user collection
var USERROLE = require('../../database/models/userRole.js'); // userRole collection

var passwordHash = require('password-hash'); // hash password

// error messages
var apiErrorMessage = require('../errors/apiErrors.js'); // messages for APIs errors 
var serverErrorMessage = require('../errors/serverErrors.js'); // messages for server errors 
// success messages
var companySuccess = require('../success/company.js'); // messages for successful company operations

var sortCompany = require('../sortCompany/sortCompany.js'); // library for sorting company

var ID = require('../idGenerator/idGenerator.js');

// add client to clients array
var _addClientToCompany = function(companyId, client,res){	
	// update company
	COMPANY.update({
		'_id': companyId
	},{
		$push: 
			{'clients': client} // add new client to clients
	},
		function(updateError, result) {
		if (updateError){

			// send "500 Internal server error" to client
			res.status(500).jsonp({'message' : serverErrorMessage.serverError});
			return res.end(); // end response
		}
		else{
			// send "200 OK" to client
			res.status(200).jsonp({'message': companySuccess.clientAdded});
			return res.end(); // end response	
		}
	});
}

// add servExec to servExecs array
var _addServExecToCompany = function(companyId, servExec,res){	
	// update company
	COMPANY.update({
		'_id': companyId
	},{
		$push: 
			{'servExecs': servExec} // add new servExec to servExecs
	},
		function(updateError, result) {
		if (updateError){

			// send "500 Internal server error" to client
			res.status(500).jsonp({'message' : serverErrorMessage.serverError});
			return res.end(); // end response
		}
		else{
			// send "200 OK" to client
			res.status(200).jsonp({'message': companySuccess.servExecAdded});
			return res.end(); // end response	
		}
	});
}

// add servExec to servExecs
var _addServExec = function(req,res){

	var companyId = req.body.CompanyId;
	var servExec = req.body.ServExec;

	// if there are companyId and servExec
	if(servExec && companyId){
		COMPANY.findOne({'_id': companyId},function(companyError,company){

			if(companyError){ // if error occur

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else if(company){ // if company is found

				// create new servExec
				var newservExec = servExec;
				// generate id
				newservExec['servExecId'] = ID.Generate();	
				
				_addServExecToCompany(companyId,newservExec,res);
								
			}
			else{ // if company is not found				
				// send "410 Gone" to client
				res.status(410).jsonp({'message' : apiErrorMessage.noDataError});
				return res.end(); // end response			
			}
		});
	}
	// if client or companyId does not exists
	else{
		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
}

// update service executioner 
var _updateServExec = function(req,res){

	var companyId = req.body.CompanyId;
	var servExec = req.body.ServExec;
	var servExecId = req.body.ServExecId;

	// if all parameters exists
	if(servExec && companyId && servExecId){
	
		COMPANY.update({ '_id' : companyId, 'servExecs.servExecId' : servExecId }, {'$set' : {'servExecs.$' : servExec}}, function(updateError, result) {
			// if error occur
			if(updateError){

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			// if everything went ok
			else{

				// send "200 OK" to client
				res.status(200).jsonp({'message': companySuccess.servExecUpdate});
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

var _deleteServerExec = function(req,res){
	
	// if all parameters exists
	if(req.body.ServExecId && req.body.CompanyId){
	
		// update company
		COMPANY.update({
			'_id': req.body.CompanyId
		},{
			$pull: 
				{'servExecs': {'servExecId': req.body.ServExecId}} // remove servExec from servExecs
		},
			function(updateError, result) {
				if (updateError){

					// send "500 Internal server error" to client
					res.status(500).jsonp({'message' : serverErrorMessage.serverError});
					return res.end(); // end response
				}
				else{
					// send "200 OK" to client
					res.status(200).jsonp({'message': companySuccess.servExecDeleted});
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

// add client to company
var _addClientManualy = function(req,res,next){

	var companyId = req.body.CompanyId;
	var client = req.body.Client;

	// if there are companyId and client
	if(client && companyId){
		COMPANY.findOne({'_id': companyId},function(companyError,company){

			if(companyError){ // if error occur

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else if(company){ // if company is found

				// create new client
				var newClient = client;
				// new client does not have user id
				newClient['userId'] = '';
				// generate client id
				newClient['clientId'] = ID.Generate();						

				// add number of appointments
				newClient['appointments'] = 0;

				// check for emails
				var clientEmailExist = false;
				
				// if new client has email
				if(newClient.email && newClient.email != ''){
					// foreach client in clients
					for(var i = 0; i < company.clients.length; i++){
						// if email already exists
						if( company.clients[i].email == newClient.email)
							clientEmailExist = true;
					}
				}

				// if email exists
				if(clientEmailExist){
					// send "400 Bad Request" to client
					res.status(400).jsonp({'message' : apiErrorMessage.emailInUse});
					return res.end(); // end response	
				}
				else{
					// callback function ( add client to company)
					_addClientToCompany(companyId,newClient,res);
				}

				
			}
			else{ // if company is not found				
				// send "410 Gone" to client
				res.status(410).jsonp({'message' : apiErrorMessage.noDataError});
				return res.end(); // end response			
			}
		});
	}
	// if client or companyId does not exists
	else{
		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
}

// get company by id
var _getCompanyById = function(req,res){

	// if there is CompanyId
	if(req.query.CompanyId){
		COMPANY.findOne({'_id': req.query.CompanyId},function(companyError,company){

			if(companyError){ // if error occur

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else if(company){ // if company is found

				// sort company
				var sortedCompany = sortCompany.Sort(company);

				// send "200 OK" to client
				res.status(200).jsonp(sortedCompany);
				return res.end(); // end response
			}
			else{ // if company is not found

				// send "406 Gone" to client
				res.status(406).jsonp({'message' : apiErrorMessage.noDataError});
				return res.end(); // end response			
			}
		});
	}
	// if CompanyId does not exists
	else{

		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
}

var _updateCompanyClients = function(clients,companyId,res){

	COMPANY.update({ '_id' : companyId}, {'$set' : {'clients' : clients}}, function(err, result) {
		if (err){
			// send "500 Internal server error" to client
			res.status(500).jsonp({'message' : serverErrorMessage.serverError});
			return res.end(); // end response
		}
		else{   // if update is successful 
			// send "200 OK" to client
			res.status(200).jsonp({'message': companySuccess.clientUpdate});
			return res.end(); // end response
		}
	});
}

// update client from clients array
var _updateClient = function(req,res){

	var companyId = req.body.CompanyId;
	var client = req.body.Client;
	var clientId = req.body.ClientId;

	// if there are companyId and client
	if(client && companyId && clientId){
		COMPANY.findOne({'_id': companyId},function(companyError,company){

			if(companyError){ // if error occur

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else if(company){ // if company is found
				
				// check for emails
				var clientEmailExist = false;
				
				// if new client has email
				if(client.email && client.email != ''){
					// foreach client in clients
					for(var i = 0; i < company.clients.length; i++){
						// if email already exists in other clients
						if( company.clients[i].email == client.email && company.clients[i].clientId != clientId)
							clientEmailExist = true;
					}
				}

				// if email exists
				if(clientEmailExist){
					// send "400 Bad Request" to client
					res.status(400).jsonp({'message' : apiErrorMessage.emailInUse});
					return res.end(); // end response	
				}
				else{
					
					// create new clients
					var newClients = company.clients;

					// foreach client in new clients
					for(var i = 0; i < newClients.length; i++){
						// if email already exists in other clients
						if(newClients[i].clientId == clientId){
							if(newClients[i]['appointments'])
								client['appointments'] = newClients[i]['appointments'];
							else
								client['appointments'] = 0;
							
							newClients[i] = client;
						}
					}
					// update database
					_updateCompanyClients(newClients,companyId,res);
				}				
			}
			else{ // if company is not found				
				// send "410 Gone" to client
				res.status(410).jsonp({'message' : apiErrorMessage.noDataError});
				return res.end(); // end response			
			}
		});
	}
	// if client or companyId does not exists
	else{
		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
}

// add employee to company
var _addEmployee = function(req,res){

	if(req.body.User){

		// find employee role
		USERROLE.findOne({'title': 'ZaposlenikTvrtke'},function(userRoleError,userRole){
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
						// send "400 Bad Request" to client
						res.status(400).jsonp({'message' : apiErrorMessage.emailInUse});
						return res.end(); // end response
					}
					// if everything is ok
					else{

						// create new user	
						var newUser = new USER();
						newUser.roleId = userRole._id;
						newUser.email = req.body.User.email;
						newUser.firstName = req.body.User.firstName;
						newUser.lastName = req.body.User.lastName;
						newUser.password = passwordHash.generate(req.body.User.password);
						newUser.roleId = req.body.User.roleId;
						newUser.phoneNumber = req.body.User.phoneNumber;
						newUser.companyId = req.body.User.companyId;
						newUser.dateOfBirth = req.body.User.dateOfBirth;
						newUser.address = req.body.User.address;
						newUser.locationId = req.body.User.locationId;
						newUser.appointments = new Array();
						newUser.logins = new Array();

						newUser.save();
						// send "200 OK" to client
						res.status(200).jsonp({'message': companySuccess.employeeAdded});
						return res.end(); // end response	
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

// add service to services array
var _addServiceToCompany = function(companyId, service,res){	
	
	if(companyId && service){
		// update company
		COMPANY.update({
			'_id': companyId
		},{
			$push: 
				{'services': service} // add new service to services
		},
			function(updateError, result) {
			if (updateError){

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else{
				// send "200 OK" to client
				res.status(200).jsonp({'message': companySuccess.serviceAdded});
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

// add service to services
var _addService = function(req,res){

	var companyId = req.body.CompanyId;
	var service = req.body.Service;

	// if there are companyId and service
	if(service && companyId){
		COMPANY.findOne({'_id': companyId},function(companyError,company){

			if(companyError){ // if error occur

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else if(company){ // if company is found

				// create new servExec
				var newService = service;
				// generate serviceId
				newService['serviceId'] = ID.Generate();
				
				_addServiceToCompany(companyId,newService,res);
								
			}
			else{ // if company is not found				
				// send "410 Gone" to client
				res.status(410).jsonp({'message' : apiErrorMessage.noDataError});
				return res.end(); // end response			
			}
		});
	}
	// if client or companyId does not exists
	else{
		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
}

// update service 
var _updateService = function(req,res){

	var companyId = req.body.CompanyId;
	var service = req.body.Service;
	var serviceId = req.body.ServiceId;

	// if all parameters exists
	if(service && companyId && serviceId){
	
		COMPANY.update({ '_id' : companyId, 'services.serviceId' : serviceId }, {'$set' : {'services.$' : service}}, function(updateError, result) {
			// if error occur
			if(updateError){

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			// if everything went ok
			else{

				// send "200 OK" to client
				res.status(200).jsonp({'message': companySuccess.serviceUpdate});
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

var _deleteService = function(req,res){
	
	// if all parameters exists
	if(req.body.ServiceId && req.body.CompanyId){
	
		// update company
		COMPANY.update({
			'_id': req.body.CompanyId
		},{
			$pull: 
				{'services': {'serviceId': req.body.ServiceId}} // remove service from services
		},
			function(updateError, result) {
				if (updateError){

					// send "500 Internal server error" to client
					res.status(500).jsonp({'message' : serverErrorMessage.serverError});
					return res.end(); // end response
				}
				else{
					// send "200 OK" to client
					res.status(200).jsonp({'message': companySuccess.serviceDeleted});
					return res.end(); // end response	
				}
		});		
	}
	// if any parameter missing
	// if any parameter missing
	else{
		
		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
}

var _addAppointment = function(appointment,companyId,res){
	
	// if all parameters exists
	if(appointment && companyId && res){

		// update company
		COMPANY.update({
			'_id': companyId
		},{
			$push: 
				{'appointments': appointment} // add new client to clients
		},
			function(updateError, result) {
			if (updateError){

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else{

				_increaseClientAppointments(companyId,appointment['clientId']);
				// send "200 OK" to client
				res.status(200).jsonp({'message': companySuccess.appointmentAdded});
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

var _addAppointmentManualy = function(req,res){
	
	// if all parameters exists
	if(req.body.CompanyId && req.body.Appointment){

		var newAppointment = req.body.Appointment;
		newAppointment['userClientId'] = '';
		newAppointment['appointmentId'] = ID.Generate();
		_addAppointment(newAppointment,req.body.CompanyId,res);
	}
	// if any parameter missing
	else{

		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
}

var _editCompanyDetails = function(companyId, email, phoneNumber, webSite, res){

	// if all parameters exists
	if(companyId && email && ( phoneNumber || phoneNumber=='' ) && ( webSite || webSite == '' )){
		
		// update company
		COMPANY.update({
			'_id': companyId
		},{
			$set: 
				{
					'email': email,
					'phoneNumber': phoneNumber,
					'webSite': webSite

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
				res.status(200).jsonp({'message': companySuccess.companyEdit});
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

var _editCompany = function(req,res){


	// if all parameters exists
	if(req.body.CompanyId && req.body.Email && ( req.body.PhoneNumber || req.body.PhoneNumber == '') && ( req.body.WebSite || req.body.WebSite == '')){
		
		COMPANY.find({'email': req.body.Email},function(companyError,companies){

			if(companyError){ // if error occur

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else if(companies){ // if company is found
				// if more than one company use email
				if(companies.length > 1){

					// send "400 Bad Request" to client
					res.status(400).jsonp({'message' : apiErrorMessage.emailInUse});
					return res.end(); // end response
				}
				else if(companies.length == 1){
					
					// if only company for edditing using mail
					if(companies[0]._id == req.body.CompanyId)
						_editCompanyDetails(req.body.CompanyId, req.body.Email, req.body.PhoneNumber, req.body.WebSite, res);
					else{
						// send "400 Bad Request" to client
						res.status(400).jsonp({'message' : apiErrorMessage.emailInUse});
						return res.end(); // end response
					}
				}
				else{
					_editCompanyDetails(req.body.CompanyId, req.body.Email, req.body.PhoneNumber, req.body.WebSite, res);
				}
												
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

var _updateCompanyAppointments = function(appointments,companyId,res){

	// if there are companyId and appointments
	if(appointments && companyId){
		COMPANY.update({ '_id' : companyId}, {'$set' : {'appointments' : appointments}}, function(err, result) {
			if (err){
				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else{   // if update is successful 
				// send "200 OK" to client
				res.status(200).jsonp({'message': companySuccess.appointmentUpdate});
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

// update appointment from appointments array
var _updateAppointment = function(req,res){	

	// if there are companyId and appointment
	if(req.body.Appointment && req.body.CompanyId){
		COMPANY.findOne({'_id': req.body.CompanyId},function(companyError,company){

			if(companyError){ // if error occur

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else if(company){ // if company is found				
					
				// create new appointments
				var newAppointments = company.appointments;

				// foreach appointment in new appointments
				for(var i = 0; i < newAppointments.length; i++){					
					if(newAppointments[i].appointmentId == req.body.Appointment.appointmentId){
						// if client changed
						if(newAppointments[i]['clientId'] != req.body.Appointment['clientId']){
							_increaseClientAppointments(req.body.CompanyId,req.body.Appointment['clientId']);
							_decreaseClientAppointments(req.body.CompanyId,newAppointments[i]['clientId']);
						}
						newAppointments[i] = req.body.Appointment;
					}
				}
				// update database
				_updateCompanyAppointments(newAppointments,req.body.CompanyId,res);							
			}
			else{ // if company is not found				
				// send "410 Gone" to client
				res.status(410).jsonp({'message' : apiErrorMessage.noDataError});
				return res.end(); // end response			
			}
		});
	}
	// if appointment or companyId does not exists
	else{
		// send "410 Gone" to client
		res.status(410).jsonp({'message' : apiErrorMessage.noDataRecievedError});
		return res.end(); // end response
	}
}

// get all appointments from company in format of a calendar
var _getCalendarAppointments = function(req,res){


	// if there is companyId
	if(req.query.CompanyId){
		COMPANY.findOne({'_id': req.query.CompanyId},function(companyError,company){

			if(companyError){ // if error occur
				
				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			else if(company){ // if company is found

				if(company.appointments.length > 0){
					// store all appointments in calendarAppointments
					var calendarAppointments = company.appointments;

					// foreach appointment in calendarAppointments
					for(var i = 0; i < calendarAppointments.length; i++){

						// set default color
						calendarAppointments[i]['color'] = '#dd4b39';

						// add client name to appointment
						for(var j = 0; j < company.clients.length; j++){
							if(company.clients[j].clientId == calendarAppointments[i].clientId)
								calendarAppointments[i]['clientName'] = company.clients[j].firstName + ' ' + company.clients[j].lastName;
						}

						// add servExec name to appointment
						for(var k = 0; k < company.servExecs.length; k++){
							if(company.servExecs[k].servExecId == calendarAppointments[i].servExecId){
								calendarAppointments[i]['servExecName'] = company.servExecs[k].name;
								calendarAppointments[i]['color'] = company.servExecs[k].color;
							}
						}

						// create new services { id, name }
						calendarAppointments[i]['services'] = new Array();
						
						for(var l = 0; l < calendarAppointments[i].serviceIds.length; l++){
							for(var m = 0; m < company.services.length; m++){
								if(calendarAppointments[i].serviceIds[l] == company.services[m].serviceId)
									calendarAppointments[i]['services'].push({'serviceId': company.services[m].serviceId, 'name': company.services[m].name});
							}
						}
					}	
					
					// send "200 OK" to client
					res.status(200).jsonp(calendarAppointments);
					return res.end(); // end response
				}
				else{
					
					// send "200 OK" to client
					res.status(200).jsonp([]);
					return res.end(); // end response
				}
													
			}
			else{ // if company is not found	
					
				// send "410 Gone" to client
				res.status(410).jsonp({'message' : apiErrorMessage.noDataError});
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

var _findAppointmentAndDecreaseClient = function(companyId,appointmentId){

	if(appointmentId && companyId){
		COMPANY.findOne({'_id': companyId},function(companyError,company){

			if(companyError){ // if error occur
				return false;
			}
			else if(company){ // if company is found

				// for each appointment
				for(var i = 0; i < company.appointments.length; i++){
					// if appointment id match
					if(company.appointments[i]['appointmentId'] == appointmentId)
					{
						return _decreaseClientAppointments(companyId,company.appointments[i]['clientId']);
					}					
				}
				return false;
								
			}
			else{ // if company is not found				
				return false;		
			}
		});
	}
	// if client or companyId does not exists
	else{
		return false;
	}

}

var _deleteAppointment = function(req,res){
	
	// if all parameters exists
	if(req.body.AppointmentId && req.body.CompanyId){
		
		// decrease number of client appointments
		_findAppointmentAndDecreaseClient(req.body.CompanyId,req.body.AppointmentId);	

		// update company
		COMPANY.update({
			'_id': req.body.CompanyId
		},{
			$pull: 
				{'appointments': {'appointmentId': req.body.AppointmentId}} // remove appointment from appointments
		},
			function(updateError, result) {
				if (updateError){

					// send "500 Internal server error" to client
					res.status(500).jsonp({'message' : serverErrorMessage.serverError});
					return res.end(); // end response
				}
				else{
					// send "200 OK" to client
					res.status(200).jsonp({'message': companySuccess.appointmentDeleted});
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

var _increaseClientAppointments = function(companyId, clientId){

	// if all parameters exists
	if(clientId && companyId){
	
		COMPANY.update({ '_id' : companyId, 'clients.clientId' : clientId }, {'$inc' : {'clients.$.appointments' : 1}}, function(updateError, result) {
			// if error occur
			if(updateError){
				return false;				
			}
			// if everything went ok
			else{
				return true;				
			}
		});
	}
	// if any parameter missing
	else{
		return false;		
	}
}

var _decreaseClientAppointments = function(companyId, clientId){

	// if all parameters exists
	if(clientId && companyId){
	
		COMPANY.update({ '_id' : companyId, 'clients.clientId' : clientId }, {'$inc' : {'clients.$.appointments' : -1}}, function(updateError, result) {
			// if error occur
			if(updateError){
				return false;				
			}
			// if everything went ok
			else{
				return true;				
			}
		});
	}
	// if any parameter missing
	else{
		return false;		
	}
}

// update working time 
var _updateWorkingTime = function(req,res){

	var companyId = req.body.CompanyId;
	var workingTime = req.body.WorkingTime;

	// if all parameters exists
	if(workingTime && companyId){
	
		COMPANY.update({ '_id' : companyId }, {'$set' : {'workingTime' : workingTime}}, function(updateError, result) {
			// if error occur
			if(updateError){

				// send "500 Internal server error" to client
				res.status(500).jsonp({'message' : serverErrorMessage.serverError});
				return res.end(); // end response
			}
			// if everything went ok
			else{

				// send "200 OK" to client
				res.status(200).jsonp({'message': companySuccess.workingTimeUpdate});
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

// export company request functions
module.exports = {

	AddClientManualy: _addClientManualy,
	GetCompanyById: _getCompanyById,
	UpdateClient : _updateClient,
	AddEmployee: _addEmployee,
	AddServExec: _addServExec,
	UpdateServExec: _updateServExec,
	DeleteServerExec: _deleteServerExec,
	AddService: _addService,
	UpdateService: _updateService,
	DeleteService: _deleteService,
	AddAppointmentManualy: _addAppointmentManualy,
	EditCompany: _editCompany,
	UpdateAppointment: _updateAppointment,
	GetCalendarAppointments: _getCalendarAppointments,
	DeleteAppointment: _deleteAppointment,
	UpdateWorkingTime: _updateWorkingTime
}