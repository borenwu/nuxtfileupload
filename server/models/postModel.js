const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: String,
    images: [{url: String}],
    date: Date
});

module.exports = mongoose.model('Post', PostSchema);
