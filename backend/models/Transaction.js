import pool from '../config/db.js';

export const Transaction = {
  async findAll() {
    const result = await pool.query(`
      SELECT t.*, u.name as user_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(`
      SELECT t.*, u.name as user_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = $1
    `, [id]);
    return result.rows[0];
  },

  async create(transactionData) {
    const { type, amount, description, reference_id, user_id, category } = transactionData;
    const result = await pool.query(
      `INSERT INTO transactions (type, amount, description, reference_id, user_id, category) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [type, amount, description, reference_id, user_id, category]
    );
    return result.rows[0];
  },

  async getByDateRange(startDate, endDate) {
    const result = await pool.query(`
      SELECT t.*, u.name as user_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE DATE(t.created_at) BETWEEN $1 AND $2
      ORDER BY t.created_at DESC
    `, [startDate, endDate]);
    return result.rows;
  },

  async getSummary(startDate, endDate) {
    const result = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as net_profit
      FROM transactions
      WHERE DATE(created_at) BETWEEN $1 AND $2
    `, [startDate, endDate]);
    return result.rows[0];
  },

  async getMonthlySummary(year, month) {
    const result = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
      FROM transactions
      WHERE EXTRACT(YEAR FROM created_at) = $1 AND EXTRACT(MONTH FROM created_at) = $2
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [year, month]);
    return result.rows;
  }
};
