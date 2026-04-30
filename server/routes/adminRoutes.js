import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const orders = await Order.find();
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Calculate daily sales for the last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const salesData = last7Days.map(date => {
      const daySales = orders
        .filter(order => order.createdAt.toISOString().split('T')[0] === date)
        .reduce((acc, order) => acc + order.totalPrice, 0);
      return { date, sales: daySales };
    });

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalSales,
      salesData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
