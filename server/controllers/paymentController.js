import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay keys are missing in environment variables');
      return res.status(500).json({ message: 'Payment gateway configuration missing' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Failed to create Razorpay order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({ message: error.message || 'Server error during payment initiation' });
  }
};

// @desc    Verify Payment
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification details' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is verified, create order in database
      const order = new Order({
        user: req.user._id,
        orderItems: orderData.orderItems,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: 'Razorpay',
        paymentResult: {
          id: razorpay_payment_id,
          status: 'Paid',
          update_time: Date.now().toString(),
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
        itemsPrice: orderData.itemsPrice,
        taxPrice: orderData.taxPrice,
        shippingPrice: orderData.shippingPrice,
        totalPrice: orderData.totalPrice,
        isPaid: true,
        paidAt: Date.now(),
      });

      const createdOrder = await order.save();
      res.json({ message: 'Payment verified successfully', order: createdOrder });
    } else {
      res.status(400).json({ message: 'Invalid signature, payment verification failed' });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ message: error.message || 'Server error during verification' });
  }
};

