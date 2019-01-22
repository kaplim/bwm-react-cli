const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		min: [4, 'Too short. Min is 4 characters.'],
		max: [32, 'Too long. Max is 32 characters.']
	},
	email: {
		type: String,
		min: [4, 'Too short. Min is 4 characters.'],
		max: [32, 'Too long. Max is 32 characters.'],
		unique: true,
		lowercase: true,
		required: 'Email is required',
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
	},
	password: {
		type: String,
		min: [6, 'Too short. Min is 6 characters.'],
		max: [32, 'Too long. Max is 32 characters.'],
		required: 'Password is required'
	},
	rentals: [ { type: Schema.Types.ObjectId, ref: 'Rental' } ]
}); //, { collection: 'new_name' });

userSchema.methods.hasSamePassword = function(requestedPassword) {
	return bcrypt.compareSync(requestedPassword, this.password);
}

userSchema.pre('save', function(next) {
	const user = this;

	bcrypt.genSalt(10, function(err,salt) {  // use 10 saltRounds
		bcrypt.hash(user.password, salt, function(err, hash) {
			user.password = hash;
			next();
		});
	});
});

module.exports = mongoose.model('User', userSchema);