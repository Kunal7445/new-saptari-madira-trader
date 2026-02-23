import pool from '../config/db.js';

export const Payment = {
  async findAll() {
    const result = await pool.query(`
      SELECT pay.*, c.name as customer_name, c.phone as customer_phone
      FROM payments pay
      LEFT JOIN customers c ON pay.customer_id = c.id
      ORDER BY pay.created_at DESC
    `);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(`
      SELECT pay.*, c.name as customer_name, c.phone as customer_phone
      FROM payments pay
      LEFT JOIN customers c ON pay.customer_id = c.id
      WHERE pay.id = $1
    `, [id]);
    return result.rows[0];
  },

  async findByCustomer(customerId) {
    const result = await pool.query(`
      SELECT pay.*, c.name as customer_name
      FROM payments pay
      LEFT JOIN customers c ON pay.customer_id = c.id
      WHERE pay.customer_id = $1
      ORDER BY pay.created_at DESC
    `, [customerId]);
    return result.rows;
  },

  async create(paymentData) {
    const { customer_id, amount, payment_method, reference_number, notes, status = 'pending' } = paymentData;
    const result = await pool.query(
      `INSERT INTO payments (customer_id, amount, payment_method, reference_number, notes, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [customer_id, amount, payment_method, reference_number, notes, status]
    );
    return result.rows[0];
  },

  async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM payments WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  async getPendingPayments() {
    const result = await pool.query(`
      SELECT pay.*, c.name as customer_name, c.phone as customer_phone
      FROM payments pay
      LEFT JOIN customers c ON pay.customer_id = c.id
      WHERE pay.status = 'pending'
      ORDER BY pay.created_at DESC
    `);
    return result.rows;
  },

  async getTotalPending() {
    const result = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total_pending
      FROM payments
      WHERE status = 'pending'
    `);
    return result.rows[0].total_pending;
  },

  async getTotalReceived() {
    const result = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total_received
      FROM payments
      WHERE status = 'paid'
    `);
    return result.rows[0].total_received;
  },

  async getPaymentsByDateRange(startDate, endDate) {
    const result = await pool.query(`
      SELECT pay.*, c.name as customer_name
      FROM payments pay
      LEFT JOIN customers c ON pay.customer_id = c.id
      WHERE DATE(pay.created_at) BETWEEN $1 AND $2
      ORDER BY pay.created_at DESC
    `, [startDate, endDate]);
    return result.rows;
  }
};
