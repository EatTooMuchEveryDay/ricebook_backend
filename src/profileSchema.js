const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  username: String,
  headline: String,
  dob: String,
  zipcode: String,
  email: String,
  avatar: String,
  phone: String,
  passwordlength: Number
})

module.exports = profileSchema;