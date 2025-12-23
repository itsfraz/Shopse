const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    createProductReview,
    approveProductReview,
    deleteProductReview
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id/reviews/:reviewId/approve').put(protect, admin, approveProductReview);
router.route('/:id/reviews/:reviewId').delete(protect, admin, deleteProductReview);

module.exports = router;
