var mongoose = require('mongoose');
var Expense = mongoose.model('Expense');

module.exports.add = function (req, res) {
    var categoryId = req.body.categoryId;
    var amount = req.body.amount;
    var description = req.body.description;
    var vendor = req.body.vendor;
    var expenseDate = req.body.expenseDate;
    var userId = req.body.userId;

    Expense.create({
        categoryId: categoryId,
        amount: amount,
        description: description,
        vendor: vendor,
        expenseDate: expenseDate,
        user: userId
    }, function (err, expense) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            res.status(201).json(expense);
        }
    })
};

module.exports.edit = function (req, res) {
    var expenseId = req.params.expenseId;

    Expense
        .findById(expenseId)
        .exec(function (err, expense) {
            if(err) {
                console.log(err);
                res.status(500).json(err);
            } else if (!expense) {
                console.log('Expense is not exist.');
                res.status(500).json({
                    message: 'Expense is not exist.'
                });
            } else {
                expense.categoryId = req.body.categoryId;
                expense.amount = req.body.amount;
                expense.description = req.body.description;
                expense.vendor = req.body.vendor;
                expense.expenseDate = req.body.expenseDate;
                
                expense.save(function (err, expenseUpdated) {
                    if(err) {
                        console.log(err);
                        res.status(500).json(err);
                    } else {
                        res.status(204).json({
                            message: 'Expense edited'
                        });
                    }
                });
            }
        });
};

module.exports.get = function (req, res) {
    var expenseId = req.params.expenseId;

    Expense
        .findById(expenseId)
        .exec(function (err, expense) {
            if(err) {
                console.log(err);
                res.status(500).json(err);
            } else if(!expense) {
                console.log('Expense is not exist.');
                res.status(500).json({
                    message: 'Expense is not exist.'
                });
            } else {
                res.status(200).json(expense);
            }
        })
};

module.exports.getAll = function (req, res) {
    var userId = req.params.userId;

    Expense
        .find({
            user: userId
        }).exec(function (err, expenses) {
            if(err) {
                console.log(err);
                res.status(500).json(err);
            } else if (!expenses) {
                console.log('There is no expenses');
                res.status(200).json([]);
            } else {
                res.status(200).json(expenses);
            }
        })
};

module.exports.delete = function (req, res) {
    var expenseId = req.params.expenseId;

    Expense
        .findByIdAndRemove(expenseId)
        .exec(function (err, expense) {
            if(err) {
                res
                    .status(404)
                    .json(err);
            } else {
                res
                    .status(204)
                    .json({
                        message: 'Expense deleted'
                    });
            }
        });

};