// app/models/daygoal.js

// load mongoose since we need it to define a model
var mongoose = require('mongoose');

module.exports = mongoose.model('Daygoal', {
    text : String,
    category: String,	
    weektarget: String,
    duration: Number,
    author: String,
    photo: String,
    done : Boolean
});