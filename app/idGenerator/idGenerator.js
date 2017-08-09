var shortId = require('shortid'); // include shortid

// function for generating Ids
var _generate = function(){
	return shortId.generate();
}

// export id generate functions
module.exports = {

	Generate: _generate
}