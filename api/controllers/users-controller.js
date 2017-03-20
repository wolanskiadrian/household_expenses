var mongoose = require('mongoose');
var User = mongoose.model('User');

var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var nev = require('email-verification')(mongoose);
var nodemailer = require('nodemailer');

var myHasher = function(password, tempUserData, insertTempUser, callback) {
    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    return insertTempUser(hash, tempUserData, callback);
};

var pageURI = process.env.PAGE_URI || 'http://localhost:1337';

nev.configure({
    verificationURL: pageURI + '/api/email-verification/${URL}',
    persistentUserModel: User,
    tempUserCollection: 'users_temp',
    expirationTime: 600,

    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'hhs.application@gmail.com',
            pass: 'lubieplacki1'
        }
    },
    verifyMailOptions: {
        from: 'Do Not Reply <hhs.application@gmail.com>',
        subject: 'Please confirm account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    },

    hashingFunction: myHasher,
    passwordFieldName: 'password'
}, function(err, options) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('configured: ' + (typeof options === 'object'));
});

nev.generateTempUserModel(User, function(err, tempUserModel) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});

module.exports.register = function (req, res) {
    console.log('registering user');
    console.log(req.body.type);

    var email = req.body.email;
    var password = req.body.password;
    var firstname = req.body.firstname || null;
    var lastname = req.body.lastname || null;
    
    var newUser = User({
        email: email,
        password: password ,
        firstname: firstname,
        lastname: lastname
    });

    nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
        if (err) {
            console.log(err);
            res.status(404).json(err);
        } else {
            if (existingPersistentUser) {
                console.log(existingPersistentUser);
                res.status(403).json({message: 'You have already signed up and confirmed your account. Did you forget your password?'});
            } else {
                if (newTempUser) {
                    var URL = newTempUser[nev.options.URLFieldName];
                    nev.sendVerificationEmail(email, URL, function(err, info) {
                        if(err) {
                            console.log(err);
                            res.status(400).json(err);
                        } else {
                            res.status(201).json({message: 'An email has been sent to you. Please check it to verify your account.', info: info});
                        }
                    });
                } else {
                    res.status(400).json({message: 'You have already signed up. Please check your email to verify your account.'});
                }
            }
        }
    });
};

module.exports.resendVerificationEmail = function (req, res) {
    var email = req.body.email;

    nev.resendVerificationEmail(email, function(err, userFound) {
        if (err) {
            res.status(404).send('ERROR: resending verification email FAILED');
        } else {
            if (userFound) {
                res.status(200).json({
                    message: 'An email has been sent to you, yet again. Please check it to verify your account.'
                });
            } else {
                res.status(200).json({
                    message: 'Your verification code has expired. Please sign up again.'
                });
            }
        }
    });
};

module.exports.confirmAccount = function (req, res) {
    console.log('confirm user account');

    var url = req.params.URL;

    nev.confirmTempUser(url, function(err, user) {
        if (user) {
            nev.sendConfirmationEmail(user.email, function(err, info) {
                if (err) {
                    res.status(404).send('ERROR: sending confirmation email FAILED');
                } else{
                    res.redirect('/');
                }
            });
        } else {
            res.status(404).send('ERROR: confirming temp user FAILED');
        }
    });
};

module.exports.login = function (req, res) {
    console.log('login user');

    var email = req.body.email;
    var password = req.body.password;

    console.log(req.body);

    User.findOne({
        email: email
    }).exec(function (err, user) {
        if(err){
            console.log(err);
            res.status(500).json(err);
        } else if(user === null) {
            console.log('User is not exist');
            res.status(500).json({'message': 'User is not exist.'});
        } else {
            if(bcrypt.compareSync(password, user.password)) {
                console.log('User found', user);

                var token = jwt.sign({email: email}, 's3cr3t', {expiresIn: 3600});
                var userData = {
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    id: user._id
                };

                res.status(200).json({success: true, token: token, user: userData});
            } else {
                res.status(401).json({"message": "unauthorize"});
            }
        }
    })
};

module.exports.changePassword = function (req, res) {

    var userId = req.body.userId;
    var password = req.body.password;

    User
        .findById(userId)
        .exec(function (err, user) {
            if(err) {
                console.log(err);
                res.status(400).json(err);
            } else if (user === null) {
                console.log('user not found');
                res.status(400).json({
                    message: 'User is not exist.'
                });
            } else {
                user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

                user.save(function (err, userUpdated) {
                    if(err) {
                        console.log(err);
                        res.status(400).json(err);
                    } else {
                        res.status(200).json({
                            message: 'Password changed.'
                        });
                    }
                })
            }
        });
};

