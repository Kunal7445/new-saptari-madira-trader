import pool from '../config/db.js';

export const Godown = {
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM godowns ORDER BY name ASC'
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM godowns WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async create(godownData) {
    const { name, location, capacity, description } = godownData;
    const result = await pool.query(
      'INSERT INTO godowns (name, location, capacity, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, location, capacity, description]
    );
    return result.rows[0];
  },

  async update(id, godownData) {
    const { name, location, capacity, description } = godownData;
    const result = await pool.query(
      'UPDATE godowns SET name = $1, location = $2, capacity = $3, description = $4 WHERE id = $5 RETURNING *',
      [name, location, capacity, description, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM godowns WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  async getProductCount(id) {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM product_godowns WHERE godown_id = $1',
      [id]
    );
    return parseInt(result.rows[0].count);
  }
};
