import pool from './config/db.js';

async function addOrderItems() {
  try {
    // Check if order_items already has data
    const count = await pool.query('SELECT COUNT(*) FROM order_items');
    console.log('Current order_items:', count.rows[0].count);
    
    if (parseInt(count.rows[0].count) === 0) {
      // Get all orders
      const orders = await pool.query('SELECT id FROM orders');
      console.log('Total orders:', orders.rows.length);
      
      // Add order items using valid product IDs (1-10 exist in database)
      const orderItems = [
        // Order 1 - JW Black + Captain Morgan
        [1, 1, 10, 4500],
        [1, 7, 5, 1500],
        // Order 2 - JW Blue + Grey Goose
        [2, 2, 6, 9000],
        [2, 5, 8, 4500],
        // Order 3 - JW Black + Bombay Sapphire
        [3, 1, 8, 4500],
        [3, 9, 4, 2500],
        // Order 4 - Royal Stag + Bacardi
        [4, 4, 10, 1200],
        [4, 8, 5, 1800],
        // Order 5 - Captain Morgan
        [5, 7, 12, 1500],
        // Order 6 - JW Black + Captain Morgan
        [6, 1, 6, 4500],
        [6, 7, 8, 1500],
        // Order 7 - Grey Goose
        [7, 5, 12, 4500],
        // Order 8 - JW Black + Absolut
        [8, 1, 8, 4500],
        [8, 6, 6, 3200],
        // Order 9 - Royal Stag
        [9, 4, 8, 1200],
        // Order 10 - JW Black
        [10, 1, 10, 4500],
        // Order 11 - Captain Morgan (pending)
        [11, 7, 15, 1500],
        // Order 12 - JW Black + Jack Daniel's
        [12, 1, 5, 4500],
        [12, 3, 6, 3800],
        // Order 13 - Absolut Vodka
        [13, 6, 12, 3200],
        // Order 14 - JW Black
        [14, 1, 8, 4500],
        // Order 15 - Captain Morgan
        [15, 7, 20, 1500],
        // Order 16 - JW Black (processing)
        [16, 1, 10, 4500],
        // Order 17 - Grey Goose
        [17, 5, 8, 4500],
        // Order 18 - Captain Morgan
        [18, 7, 15, 1500],
        // Order 19 - Bombay Sapphire
        [19, 9, 10, 2500],
        // Order 20 - Captain Morgan
        [20, 7, 18, 1500],
        // Order 21 - JW Black
        [21, 1, 6, 4500],
        // Order 22 - Absolut Vodka (pending)
        [22, 6, 10, 3200],
        // Order 23 - Grey Goose
        [23, 5, 12, 4500],
        // Order 24 - Captain Morgan
        [24, 7, 22, 1500],
        // Order 25 - JW Black
        [25, 1, 9, 4500],
        // Order 26 - Royal Stag
        [26, 4, 14, 1200],
        // Order 27 - Captain Morgan
        [27, 7, 16, 1500],
        // Order 28 - JW Black + Tanqueray
        [28, 1, 11, 4500],
        [28, 10, 5, 2800],
        // Order 29 - Jack Daniel's
        [29, 3, 20, 3800],
        // Order 30 - JW Black (pending)
        [30, 1, 12, 4500]
      ];
      
      for (const item of orderItems) {
        await pool.query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
          item
        );
      }
      console.log('Added order items');
    }
    
    const finalCount = await pool.query('SELECT COUNT(*) FROM order_items');
    console.log('Final order_items:', finalCount.rows[0].count);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addOrderItems();
