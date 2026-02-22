import pool from '../config/db.js';

export const Order = {
  async findAll() {
    const result = await pool.query(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone,
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'brand', p.brand,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.quantity * oi.unit_price
          )
        ) as items
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id, c.name, c.phone
      ORDER BY o.created_at DESC
    `);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email,
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'brand', p.brand,
            'bottle_size', p.bottle_size,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.quantity * oi.unit_price
          )
        ) as items
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1
      GROUP BY o.id, c.name, c.phone, c.email
    `, [id]);
    return result.rows[0];
  },

  async create(orderData) {
    const { customer_id, items, godown_id, notes, total_amount, status = 'pending' } = orderData;
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (customer_id, godown_id, total_amount, status, notes) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [customer_id, godown_id, total_amount, status, notes]
      );
      const order = orderResult.rows[0];
      
      // Add order items and update stock
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
           VALUES ($1, $2, $3, $4)`,
          [order.id, item.product_id, item.quantity, item.unit_price]
        );
        
        // Reduce stock
        await client.query(
          `UPDATE product_godowns 
           SET quantity = quantity - $1 
           WHERE product_id = $2 AND godown_id = $3`,
          [item.quantity, item.product_id, godown_id]
        );
      }
      
      await client.query('COMMIT');
      return this.findById(order.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get order items to restore stock
      const itemsResult = await client.query(
        'SELECT product_id, quantity, godown_id FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE o.id = $1',
        [id]
      );
      
      // Restore stock
      for (const item of itemsResult.rows) {
        await client.query(
          'UPDATE product_godowns SET quantity = quantity + $1 WHERE product_id = $2 AND godown_id = $3',
          [item.quantity, item.product_id, item.godown_id]
        );
      }
      
      // Delete order items
      await client.query('DELETE FROM order_items WHERE order_id = $1', [id]);
      
      // Delete order
      const result = await client.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async getRecentOrders(limit = 10) {
    const result = await pool.query(`
      SELECT o.*, c.name as customer_name,
        json_agg(
          json_build_object(
            'product_name', p.name,
            'quantity', oi.quantity
          )
        ) as items
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id, c.name
      ORDER BY o.created_at DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  },

  async getOrdersByDateRange(startDate, endDate) {
    const result = await pool.query(`
      SELECT o.*, c.name as customer_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE DATE(o.created_at) BETWEEN $1 AND $2
      ORDER BY o.created_at DESC
    `, [startDate, endDate]);
    return result.rows;
  }
};
