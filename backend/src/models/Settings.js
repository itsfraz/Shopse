const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // General
    siteName: { type: String, default: 'Shoping App' },
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    themeColor: { type: String, default: '#3b82f6' }, // blue-500
    maintenanceMode: { type: Boolean, default: false },

    // Contact
    supportEmail: { type: String, default: 'support@example.com' },
    phoneNumber: { type: String, default: '+1234567890' },
    address: { type: String, default: '123 E-commerce St, Internet City' },

    // Business
    currency: { type: String, default: '₹' },
    taxRate: { type: Number, default: 18 }, // Percentage
    shippingCharge: { type: Number, default: 50 },
    freeShippingThreshold: { type: Number, default: 1000 },

    // SEO
    metaTitle: { type: String, default: 'Best Online Shopping Store' },
    metaDescription: { type: String, default: 'Shop the best products at unbeatable prices.' },
    metaKeywords: { type: String, default: 'shopping, electronics, fashion, ecommerce' }
}, {
    timestamps: true
});

// Singleton Pattern: Prevent multiple documents
settingsSchema.statics.getSettings = async function() {
    const settings = await this.findOne();
    if (settings) return settings;
    return await this.create({});
};

module.exports = mongoose.model('Settings', settingsSchema);
