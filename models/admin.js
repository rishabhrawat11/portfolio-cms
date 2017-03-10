var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var admin_schema = mongoose.Schema({
    username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

var Admin = module.exports = mongoose.model('Admin', admin_schema);

module.exports.createAdmin = function(newAdmin, callback){
    bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newAdmin.password, salt, function(err, hash) {
	        newAdmin.password = hash;
	        newAdmin.save(callback);
	    });
	});
}

module.exports.getAdminByUsername = function(username, callback){
	var query = {username: username};

	Admin.findOne(query, callback);
}

module.exports.comparePassword = function(adminPassword, hash, callback){
	bcrypt.compare(adminPassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}