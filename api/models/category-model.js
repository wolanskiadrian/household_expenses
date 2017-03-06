var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String,
    icon: String,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Category', categorySchema);