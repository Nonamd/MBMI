// app/models/daygoal.js

// load mongoose since we need it to define a model
var mongoose = require('mongoose');

module.exports = mongoose.model('Daygoal', {
    text : String,
    price: Number,
    author: String,
    address: String,
    photo: String,
    done : Boolean
});