// UserRole database model

var mongoose = require('mongoose');


var userRoleShema = mongoose.Schema({

	title : String,
	description : String

});

module.exports = mongoose.model('UserRole',userRoleShema); // export userRoleShema as UserRole