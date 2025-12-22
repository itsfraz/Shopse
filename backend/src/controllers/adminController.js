const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Total Revenue
    const orders = await Order.find({ isPaid: true }); // Or whatever criteria for confirmed revenue
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    // 2. Counts
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments({ role: 'user' }); // Count only customers
    const ordersCount = await Order.countDocuments();

    // 3. Recent Orders
    const recentOrders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email');

    // 4. Monthly Revenue (Simple aggregation)
    // This is basic. For production, efficient aggregation pipeline is better.
    // Group by month
    
    // 5. Product Performance
    // Find top selling products (if you track 'sold' count on products, or aggregate from orders)
    // For now, let's just return low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).limit(5);

    res.json({
        totalRevenue,
        productsCount,
        usersCount,
        ordersCount,
        recentOrders,
        lowStockProducts
    });
});

// @desc Get all users for admin
// @route GET /api/admin/users
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc Update user role or status
// @route PUT /api/admin/users/:id
const updateUserStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.role = req.body.role || user.role;
    if (req.body.isActive !== undefined) {
        user.isActive = req.body.isActive;
    }
    
    await user.save();
    res.json(user);
});

module.exports = {
    getDashboardStats,
    getUsers,
    updateUserStatus
};
