const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  salt: String,
  hash: String,
  following: Array
})

module.exports = userSchema;