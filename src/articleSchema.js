const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    id: String, author: String, title: String, text: String, comments: Array, time: Date, img: String
})

module.exports = articleSchema;