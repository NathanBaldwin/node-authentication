'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BCRYPT_DIFFICULTY = 11;

// const User = mongoose.model('Users', {
//   email: String,
//   hashedPassword: String
// });

const UserSchema = mongoose.Schema({
  email: String,
  password: String
});

UserSchema.methods.authenticate = function (password, cb) {
  bcrypt.compare(password, this.password, cb);
};

//making custom save logic here to run it through hasher. It's like middleware:
//'pre' copmes from mongoose:
UserSchema.pre('save', function (next) { //can't use fat arrow functions because this will be different.
  //when you use arrow funtion, it pre-saves the 'this';
  bcrypt.hash(this.password, BCRYPT_DIFFICULTY, (err, hash) => {
    if (err) throw err;

    this.password = hash;
    next();
  })
});

module.exports = mongoose.model('Users', UserSchema);
