const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    id: String, author: String, title: String, text: String, comments: Array, time: Date, image: String
})

module.exports = articleSchema;