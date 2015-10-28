// Load required packages
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');
 
// Define our user schema
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
// Execute before each user.save() call
UserSchema.pre('save', function(next) {
  var user = this;
 
  // Break out if the password hasn't changed
  // we call the next middleware
  // if a next is called with an error
  // The flow is interrupted
  if (!user.isModified('password')) return next();
 
  // Password changed so we need to hash it
  // first argument is number of rounds
  // err details errors
  // salt is the generated salt
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);
    
    // null is a callback to signify progress, we dont need it
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});
 
//We compare the passwords
UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
 
 
// Export the Mongoose collection
module.exports = mongoose.model('User', UserSchema);