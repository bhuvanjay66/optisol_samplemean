const mongoose = require('mongoose'),
 Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

var productsSchema = new Schema({
    PId: {
        type: Number,
        required: [true, 'ProductId cannot be blank.'],
        unique: [true, 'Duplicat value not allowed.']
    },
    ProductName: {
        type: String,
        trim: String,
        required: [true, 'ProductName cannot be blank.'],
        minlength: [3, 'Must be at least 3 characters.'],
        maxlength: [50, 'Must be less than 50 characters.']
    },
    ProductShotCode: {
        type: String,
        trim: String,
        required: [true, 'ProductShotCode cannot be blank.'],
        minlength: [3, 'Must be at least 3 characters.'],
        maxlength: [20, 'Must be less than 50 characters.']
    },
    Category: {
        type: String,
        trim: String,
        required: [true, 'Category cannot be blank.'],
    },
    Price: {
        type: Number,
        required: [true, 'Price cannot be blank.'],
    },
    Quantity: {
        type: Number,
        required: [true, 'Quantity cannot be blank.'],
    },
    Description: {
        type: String,
        trim: String,
        maxlength: [250, 'Must be less than 50 characters.']
    },
    Origin: {
        type: String,
        trim: String,
        required: [true, 'Origin cannot be blank.'],
    },
    ImageLink: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {
    timestamps: true
});

var Product = mongoose.model('Product', productsSchema);


module.exports = Product;


