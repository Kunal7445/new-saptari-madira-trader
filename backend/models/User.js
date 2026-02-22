import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const User = {
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async create(userData) {
    const { name, email, password, role = 'admin' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, hashedPassword, role]
    );
    return result.rows[0];
  },

  async update(id, userData) {
    const { name, email, password } = userData;
    let query = 'UPDATE users SET name = $1, email = $2';
    const params = [name, email];
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = $3';
      params.push(hashedPassword);
    }
    
    query += ' WHERE id = $' + (params.length + 1) + ' RETURNING id, name, email, role, created_at';
    params.push(id);
    
    const result = await pool.query(query, params);
    return result.rows[0];
  },

  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
};
