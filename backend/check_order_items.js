import pool from './config/db.js';

async function checkColumns() {
  const result = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'order_items'");
  console.log('Order items columns:', result.rows);
}

checkColumns();
