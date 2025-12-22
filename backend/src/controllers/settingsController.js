const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
    // Uses the singleton helper
    const settings = await Settings.getSettings();
    res.json(settings);
});

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
    const {
        siteName, logoUrl, faviconUrl, themeColor, maintenanceMode,
        supportEmail, phoneNumber, address,
        currency, taxRate, shippingCharge, freeShippingThreshold,
        metaTitle, metaDescription, metaKeywords
    } = req.body;

    // Find the singleton document
    let settings = await Settings.findOne();
    
    // If somehow missing, create it
    if (!settings) {
        settings = await Settings.create({});
    }

    // Update fields
    settings.siteName = siteName || settings.siteName;
    settings.logoUrl = logoUrl || settings.logoUrl;
    settings.faviconUrl = faviconUrl || settings.faviconUrl;
    settings.themeColor = themeColor || settings.themeColor;
    settings.maintenanceMode = maintenanceMode !== undefined ? maintenanceMode : settings.maintenanceMode;

    settings.supportEmail = supportEmail || settings.supportEmail;
    settings.phoneNumber = phoneNumber || settings.phoneNumber;
    settings.address = address || settings.address;

    settings.currency = currency || settings.currency;
    settings.taxRate = taxRate !== undefined ? taxRate : settings.taxRate;
    settings.shippingCharge = shippingCharge !== undefined ? shippingCharge : settings.shippingCharge;
    settings.freeShippingThreshold = freeShippingThreshold !== undefined ? freeShippingThreshold : settings.freeShippingThreshold;

    settings.metaTitle = metaTitle || settings.metaTitle;
    settings.metaDescription = metaDescription || settings.metaDescription;
    settings.metaKeywords = metaKeywords || settings.metaKeywords;

    const updatedSettings = await settings.save();

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
        io.emit('settingsUpdated', updatedSettings);
    }

    res.json(updatedSettings);
});

module.exports = {
    getSettings,
    updateSettings
};
