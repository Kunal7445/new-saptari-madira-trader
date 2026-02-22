import pool from '../config/db.js';

export const Customer = {
  async findAll() {
    const result = await pool.query(`
      SELECT c.*, 
        COALESCE(SUM(CASE WHEN pay.status = 'pending' THEN pay.amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN pay.status = 'paid' THEN pay.amount ELSE 0 END), 0) as paid_amount
      FROM customers c
      LEFT JOIN payments pay ON c.id = pay.customer_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(`
      SELECT c.*, 
        COALESCE(SUM(CASE WHEN pay.status = 'pending' THEN pay.amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN pay.status = 'paid' THEN pay.amount ELSE 0 END), 0) as paid_amount
      FROM customers c
      LEFT JOIN payments pay ON c.id = pay.customer_id
      WHERE c.id = $1
      GROUP BY c.id
    `, [id]);
    return result.rows[0];
  },

  async create(customerData) {
    const { name, phone, email, address, company_name } = customerData;
    const result = await pool.query(
      `INSERT INTO customers (name, phone, email, address, company_name) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, phone, email, address, company_name]
    );
    return result.rows[0];
  },

  async update(id, customerData) {
    const { name, phone, email, address, company_name } = customerData;
    const result = await pool.query(
      `UPDATE customers SET name = $1, phone = $2, email = $3, address = $4, company_name = $5 
       WHERE id = $6 RETURNING *`,
      [name, phone, email, address, company_name, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM customers WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  async search(searchTerm) {
    const result = await pool.query(`
      SELECT c.*, 
        COALESCE(SUM(CASE WHEN pay.status = 'pending' THEN pay.amount ELSE 0 END), 0) as pending_amount
      FROM customers c
      LEFT JOIN payments pay ON c.id = pay.customer_id
      WHERE c.name ILIKE $1 OR c.phone ILIKE $1 OR c.company_name ILIKE $1
      GROUP BY c.id
      ORDER BY c.name ASC
    `, [`%${searchTerm}%`]);
    return result.rows;
  }
};
