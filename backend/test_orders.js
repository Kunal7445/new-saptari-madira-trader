import pool from './config/db.js';

async function testOrders() {
  try {
    const result = await pool.query(`
      SELECT o.id, o.customer_id, o.total_amount, o.status, o.created_at, c.name as customer_name
      FROM orders o 
      JOIN customers c ON o.customer_id = c.id 
      ORDER BY o.created_at DESC 
      LIMIT 5
    `);
    console.log('Orders:', JSON.stringify(result.rows, null, 2));
    
    // Check order items
    const itemsResult = await pool.query(`
      SELECT oi.order_id, oi.product_id, oi.quantity, oi.unit_price, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LIMIT 10
    `);
    console.log('Order Items:', JSON.stringify(itemsResult.rows, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testOrders();
