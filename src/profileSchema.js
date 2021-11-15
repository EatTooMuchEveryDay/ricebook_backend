const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  username: String,
  headline: String,
  dob: Date,
  zipcode: String,
  email: String,
  avatar: String
})

module.exports = profileSchema;