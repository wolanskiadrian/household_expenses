var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: String,
    lastname: String,
    isActive: {
        type: Boolean,
        "default": false
    }
});

mongoose.model('User', userSchema);

