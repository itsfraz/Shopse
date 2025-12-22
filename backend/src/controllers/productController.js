const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};
    
    // Filter by exact category if provided
    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    const count = await Product.countDocuments({ ...keyword, ...categoryFilter });
    const products = await Product.find({ ...keyword, ...categoryFilter })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        user: req.user._id,
        images: req.body.images,
        category: req.body.category,
        stock: req.body.stock,
        description: req.body.description,
        discountPrice: req.body.discountPrice,
        isFeatured: req.body.isFeatured || false,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = req.body.name || product.name;
        product.price = req.body.price || product.price;
        product.description = req.body.description || product.description;
        product.images = req.body.images || product.images;
        product.category = req.body.category || product.category;
        product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
        product.discountPrice = req.body.discountPrice !== undefined ? req.body.discountPrice : product.discountPrice;
        product.isActive = req.body.isActive !== undefined ? req.body.isActive : product.isActive;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne(); // or product.remove() depending on Mongoose version
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
