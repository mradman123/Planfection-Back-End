// Company database model

var mongoose = require('mongoose');


var companyShema = mongoose.Schema({

	title : String,
	address : String,
	location : String,
	OIB : String,
	email : String,
	phoneNumber : String,
	workingTime : Array,
	webSite : String,	
	expirationDate : String,
	services : Array,
	appointments : Array,
	servExecs : Array,
	clients : Array,
	companyType: String



});

module.exports = mongoose.model('Company',companyShema); // export companyShema as Company