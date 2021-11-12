const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  salt: String,
  hash: String,
  headline: String,
  following: Array,
  dob: Number,
  zipcode: String,
  email: String
})

module.exports = userSchema;