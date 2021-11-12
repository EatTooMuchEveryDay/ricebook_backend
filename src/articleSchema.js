const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    id: String, author: String, title: String, text: String, comments: Array
})

module.exports = articleSchema;