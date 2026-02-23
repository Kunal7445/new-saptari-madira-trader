import pool from '../config/db.js';
import { Transaction } from '../models/Transaction.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Product } from '../models/Product.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Get total products
    const productCount = await pool.query('SELECT COUNT(*) as count FROM products');
    
    // Get total customers
    const customerCount = await pool.query('SELECT COUNT(*) as count FROM customers');
    
    // Get stock summary
    const stockValue = await Product.getTotalStockValue();
    
    // Get recent orders count
    const recentOrders = await pool.query(`
      SELECT COUNT(*) as count FROM orders 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `);
    
    // Get pending payments
    const totalPending = await Payment.getTotalPending();
    const totalReceived = await Payment.getTotalReceived();
    
    // Get this month's orders
    const monthlyOrders = await pool.query(`
      SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total
      FROM orders 
      WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW())
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW())
    `);

    res.json({
      totalProducts: parseInt(productCount.rows[0].count),
      totalCustomers: parseInt(customerCount.rows[0].count),
      totalStockValue: parseFloat(stockValue.total_value),
      totalStockQuantity: parseInt(stockValue.total_quantity),
      recentOrdersCount: parseInt(recentOrders.rows[0].count),
      totalPending: parseFloat(totalPending),
      totalReceived: parseFloat(totalReceived),
      monthlyOrdersCount: parseInt(monthlyOrders.rows[0].count),
      monthlyOrdersTotal: parseFloat(monthlyOrders.rows[0].total)
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBalanceSheet = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to current month if no dates provided
    const start = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];
    
    // Get sales (orders)
    const salesResult = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) as total_sales,
             COUNT(*) as order_count
      FROM orders
      WHERE status != 'cancelled'
      AND DATE(created_at) BETWEEN $1 AND $2
    `, [start, end]);
    
    // Get purchases (from transactions)
    const purchaseResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total_purchases
      FROM transactions
      WHERE type = 'expense'
      AND DATE(created_at) BETWEEN $1 AND $2
    `, [start, end]);
    
    // Get payments received (using created_at instead of payment_date)
    const paymentsReceived = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE status = 'paid'
      AND DATE(created_at) BETWEEN $1 AND $2
    `, [start, end]);
    
    // Get pending payments
    const pendingPayments = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE status = 'pending'
    `);
    
    const totalSales = parseFloat(salesResult.rows[0].total_sales);
    const totalPurchases = parseFloat(purchaseResult.rows[0].total_purchases);
    const totalReceived = parseFloat(paymentsReceived.rows[0].total);
    const totalPending = parseFloat(pendingPayments.rows[0].total);
    
    res.json({
      period: { startDate: start, endDate: end },
      sales: totalSales,
      purchases: totalPurchases,
      grossProfit: totalSales - totalPurchases,
      paymentsReceived: totalReceived,
      pendingPayments: totalPending,
      netBalance: totalReceived - totalPending,
      orderCount: parseInt(salesResult.rows[0].order_count)
    });
  } catch (error) {
    console.error('Get balance sheet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy } = req.query;
    
    let query;
    let groupClause;
    
    if (groupBy === 'day') {
      groupClause = 'DATE(created_at)';
    } else if (groupBy === 'month') {
      groupClause = 'TO_CHAR(created_at, \'YYYY-MM\')';
    } else if (groupBy === 'year') {
      groupClause = 'EXTRACT(YEAR FROM created_at)';
    } else {
      groupClause = 'DATE(created_at)';
    }
    
    query = `
      SELECT ${groupClause} as period,
             COUNT(*) as order_count,
             COALESCE(SUM(total_amount), 0) as total_sales
      FROM orders
      WHERE status != 'cancelled'
      ${startDate && endDate ? 'AND DATE(created_at) BETWEEN $1 AND $2' : ''}
      GROUP BY ${groupClause}
      ORDER BY period DESC
    `;
    
    const params = startDate && endDate ? [startDate, endDate] : [];
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get sales report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getInventoryReport = async (req, res) => {
  try {
    const { godownId, categoryId } = req.query;
    
    let query = `
      SELECT p.id, p.name, p.brand, p.bottle_size, p.price, p.origin,
             c.name as category_name,
             COALESCE(SUM(pg.quantity), 0) as total_stock,
             COALESCE(SUM(pg.quantity * p.price), 0) as stock_value
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_godowns pg ON p.id = pg.product_id
      ${godownId ? 'WHERE pg.godown_id = $1' : ''}
      ${categoryId && godownId ? 'AND p.category_id = $2' : categoryId && !godownId ? 'WHERE p.category_id = $1' : ''}
      GROUP BY p.id, c.name
      ORDER BY total_stock ASC
    `;
    
    const params = [];
    if (godownId) params.push(godownId);
    if (categoryId) params.push(categoryId);
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get inventory report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLowStockReport = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;
    const products = await Product.getLowStock(threshold);
    res.json(products);
  } catch (error) {
    console.error('Get low stock report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCustomerReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.name, c.phone, c.company_name,
             COUNT(o.id) as order_count,
             COALESCE(SUM(o.total_amount), 0) as total_purchases,
             COALESCE(SUM(CASE WHEN pay.status = 'pending' THEN pay.amount ELSE 0 END), 0) as pending_amount,
             COALESCE(SUM(CASE WHEN pay.status = 'paid' THEN pay.amount ELSE 0 END), 0) as paid_amount
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      LEFT JOIN payments pay ON c.id = pay.customer_id
      GROUP BY c.id
      ORDER BY total_purchases DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get customer report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
