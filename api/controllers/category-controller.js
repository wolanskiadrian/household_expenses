var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports.add = function (req, res) {
    var name = req.body.name;
    var icon = req.body.icon;

    Category.create({
        name: name,
        icon: icon
    }, function (err, category) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            res.status(201).json(category);
        }
    })
};

module.exports.addByUser = function (req, res) {
    var name = req.body.name;
    var icon = req.body.icon;
    var userId = req.params.userId;

    Category.create({
        name: name,
        icon: icon,
        user: userId
    }, function (err, category) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            res.status(201).json(category);
        }
    })
};

module.exports.edit = function (req, res) {
    var categoryId = req.params.categoryId;

    Category
        .findById(categoryId)
        .exec(function (err, category) {
            if(err) {
                console.log(err);
                res.status(500).json(err);
            } else if (!expense) {
                console.log('Category is not exist.');
                res.status(500).json({
                    message: 'Category is not exist.'
                });
            } else {
                category.name = req.body.name;
                category.icon = req.body.icon;

                category.save(function (err, categoryUpdated) {
                    if(err) {
                        console.log(err);
                        res.status(500).json(err);
                    } else {
                        res.status(204).json({
                            message: 'Category edited'
                        });
                    }
                });
            }
        });
};

module.exports.get = function (req, res) {
    var categoryId = req.params.categoryId;

    Category
        .findById(categoryId)
        .exec(function (err, category) {
            if(err) {
                console.log(err);
                res.status(500).json(err);
            } else if(!expense) {
                console.log('Category is not exist.');
                res.status(500).json({
                    message: 'Category is not exist.'
                });
            } else {
                res.status(200).json(category);
            }
        })
};

module.exports.getAll = function (req, res) {
    var userId = req.params.userId;

    Category.find({user: {$in: [undefined, userId]}})
    .exec(function (err, allNeededCategories) {
        if (err) {
            console.log("Error finding categories");
            res.status(500).json(err);
        } else {
            console.log('Found categories', allNeededCategories.length);
            res.status(200).json(allNeededCategories);
        }
    });
};

module.exports.getUserCategories = function (req, res) {
    var userId = req.params.userId;

    Category.find({user: userId})
        .exec(function (err, userCategories) {
            if (err) {
                console.log("Error finding categories");
                res.status(500).json(err);
            } else {
                console.log('Found categories', userCategories.length);
                res.status(200).json(userCategories);
            }
        });
};

module.exports.delete = function (req, res) {
    var categoryId = req.params.categoryId;

    Category
        .findByIdAndRemove(categoryId)
        .exec(function (err, category) {
            if(err) {
                res
                    .status(404)
                    .json(err);
            } else {
                res
                    .status(204)
                    .json({
                        message: 'Category deleted'
                    });
            }
        });

};