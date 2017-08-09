var passwordHash = require('password-hash'); // hash password

// compare passwords
// hashedPassword <- hashed string ( from database )
// password <- normal string ( from client )
// return true or false
function _validatePassword(password,hashedPassword){

	return passwordHash.verify(password,hashedPassword);
}

// hash password
function _hashPassword(password){
	return passwordHash.generate(password);
}


// export
module.exports = {

	Validate : _validatePassword,
	HashPassword: _hashPassword
}