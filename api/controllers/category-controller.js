var mongoose = require('mongoose');
var Category = mongoose.model('Category');

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
    Category
        .find()
        .exec(function (err, categories) {
            if (err) {
                console.log("Error finding categories");
                res.status(500).json(err);
            } else {
                console.log('Found hotels', categories.length);
                res.status(200).json(categories);
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