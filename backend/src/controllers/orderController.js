const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const Product = require('../models/Product'); // Import Product model

const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // 1. Verify Stock Availability
    for (const item of orderItems) {
        // Handle both ObjectId and String ID formats from frontend orderItems
        const productId = item.product;
        const product = await Product.findById(productId);
        
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.name}`);
        }
        
        if (product.stock < item.qty) {
            res.status(400);
            throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
        }
    }

    // 2. Create Order
    const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: true, // Assuming mock payment success for now
        paidAt: Date.now()
    });

    const createdOrder = await order.save();

    // 3. Deduct Stock Atomically & Emit Event
    const io = req.app.get('io');
    
    for (const item of orderItems) {
        const productId = item.product;
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $inc: { stock: -item.qty } },
            { new: true } // Return updated doc
        );
        
        // Emit stock update event to everyone (or just admins room if setup)
        if (io) {
            io.emit('stockUpdated', {
                productId: updatedProduct._id,
                name: updatedProduct.name,
                newStock: updatedProduct.stock
            });
        }
    }

    res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = 'Delivered'; // Sync status field if exists

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
});

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders
};