module.exports.editProfile = function (req, res) {

    var userId = req.body.userId;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    console.log(lastname);

    User
        .findById(userId)
        .exec(function (err, user) {
            if(err) {
                console.log(err);
                res.status(400).json(err);
            } else if (user === null) {
                console.log('user not found');
                res.status(400).json({
                    message: 'User is not exist.'
                });
            } else {
                user.firstname = firstname;
                user.lastname = lastname;

                user.save(function (err, userUpdated) {
                    if(err) {
                        console.log(err);
                        res.status(400).json(err);
                    } else {
                        res.status(200).json({
                            message: 'Profile edited.'
                        });
                    }
                })
            }
        });
};

module.exports.getUsers = function (req, res) {
    User
        .find()
        .exec(function (err, users) {
            if(err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(users);
            }
        })
};

module.exports.authenticate = function (req, res, next) {
    var headerExists = req.headers.autorization;
    if(headerExists) {
        var token = req.headers.autorization.split(' ')[1];
        jwt.verify(token, 's3cr3t', function (error, decoded) {
            if(error){
                console.log(error);
                res.status(401).json('Unauthorized');
            } else {
                req.user = decoded.email;
                next();
            }
        })
    } else {
        res.status(403).json('No token provided');
    }
};


// password reset

module.exports.forgotPasswordEmail = function (req, res) {
    var email = req.body.email;
    var token = bcrypt.hashSync(email, bcrypt.genSaltSync(8), null);
    token = token.split("/").join("-");

    User.findOne({
        email: email
    }).exec(function (err, user) {
        if(err) {
            console.log(err);
            res.status(400).json(err);
        } else if (!user) {
            res.status(403).json({
                message: 'User is not exist'
            });
        } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000;

            user.save(function (err, updatedUser) {
                if(err) {
                    console.log(err);
                    res.status(400).json(err);
                } else {
                    var poolConfig = 'smtp://hhs.application%40gmail.com:lubieplacki1@smtp.gmail.com/?pool=true';
                    var smtpTransport = nodemailer.createTransport(poolConfig);
                    var mailOptions = {
                        to: user.email,
                        from: 'hhs.application@gmail.com',
                        subject: 'Household expenses - reset password email',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/#!/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    };

                    smtpTransport.sendMail(mailOptions, function(err) {
                        if(err) {
                            console.log(err);
                            res.status(400).json(err);
                        } else {
                            res.status(200).json({
                                message: 'An e-mail has been sent to ' + email + ' with further instructions.'
                            })
                        }
                    });
                }
            })
        }
    })

};

module.exports.resetPassword = function (req, res) {
    var token = req.params.token;
    var password = req.body.password;
    var confirm = req.body.password;

    User.findOne({
        resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }
    }).exec(function (err, user) {
        if(err) {
            console.log(err);
            res.status(400).json(err);
        } else if(!user){
            res.status(400).json({
                message: 'Password reset token is invalid or has expired.'
            });
        } else {
            if(password !== confirm) {
                res.status(400).json({
                    message: 'Password do not match'
                })
            } else {
                user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                user.resetPasswordExpires = undefined;
                user.resetPasswordToken = undefined;

                user.save(function (err, userUpdated) {
                    if(err) {
                        console.log(err);
                        res.status(400).json(err);
                    } else {
                        var poolConfig = 'smtp://hhs.application%40gmail.com:lubieplacki1@smtp.gmail.com/?pool=true';
                        var smtpTransport = nodemailer.createTransport(poolConfig);
                        var mailOptions = {
                            to: user.email,
                            from: 'hhs.application@gmail.com',
                            subject: 'Household expenses - Your password has been changed',
                            text: 'Hello,\n\n' +
                            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                        };

                        smtpTransport.sendMail(mailOptions, function(err) {
                            if(err) {
                                console.log(err);
                                res.status(400).json(err);
                            } else {
                                res.status(200).json({
                                    message: 'An e-mail has been sent to ' + user.email + ' with further instructions.'
                                })
                            }
                        });

                        res.status(200).json({
                            message: 'Password changed.'
                        });
                    }
                });
            }
        }
    })
};

