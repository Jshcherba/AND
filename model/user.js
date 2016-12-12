var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    address: [String],
    registered: { type: Date, default: Date.now },
    active: Boolean
});

module.exports = userSchema;
