var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
var Schema = mongoose.Schema;

var expenseSchema = new Schema({
    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    amount: {
        type: SchemaTypes.Double,
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

