var mongoose = require('mongoose');
var User = mongoose.model('User');

var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');


module.exports.register = function (req, res) {
    console.log('registering user');

    var email = req.body.email;
    var password = req.body.password;
    var firstname = req.body.firstname || null;
    var lastname = req.body.lastname || null;

    User.findOne({
        email: email
    }).exec(function (err, registeredUser) {
        if(err) {
            console.log(err);
            res.status(400).json(err);
        } else {
            if (registeredUser) {
                res.status(401).json({"message": "E-mail already exist." });
            } else {
                User
                    .create({
                        email: email,
                        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) ,
                        firstname: firstname,
                        lastname: lastname
                    }, function (err, user) {
                        if(err){
                            console.log(err);
                            res.status(400).json(err)
                        } else {
                            console.log('user created', user);
                            res.status(201).json(user);
                        }
                    });
            }
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
        console.log(user);

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