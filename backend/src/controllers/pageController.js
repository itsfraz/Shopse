const asyncHandler = require('express-async-handler');
const Page = require('../models/Page');
const initialPages = require('../data/pages');
const initialFooterPages = require('../data/footerPages');

// Combine both standard and footer pages for seeding
const allInitialPages = [...initialPages, ...initialFooterPages];

// @desc    Get page by slug
// @route   GET /api/pages/:slug
// @access  Public
const getPageBySlug = asyncHandler(async (req, res) => {
    const slug = req.params.slug;
    let page = await Page.findOne({ slug });

    if (!page) {
        // Auto-seed if not found and it's one of our known pages
        const defaultPage = allInitialPages.find(p => p.slug === slug);
        if (defaultPage) {
            page = await Page.create(defaultPage);
        } else {
            res.status(404);
            throw new Error('Page not found');
        }
    }

    res.json(page);
});

// @desc    Create/Update page content (Admin)
// @route   POST /api/pages
// @access  Private/Admin
const updatePage = asyncHandler(async (req, res) => {
    const { slug, title, sections, seo } = req.body;
    
    let page = await Page.findOne({ slug });

    if (page) {
        page.title = title || page.title;
        page.sections = sections || page.sections;
        page.seo = seo || page.seo;
        const updatedPage = await page.save();
        res.json(updatedPage);
    } else {
        const newPage = await Page.create({
            slug,
            title,
            sections,
            seo
        });
        res.status(201).json(newPage);
    }
});

module.exports = {
    getPageBySlug,
    updatePage
};
