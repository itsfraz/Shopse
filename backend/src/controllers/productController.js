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
        highlights: req.body.highlights,
        specifications: req.body.specifications,
        discountPrice: req.body.discountPrice,
        isFeatured: req.body.isFeatured || false,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    const createdProduct = await product.save();
    
    // Real-time update (if socket is available)
    try {
        const io = req.app.get('io');
        if(io) io.emit('productCreated', createdProduct);
    } catch(e) { console.error("Socket emit failed", e) }

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
        
        // Update new fields
        product.highlights = req.body.highlights || product.highlights;
        product.specifications = req.body.specifications || product.specifications;

        const updatedProduct = await product.save();

        try {
            const io = req.app.get('io');
            if(io) io.emit('stockUpdated', { 
                productId: updatedProduct._id, 
                newStock: updatedProduct.stock,
                name: updatedProduct.name 
            });
        } catch(e) { console.error("Socket emit failed", e) }

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
        await product.deleteOne(); 
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        // Do not update avg rating until approved
        
        await product.save();
        res.status(201).json({ message: 'Review added successfully (pending approval)' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Approve a review
// @route   PUT /api/products/:id/reviews/:reviewId/approve
// @access  Private/Admin
const approveProductReview = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        const review = product.reviews.id(req.params.reviewId);
        
        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        review.isApproved = true;

        // Recalculate Rating
        const approvedReviews = product.reviews.filter(r => r.isApproved);
        product.numReviews = approvedReviews.length;
        product.rating =
            approvedReviews.reduce((acc, item) => item.rating + acc, 0) /
            approvedReviews.length;

        await product.save();
        res.json({ message: 'Review approved' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private/Admin
const deleteProductReview = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        const review = product.reviews.id(req.params.reviewId);
        if(!review) {
            res.status(404);
            throw new Error("Review not found");
        }
        
        // Use pull to remove safely
        product.reviews.pull(req.params.reviewId);

        // Recalculate Rating
        const approvedReviews = product.reviews.filter(r => r.isApproved);
        product.numReviews = approvedReviews.length;
        
        if (approvedReviews.length > 0) {
            product.rating =
                approvedReviews.reduce((acc, item) => item.rating + acc, 0) /
                approvedReviews.length;
        } else {
            product.rating = 0;
        }

        await product.save();
        res.json({ message: 'Review removed' });
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
    deleteProduct,
    createProductReview,
    approveProductReview,
    deleteProductReview
};
