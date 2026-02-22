import pool from '../config/db.js';

export const Product = {
  async findAll() {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name, c.id as category_id,
        COALESCE(
          json_agg(
            json_build_object(
              'godown_id', pg.godown_id,
              'godown_name', g.name,
              'quantity', pg.quantity
            )
          ) FILTER (WHERE pg.godown_id IS NOT NULL),
          '[]'
        ) as godowns,
        COALESCE(SUM(pg.quantity), 0) as total_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_godowns pg ON p.id = pg.product_id
      LEFT JOIN godowns g ON pg.godown_id = g.id
      GROUP BY p.id, c.name, c.id
      ORDER BY p.name ASC
    `);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name,
        COALESCE(
          json_agg(
            json_build_object(
              'godown_id', pg.godown_id,
              'godown_name', g.name,
              'quantity', pg.quantity
            )
          ) FILTER (WHERE pg.godown_id IS NOT NULL),
          '[]'
        ) as godowns,
        COALESCE(SUM(pg.quantity), 0) as total_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_godowns pg ON p.id = pg.product_id
      LEFT JOIN godowns g ON pg.godown_id = g.id
      WHERE p.id = $1
      GROUP BY p.id, c.name
    `, [id]);
    return result.rows[0];
  },

  async findByCategory(categoryId) {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name,
        COALESCE(SUM(pg.quantity), 0) as total_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_godowns pg ON p.id = pg.product_id
      WHERE p.category_id = $1
      GROUP BY p.id, c.name
      ORDER BY p.name ASC
    `, [categoryId]);
    return result.rows;
  },

  async create(productData) {
    const { name, brand, category_id, bottle_size, price, description, image_url, origin } = productData;
    const result = await pool.query(
      `INSERT INTO products (name, brand, category_id, bottle_size, price, description, image_url, origin) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, brand, category_id, bottle_size, price, description, image_url, origin]
    );
    return result.rows[0];
  },

  async update(id, productData) {
    const { name, brand, category_id, bottle_size, price, description, image_url, origin } = productData;
    const result = await pool.query(
      `UPDATE products 
       SET name = $1, brand = $2, category_id = $3, bottle_size = $4, 
           price = $5, description = $6, image_url = $7, origin = $8
       WHERE id = $9 RETURNING *`,
      [name, brand, category_id, bottle_size, price, description, image_url, origin, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  async updateStock(productId, godownId, quantity, isAddition = true) {
    // Check if product-godown relationship exists
    const checkResult = await pool.query(
      'SELECT * FROM product_godowns WHERE product_id = $1 AND godown_id = $2',
      [productId, godownId]
    );

    if (checkResult.rows.length === 0) {
      // Create new relationship
      await pool.query(
        'INSERT INTO product_godowns (product_id, godown_id, quantity) VALUES ($1, $2, $3)',
        [productId, godownId, quantity]
      );
    } else {
      // Update existing
      const query = isAddition
        ? 'UPDATE product_godowns SET quantity = quantity + $1 WHERE product_id = $2 AND godown_id = $3'
        : 'UPDATE product_godowns SET quantity = quantity - $1 WHERE product_id = $2 AND godown_id = $3';
      
      await pool.query(query, [quantity, productId, godownId]);
    }
  },

  async getLowStock(threshold = 10) {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name,
        COALESCE(SUM(pg.quantity), 0) as total_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_godowns pg ON p.id = pg.product_id
      GROUP BY p.id, c.name
      HAVING COALESCE(SUM(pg.quantity), 0) < $1
      ORDER BY total_stock ASC
    `, [threshold]);
    return result.rows;
  },

  async getTotalStockValue() {
    const result = await pool.query(`
      SELECT COALESCE(SUM(p.price * pg.quantity), 0) as total_value,
             COALESCE(SUM(pg.quantity), 0) as total_quantity
      FROM products p
      JOIN product_godowns pg ON p.id = pg.product_id
    `);
    return result.rows[0];
  },

  async search(searchTerm) {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name,
        COALESCE(SUM(pg.quantity), 0) as total_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_godowns pg ON p.id = pg.product_id
      WHERE p.name ILIKE $1 OR p.brand ILIKE $1 OR c.name ILIKE $1
      GROUP BY p.id, c.name
      ORDER BY p.name ASC
    `, [`%${searchTerm}%`]);
    return result.rows;
  }
};
