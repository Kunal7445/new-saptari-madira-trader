import { Order } from '../models/Order.js';
import pool from '../config/db.js';
import { sendOrderEmail } from '../services/emailService.js';

export const getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    let orders;
    if (startDate && endDate) {
      orders = await Order.getOrdersByDateRange(startDate, endDate);
    } else {
      orders = await Order.findAll();
    }
    
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createOrder = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { customer_name, customer_phone, customer_email, customer_address, items, notes } = req.body;
    const godown_id = 1;
    
    await client.query('BEGIN');
    
    let customer;
    if (customer_phone) {
      const existingCustomer = await client.query(
        'SELECT * FROM customers WHERE phone = $1',
        [customer_phone]
      );
      
      if (existingCustomer.rows.length > 0) {
        customer = existingCustomer.rows[0];
        await client.query(
          'UPDATE customers SET name = $1, email = $2, address = $3 WHERE id = $4',
          [customer_name, customer_email, customer_address, customer.id]
        );
      } else {
        const newCustomer = await client.query(
          'INSERT INTO customers (name, phone, email, address) VALUES ($1, $2, $3, $4) RETURNING *',
          [customer_name, customer_phone, customer_email, customer_address]
        );
        customer = newCustomer.rows[0];
      }
    } else {
      const newCustomer = await client.query(
        'INSERT INTO customers (name, phone, email, address) VALUES ($1, $2, $3, $4) RETURNING *',
        [customer_name, customer_phone || null, customer_email, customer_address]
      );
      customer = newCustomer.rows[0];
    }
    
    let total_amount = 0;
    for (const item of items) {
      total_amount += item.price_per_carton * item.carton_quantity;
    }
    
    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, godown_id, total_amount, status, notes) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [customer.id, godown_id, total_amount, 'pending', notes]
    );
    const order = orderResult.rows[0];
    
    const orderItems = [];
    for (const item of items) {
      const productResult = await client.query(
        'SELECT * FROM products WHERE id = $1',
        [item.product_id]
      );
      const product = productResult.rows[0];
      const carton_size = product.carton_size || 12;
      const bottles = item.carton_quantity * carton_size;
      
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, carton_quantity, carton_size) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.product_id, bottles, item.price_per_carton, item.carton_quantity, carton_size]
      );
      
      await client.query(
        `UPDATE product_godowns SET quantity = quantity - $1 WHERE product_id = $2 AND godown_id = $3`,
        [bottles, item.product_id, godown_id]
      );
      
      orderItems.push({
        product_id: item.product_id,
        product_name: product.name,
        bottle_size: product.bottle_size,
        carton_quantity: item.carton_quantity,
        carton_size: carton_size,
        bottles: bottles,
        unit_price: item.price_per_carton,
        total_price: item.price_per_carton * item.carton_quantity
      });
    }
    
    await client.query('COMMIT');
    
    const fullOrder = await Order.findById(order.id);
    
    const customerInfo = {
      name: customer_name,
      phone: customer_phone,
      email: customer_email,
      address: customer_address
    };
    sendOrderEmail(fullOrder, customerInfo, orderItems).catch(err => 
      console.error('Email sending failed:', err)
    );
    
    res.status(201).json({
      message: 'Order created successfully',
      order: fullOrder
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  } finally {
    client.release();
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.updateStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.delete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const orders = await Order.getRecentOrders(limit);
    res.json(orders);
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
