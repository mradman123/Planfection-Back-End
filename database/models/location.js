// City database model

var mongoose = require('mongoose');


var locationShema = mongoose.Schema({

	title : String,
	zip : Number

});

module.exports = mongoose.model('Location',locationShema); // export locationShema as Location