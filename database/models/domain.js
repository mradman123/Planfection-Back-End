// Domain database model

var mongoose = require('mongoose');


var domainShema = mongoose.Schema({

	title : String,
	description : String

});

module.exports = mongoose.model('Domain',domainShema); // export domainShema as Domain