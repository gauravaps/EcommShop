const express = require('express');
const router = express.Router();
const razorpay = require('razorpay');
const crypto = require('crypto');
const ordermodel = require('../models/order'); // Assume ordermodel exists
const customError = require('../utils/customError'); // Assuming you have custom error handling

// Create new order with Razorpay integration
// POST /api/order
// private
router.post('/order', async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    // Check if there are order items
    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ success: false, message: 'No order items found' });
    }

    // Create a new order object
    const order = new ordermodel({
        user: req.activeUser._id,
        orderItems: orderItems.map((x) => ({
            ...x,
            product: x._id,
            _id: undefined,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    // Save the order in the database
    try {
        const savedOrder = await order.save();

        // Create a new Razorpay instance
        const instance = new razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Prepare options for creating a Razorpay order
        const options = {
            amount: totalPrice * 100, // Amount in paise
            currency: 'INR', // Currency (change as per your requirement)
            receipt: savedOrder._id.toString(), // Unique identifier for order
            payment_capture: 1, // Auto-capture payment after order creation
        };

        // Create Razorpay order
        const razorpayOrder = await instance.orders.create(options);

        // Send response with the newly created order and Razorpay order details
        res.status(200).json({ success: true, order: savedOrder, razorpayOrder });
    } catch (error) {
        // Handle any errors that occur during order creation or Razorpay integration
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update order to paid status after Razorpay payment
// PUT /api/order/:id/pay
// private
router.put('/order/:id/pay', async (req, res) => {
    try {
        // Find the order by ID
        const order = await ordermodel.findById(req.params.id);

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update order details
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.razorpay_payment_id,
            status: 'paid',
            update_time: Date.now(),
            email_address: req.body.email,
        };

        // Save the updated order
        const updatedOrder = await order.save();

        // Send response with updated order
        res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
        // Handle any errors that occur during order update
        console.error('Error updating order to paid status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Payment verification after successful payment in Razorpay
// POST /api/order/paymentverification
// public
router.post('/order/paymentverification', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Generate expected signature using Razorpay secret key
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        const expectedSignature = hmac.digest('hex');

        // Verify the signature
        if (expectedSignature === razorpay_signature) {
            // Payment verification successful
            // Perform any additional actions here (e.g., updating order status)
            res.status(200).json({ success: true, message: 'Payment verification successful' });
        } else {
            // Signature mismatch, payment verification failed
            res.status(400).json({ success: false, message: 'Payment verification failed: Signature mismatch' });
        }
    } catch (error) {
        // Handle any errors that occur during payment verification
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//module.exports = router;
