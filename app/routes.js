var CompanyLogin = require('./login/companyLogin.js'); // login user from a company

var CrossDomain = require('./crossDomain/crossDomainRequest.js'); // cross-domain handling function
var LocationApi = require('./api/location.js'); // location api
var CompanyApi = require('./api/company.js'); // company api
var UserApi = require('./api/user.js'); // company api
var RegisterCompany = require('./registerCompany/registerCompany.js'); // register company


var Company = require('../database/models/company.js'); // 'Company' database model
var User = require('../database/models/user.js'); // 'User' database model
var Location = require('../database/models/location.js'); // 'City' database model
var CompanyType = require('../database/models/companyType.js'); // 'CompanyType' database model
var UserRole = require('../database/models/userRole.js'); // 'UserRoles' database model
var Domain = require('../database/models/domain.js'); // 'City' database model


module.exports = function(app){

	// post request for login for user from a company
	app.post('/companyLogin',function(req,res){
		
		// allow cross-domain and login user from a company
		CrossDomain.HandleCrossDomainLogin(req,res,CompanyLogin.CompanyLogin);		
	});



	// *************************** [ START ] APIs *****************************************

	// [ START ] GET METHODS

	// /api/getLocations?token=PUT_TOKEN_HERE
	app.get('/api/getLocations',function(req,res){
		
		// allow cross-domain request and execute function
		CrossDomain.HandleCrossDomainAPI(req,res,LocationApi.GetAllLocations);
	});

	// /api/getEmployees?CompanyId=PUT_COMPANY_ID&_HEREtoken=PUT_TOKEN_HERE
	app.get('/api/getEmployees',function(req,res){
		
		// allow cross-domain request and execute function
		CrossDomain.HandleCrossDomainAPI(req,res,UserApi.GetCompanyUsers);
	});

	// /api/getCompanyById?CompanyId=PUT_COMPANYID_HERE&token=PUT_TOKEN_HERE
	app.get('/api/getCompanyById',function(req,res){
		
		// allow cross-domain request and execute function
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.GetCompanyById);
	});

	// /api/getCalendarAppointments?CompanyId=PUT_COMPANYID_HERE&token=PUT_TOKEN_HERE
	app.get('/api/getCalendarAppointments',function(req,res){
		
		// allow cross-domain request and execute function
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.GetCalendarAppointments);
	});

	// /api/getUserById?UserId=PUT_USERID_HERE&token=PUT_TOKEN_HERE
	app.get('/api/getUserById',function(req,res){
		
		// allow cross-domain request and execute function
		CrossDomain.HandleCrossDomainAPI(req,res,UserApi.GetUserById);
	});

	// [ END ] GET METHODS
	// * * * * * * * * * * * 
	// [ START ] POST METHODS

	// /api/addClient?token=PUT_TOKEN_HERE
	// put CompanyId as string in data
	// put Client as JSON in data
	app.post('/api/addClient',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.AddClientManualy);
	});

	// /api/updateClient?token=PUT_TOKEN_HERE
	// put CompanyId as string in data
	// put ClientId as string in data
	// put Client as JSON in data
	app.post('/api/updateClient',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.UpdateClient);
	});

	// /api/addEmployee?token=PUT_TOKEN_HERE
	// put User as JSON in data
	app.post('/api/addEmployee',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.AddEmployee);
	});

	// /api/deleteEmployee?token=PUT_TOKEN_HERE
	// put UserId as string in data
	app.post('/api/deleteEmployee',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,UserApi.DeleteEmployee);
	});

	// /api/addServExec?token=PUT_TOKEN_HERE
	// put CompanyId as string in data
	// put ServExec as JSON in data
	app.post('/api/addServExec',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.AddServExec);
	});

	// /api/updateServExec?token=PUT_TOKEN_HERE
	// put CompanyId as string in data
	// put ServExecId as string in data
	// put ServExec as JSON in data
	app.post('/api/updateServExec',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.UpdateServExec);
	});

	// /api/deleteServExec?token=PUT_TOKEN_HERE
	// put CompanyId as string in data
	// put ServExecId as string in data
	app.post('/api/deleteServExec',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.DeleteServerExec);
	});

	// /api/addServExec?token=PUT_TOKEN_HERE
	// put CompanyId as string in data
	// put Service as JSON in data
	app.post('/api/addService',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.AddService);
	});

	// /api/updateService?token=PUT_TOKEN_HERE
	// put CompanyId as string in data
	// put ServiceId as string in data
	// put Service as JSON in data
	app.post('/api/updateService',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.UpdateService);
	});

	// /api/deleteService?token=PUT_TOKEN_HERE
	// put CompanyId as string in data
	// put ServiceId as string in data
	app.post('/api/deleteService',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.DeleteService);
	});

	// /api/addAppointment?token=PUT_TOKEN_HERE
	// put CompanyId as string in data
	// put Appointment as JSON in data
	app.post('/api/addAppointment',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.AddAppointmentManualy);
	});

	// /api/updateAppointment?token=PUT_TOKEN_HERE
	// put CompanyId as string in data
	// put Appointment as JSON in data
	app.post('/api/updateAppointment',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.UpdateAppointment);
	});

	// /api/deleteAppointment?token=PUT_TOKEN_HERE
	// put CompanyId as string in data
	// put AppointmentId as string in data
	app.post('/api/deleteAppointment',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.DeleteAppointment);
	});

	// /api/editCompany?token=PUT_TOKEN_HERE
	// put CompanyId as string in data
	// put Email as string in data
	// put PhoneNumber as string in data
	// put WebSite as string in data
	app.post('/api/editCompany',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.EditCompany);
	});

	// /api/editUser?token=PUT_TOKEN_HERE
	// put UserId as string in data
	// put PhoneNumber as string in data
	// put Address as string in data
	// put Location as string in data
	// put DateOfBirth as string in data
	app.post('/api/editUser',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,UserApi.EditUser);
	});

	// /api/changePassword?token=PUT_TOKEN_HERE
	// put UserId as string in data
	// put NewPassword as string in data
	// put OldPassword as string in data
	app.post('/api/changePassword',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,UserApi.ChangePassowrd);
	});

	// /api/updateWorkingTime?token=PUT_TOKEN_HERE
	// put CompanyId as string in data
	// put WorkingTime as JSON in data
	app.post('/api/updateWorkingTime',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainAPI(req,res,CompanyApi.UpdateWorkingTime);
	});


	// /api/registerCompany
	// put User as JSON in data
	// put Company as JSON in data
	app.post('/api/registerCompany',function(req,res){
		
		// allow cross-domain request
		CrossDomain.HandleCrossDomainRegister(req,res,RegisterCompany.RegisterCompany);
	});

	// [ END ] POST METHODS
	// ****************************[ END ] APIs *******************************************

	// *************************** [ START ] UPDATEs **************************************
	
	app.get('/update/update01',function(req,res){
		
		var update01 = require('../updates/01_CompanyWorkingTime/01_update.js');
		update01.Update01(req,res);
	});


	// *************************** [ END ] UPDATEs ****************************************

	

}