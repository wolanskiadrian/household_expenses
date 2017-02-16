var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

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
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

mongoose.model('User', userSchema);

