// User database model

var mongoose = require('mongoose');


var userShema = mongoose.Schema({

	email : String,
	firstName : String,
	lastName : String,
	password : String,
	role : String,
	phoneNumber : String,
	companyId : String,
	dateOfBirth : String,
	address : String,
	location : String,
	appointments : Array,
	logins : Array


});

module.exports = mongoose.model('User',userShema); // export userShema as User