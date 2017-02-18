var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String,
    icon: String
});

mongoose.model('Category', categorySchema);