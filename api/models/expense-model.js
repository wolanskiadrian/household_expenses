var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var expenseSchema = new Schema({
    categoryId: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: String,
    vendor: {
        type: String,
        required: true
    },
    expenseDate: {
        type: Date,
        required: true
    },
    createData: {
        type: Date,
        "default": Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

mongoose.model('Expense', expenseSchema);

