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

    // 0. Prevent Duplicate Orders (Simple Idempotency Check)
    // Check if user placed an order with same total price in last 5 seconds
    const duplicateCheck = await Order.findOne({
        user: req.user._id,
        totalPrice: totalPrice,
        createdAt: { $gt: new Date(Date.now() - 5000) }
    });

    if (duplicateCheck) {
        res.status(400);
        throw new Error('Duplicate order detected. Please check your order history.');
    }

    // 1. Reserve Stock Atomically (Optimistic Locking pattern without Transactions)
    const reservedItems = [];

    try {
        for (const item of orderItems) {
            // Handle both ObjectId and String ID formats
            const productId = item.product;

            // Attempt to decrement stock ONLY if sufficient stock exists
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: productId, stock: { $gte: item.qty } },
                { $inc: { stock: -item.qty } },
                { new: true } 
            );
            
            if (!updatedProduct) {
                // If null, it means condition { stock: { $gte: qty } } failed (or product missing)
                // Fetch product to see if it exists to give better error
                const exists = await Product.findById(productId);
                if (!exists) {
                    throw new Error(`Product not found: ${item.name}`);
                } else {
                    throw new Error(`Insufficient stock for ${exists.name}. Available: ${exists.stock}`);
                }
            }

            // Success, track it for potential rollback
            reservedItems.push({ id: productId, qty: item.qty });
        }
    } catch (error) {
        // 2. Rollback: If any item failed, re-add stock for successful ones
        console.error("Order Failed, Rolling back stock...", error.message);
        for (const reserved of reservedItems) {
            await Product.findByIdAndUpdate(reserved.id, { $inc: { stock: reserved.qty } });
        }
        res.status(400);
        throw error; // Re-throw to be caught by error handler
    }

    // 3. Create Order
    // If we reached here, all stock is secured.
    const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: true, // Assuming mock payment success
        paidAt: Date.now()
    });

    const createdOrder = await order.save();

    // 4. Emit event for real-time frontend updates
    const io = req.app.get('io');
    if (io) {
        // Emit for each product updated
        for (const item of orderItems) {
             // We can fetch new stock or calculate it. 
             // Ideally we should have the new stock from the findOneAndUpdate above, 
             // but we didn't store the full objects. Let's just notify 'update'.
             const p = await Product.findById(item.product); // optional fetch for exact UI
             if(p) {
                io.emit('stockUpdated', {
                    productId: p._id,
                    name: p.name,
                    newStock: p.stock
                });
             }
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
        // Security Check: Only allow Admin or Order Owner
        if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to view this order');
        }
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
