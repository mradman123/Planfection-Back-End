// CompanyType database model

var mongoose = require('mongoose');


var companyTypeShema = mongoose.Schema({

	title : String,
	description : String

});

module.exports = mongoose.model('CompanyType',companyTypeShema); // export citiesShema as CompanyType