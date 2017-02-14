var mongoose = require('mongoose');
var User = mongoose.model('User');

var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var nev = require('email-verification')(mongoose);

var myHasher = function(password, tempUserData, insertTempUser, callback) {
    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    return insertTempUser(hash, tempUserData, callback);
};



nev.configure({
    verificationURL: 'http://localhost:1337/api/email-verification/${URL}',
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
    
    // User.findOne({
    //     email: email
    // }).exec(function (err, registeredUser) {
    //     if(err) {
    //         console.log(err);
    //         res.status(400).json(err);
    //     } else {
    //         if (registeredUser) {
    //             res.status(401).json({"message": "E-mail already exist." });
    //         } else {
    //             User
    //                 .create({
    //                     email: email,
    //                     password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) ,
    //                     firstname: firstname,
    //                     lastname: lastname
    //                 }, function (err, user) {
    //                     if(err){
    //                         console.log(err);
    //                         res.status(400).json(err)
    //                     } else {
    //                         console.log('user created', user);
    //                         res.status(201).json(user);
    //                     }
    //                 });
    //         }
    //     }
    // });

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

    User.findOne({
        email: email
    }).exec(function (err, user) {
        if(err){
            console.log(err);
            res.status(400).json(err);
        } else if(user === null) {
            res.status(400).json({'message': 'User is not exist.'});
        } else {
            if(bcrypt.compareSync(password, user.password)) {
                console.log('User found', user);

                var token = jwt.sign({email: email}, 's3cr3t', {expiresIn: 3600});
                var userData = {
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname
                };

                res.status(200).json({success: true, token: token, user: userData});
            } else {
                res.status(401).json({"message": "unauthorize"});
            }
        }
    })
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


//TODO: check authenticate method o new registry user method
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