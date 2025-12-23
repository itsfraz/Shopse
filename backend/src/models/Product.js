const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please include a product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please include a product description']
    },
    price: {
        type: Number,
        required: [true, 'Please include a product price'],
        min: 0
    },
    discountPrice: {
        type: Number,
        min: 0,
        default: 0
    },
    category: {
        type: String, // Storing category name for simplicity as per current requirement, or can be ObjectId if Category model used strictly
        required: true,
        index: true
    },
    stock: {
        type: Number,
        required: [true, 'Please include stock quantity'],
        min: 0,
        default: 0
    },
    images: [{
        type: String, // URL of the image
        required: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    highlights: [{
        type: String
    }],
    specifications: [{
        key: { type: String },
        value: { type: String }
    }],
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        isApproved: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
