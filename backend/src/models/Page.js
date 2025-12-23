const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    sections: [sectionSchema],
    seo: {
        metaTitle: String,
        metaDescription: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Page', pageSchema);
