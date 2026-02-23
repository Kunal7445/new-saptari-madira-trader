import pool from './config/db.js';

async function runSeed() {
  try {
    console.log('Starting seed process...');
    
    // Check current customers count
    const customerCount = await pool.query('SELECT COUNT(*) FROM customers');
    console.log(`Current customers: ${customerCount.rows[0].count}`);
    
    // Insert more customers (only if less than 20)
    if (parseInt(customerCount.rows[0].count) < 20) {
      const customers = [
        ['Everest Hotel', '9841000005', 'everest@hotel.com', 'Lalitpur', 'Everest Hotels Pvt. Ltd.'],
        ['Mountain Bar', '9841000006', 'mountain@bar.com', 'Bhaktapur', 'Mountain Entertainment'],
        ['Sunrise Restaurant', '9841000007', 'sunrise@restaurant.com', 'Kavre', 'Sunrise Dining Co.'],
        ['Valley Wholesale', '9841000008', 'valley@wholesale.com', 'Lalitpur', 'Valley Traders'],
        ['Tara Hotel', '9841000009', 'tara@hotel.com', 'Pokhara', 'Tara Hospitality'],
        ['Friends Bar & Lounge', '9841000010', 'friends@lounge.com', 'Kathmandu', 'Friends Group'],
        ['Hotel Blue Star', '9841000011', 'bluestar@hotel.com', 'Birgunj', 'Blue Star Hotels'],
        ['Riverside Restaurant', '9841000012', 'riverside@restaurant.com', 'Chitwan', 'Riverside Dining'],
        ['City Center Bar', '9841000013', 'citycenter@bar.com', 'Kathmandu', 'City Center Entertainment'],
        ['Premier Wholesale', '9841000014', 'premier@wholesale.com', 'Rajbiraj', 'Premier Trading'],
        ['Hotel Grand', '9841000015', 'grand@hotel.com', 'Birtamode', 'Grand Hospitality'],
        ['Party Palace', '9841000016', 'partypalace@events.com', 'Lalitpur', 'Party Palace Events'],
        ['Club 97', '9841000017', 'club97@club.com', 'Pokhara', 'Club 97 Entertainment'],
        ['Royal Restaurant', '9841000018', 'royal@restaurant.com', 'Birgunj', 'Royal Dining'],
        ['Metro Bar', '9841000019', 'metro@bar.com', 'Kathmandu', 'Metro Nightclub']
      ];
      
      for (const c of customers) {
        await pool.query(
          'INSERT INTO customers (name, phone, email, address, company_name) VALUES ($1, $2, $3, $4, $5)',
          c
        );
      }
      console.log('Added 15 customers');
    }
    
    // Check current orders count
    const orderCount = await pool.query('SELECT COUNT(*) FROM orders');
    console.log(`Current orders: ${orderCount.rows[0].count}`);
    
    // Insert orders only if none exist
    if (parseInt(orderCount.rows[0].count) === 0) {
      const orders = [
        [1, 1, 45000, 'completed', '2024-01-01'],
        [2, 1, 28000, 'completed', '2024-01-03'],
        [3, 1, 52000, 'completed', '2024-01-05'],
        [4, 1, 35000, 'completed', '2024-01-08'],
        [1, 1, 18000, 'completed', '2024-01-10'],
        [5, 1, 42000, 'completed', '2024-01-12'],
        [6, 1, 25000, 'completed', '2024-01-15'],
        [7, 1, 68000, 'completed', '2024-01-18'],
        [2, 1, 32000, 'completed', '2024-01-20'],
        [8, 1, 45000, 'completed', '2024-01-22'],
        [9, 1, 28000, 'pending', '2024-01-25'],
        [10, 1, 55000, 'completed', '2024-01-27'],
        [4, 1, 38000, 'completed', '2024-01-29'],
        [11, 1, 62000, 'completed', '2024-02-01'],
        [12, 1, 24000, 'completed', '2024-02-03'],
        [3, 1, 48000, 'processing', '2024-02-05'],
        [13, 1, 36000, 'completed', '2024-02-08'],
        [14, 1, 52000, 'completed', '2024-02-10'],
        [5, 1, 29000, 'completed', '2024-02-12'],
        [15, 1, 44000, 'completed', '2024-02-15'],
        [6, 1, 58000, 'completed', '2024-02-18'],
        [7, 1, 33000, 'pending', '2024-02-20'],
        [8, 1, 46000, 'completed', '2024-02-22'],
        [9, 1, 27000, 'completed', '2024-02-25'],
        [10, 1, 51000, 'completed', '2024-02-27'],
        [1, 1, 39000, 'completed', '2024-03-01'],
        [2, 1, 23000, 'completed', '2024-03-03'],
        [11, 1, 57000, 'completed', '2024-03-05'],
        [12, 1, 31000, 'completed', '2024-03-08'],
        [13, 1, 49000, 'pending', '2024-03-10']
      ];
      
      for (const o of orders) {
        await pool.query(
          'INSERT INTO orders (customer_id, godown_id, total_amount, status, created_at) VALUES ($1, $2, $3, $4, $5)',
          o
        );
      }
      console.log('Added 30 orders');
      
      // Add order items for each order (product details)
      const orderItems = [
        // Order 1 - Johnnie Walker Black
        [1, 1, 10, 4500, 10, 12],
        // Order 2 - Grey Goose
        [2, 13, 8, 4500, 8, 12],
        // Order 3 - JW Black + Captain Morgan
        [3, 1, 6, 4500, 6, 12],
        [3, 18, 10, 1500, 10, 12],
        // Order 4 - Absolut Vodka
        [4, 14, 10, 3200, 10, 12],
        // Order 5 - Oaksmith Gold
        [5, 7, 12, 1500, 12, 12],
        // Order 6 - JW Black + Bombay Sapphire
        [6, 1, 8, 4500, 8, 12],
        [6, 16, 4, 2500, 4, 12],
        // Order 7 - Grey Goose
        [7, 13, 5, 4500, 5, 12],
        // Order 8 - JW Black + Kings Hill Wine
        [8, 1, 10, 4500, 10, 12],
        [8, 19, 8, 2200, 8, 12],
        // Order 9 - Absolut Vodka
        [9, 14, 10, 3200, 10, 12],
        // Order 10 - JW Black
        [10, 1, 10, 4500, 10, 12],
        // Order 11 - Oaksmith Gold (pending)
        [11, 7, 18, 1500, 18, 12],
        // Order 12 - JW Black + Captain Morgan
        [12, 1, 8, 4500, 8, 12],
        [12, 18, 10, 1500, 10, 12],
        // Order 13 - Absolut Vodka
        [13, 14, 12, 3200, 12, 12],
        // Order 14 - JW Black + Souverain Wine
        [14, 1, 10, 4500, 10, 12],
        [14, 20, 6, 2500, 6, 12],
        // Order 15 - Oaksmith Gold
        [15, 7, 16, 1500, 16, 12],
        // Order 16 - JW Black + Grey Goose (processing)
        [16, 1, 8, 4500, 8, 12],
        [16, 13, 4, 4500, 4, 12],
        // Order 17 - Absolut Vodka
        [17, 14, 10, 3200, 10, 12],
        // Order 18 - Captain Morgan
        [18, 18, 20, 1500, 20, 12],
        // Order 19 - JW Black + Bombay Sapphire
        [19, 1, 6, 4500, 6, 12],
        [19, 16, 4, 2500, 4, 12],
        // Order 20 - Oaksmith Gold
        [20, 7, 15, 1500, 15, 12],
        // Order 21 - JW Black + Kings Hill Wine
        [21, 1, 10, 4500, 10, 12],
        [21, 19, 6, 2200, 6, 12],
        // Order 22 - Absolut Vodka (pending)
        [22, 14, 10, 3200, 10, 12],
        // Order 23 - Grey Goose
        [23, 13, 8, 4500, 8, 12],
        // Order 24 - Oaksmith Gold
        [24, 7, 12, 1500, 12, 12],
        // Order 25 - JW Black + Captain Morgan
        [25, 1, 8, 4500, 8, 12],
        [25, 18, 10, 1500, 10, 12],
        // Order 26 - Absolut Vodka
        [26, 14, 12, 3200, 12, 12],
        // Order 27 - Oaksmith Gold
        [27, 7, 15, 1500, 15, 12],
        // Order 28 - JW Black + Bombay Sapphire
        [28, 1, 10, 4500, 10, 12],
        [28, 16, 6, 2500, 6, 12],
        // Order 29 - Captain Morgan
        [29, 18, 18, 1500, 18, 12],
        // Order 30 - JW Black (pending)
        [30, 1, 8, 4500, 8, 12]
      ];
      
      for (const item of orderItems) {
        await pool.query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price, carton_quantity, carton_size) VALUES ($1, $2, $3, $4, $5, $6)',
          item
        );
      }
      console.log('Added order items');
    }
    
    // Check current payments count
    const paymentCount = await pool.query('SELECT COUNT(*) FROM payments');
    console.log(`Current payments: ${paymentCount.rows[0].count}`);
    
    // Insert payments only if none exist - Link to completed orders
    if (parseInt(paymentCount.rows[0].count) === 0) {
      const payments = [
        // Completed orders have 'paid' status
        [1, 1, 45000, 'cash', 'paid', 'Full payment received', '2024-01-02'],
        [2, 2, 28000, 'bank_transfer', 'paid', 'Payment via bank', '2024-01-04'],
        [3, 3, 52000, 'cheque', 'paid', 'Cheque deposited', '2024-01-06'],
        [4, 4, 35000, 'cash', 'paid', 'Full payment', '2024-01-09'],
        [5, 1, 18000, 'bank_transfer', 'paid', 'Online transfer', '2024-01-11'],
        [6, 5, 42000, 'cash', 'paid', 'Full payment received', '2024-01-13'],
        [7, 6, 25000, 'credit', 'paid', 'Credit payment', '2024-01-16'],
        [8, 7, 68000, 'bank_transfer', 'paid', 'Bank transfer', '2024-01-19'],
        [9, 2, 32000, 'cash', 'paid', 'Cash payment', '2024-01-21'],
        [10, 8, 45000, 'cheque', 'paid', 'Cheque cleared', '2024-01-23'],
        // Pending orders have 'pending' status
        [11, 9, 28000, 'bank_transfer', 'pending', 'Awaiting confirmation', '2024-01-26'],
        // Completed orders
        [12, 10, 55000, 'cash', 'paid', 'Full payment', '2024-01-28'],
        [13, 4, 38000, 'credit', 'paid', 'Credit cleared', '2024-01-30'],
        [14, 11, 62000, 'bank_transfer', 'paid', 'Online transfer', '2024-02-02'],
        [15, 12, 24000, 'cash', 'paid', 'Cash received', '2024-02-04'],
        // Processing order - pending
        [16, 3, 48000, 'cheque', 'pending', 'Cheque under clearance', '2024-02-06'],
        // Completed orders
        [17, 13, 36000, 'bank_transfer', 'paid', 'Transfer complete', '2024-02-09'],
        [18, 14, 52000, 'cash', 'paid', 'Full payment', '2024-02-11'],
        [19, 5, 29000, 'credit', 'paid', 'Credit payment', '2024-02-13'],
        [20, 15, 44000, 'bank_transfer', 'paid', 'Online transfer', '2024-02-16'],
        [21, 6, 58000, 'cash', 'paid', 'Cash payment', '2024-02-19'],
        // Pending order
        [22, 7, 33000, 'cheque', 'pending', 'Awaiting clearance', '2024-02-21'],
        // Completed orders
        [23, 8, 46000, 'bank_transfer', 'paid', 'Transfer complete', '2024-02-23'],
        [24, 9, 27000, 'cash', 'paid', 'Cash received', '2024-02-26'],
        [25, 10, 51000, 'credit', 'paid', 'Credit payment', '2024-02-28'],
        [26, 1, 39000, 'bank_transfer', 'paid', 'Online transfer', '2024-03-02'],
        [27, 2, 23000, 'cash', 'paid', 'Cash payment', '2024-03-04'],
        [28, 11, 57000, 'cheque', 'paid', 'Cheque cleared', '2024-03-06'],
        [29, 12, 31000, 'bank_transfer', 'paid', 'Transfer complete', '2024-03-09'],
        // Pending order
        [30, 13, 49000, 'cash', 'pending', 'Awaiting payment', '2024-03-11']
      ];
      
      for (const p of payments) {
        await pool.query(
          'INSERT INTO payments (order_id, customer_id, amount, payment_method, status, notes, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          p
        );
      }
      console.log('Added 30 payments');
    }
    
    // Check current transactions count
    const transCount = await pool.query('SELECT COUNT(*) FROM transactions');
    console.log(`Current transactions: ${transCount.rows[0].count}`);
    
    // Insert transactions only if none exist
    if (parseInt(transCount.rows[0].count) === 0) {
      const transactions = [
        ['expense', 150000, 'Stock purchase - Whisky bulk order', 1, '2024-01-02'],
        ['expense', 80000, 'Stock purchase - Vodka order', 2, '2024-01-08'],
        ['expense', 120000, 'Stock purchase - Rum and Gin', 3, '2024-01-15'],
        ['expense', 200000, 'Stock purchase - Premium brands', 4, '2024-01-22'],
        ['expense', 95000, 'Stock purchase - Wine collection', 5, '2024-01-29'],
        ['expense', 180000, 'Stock purchase - Beer stock', 6, '2024-02-05'],
        ['expense', 75000, 'Stock purchase - Vodka restock', 7, '2024-02-12'],
        ['expense', 110000, 'Stock purchase - Mixed spirits', 8, '2024-02-19'],
        ['expense', 140000, 'Stock purchase - Whisky order', 9, '2024-02-26'],
        ['expense', 85000, 'Stock purchase - Gin and Wine', 10, '2024-03-04'],
        ['expense', 220000, 'Stock purchase - Premium spirits', 11, '2024-03-11'],
        ['income', 25000, 'Rental income - warehouse space', null, '2024-01-15'],
        ['income', 15000, 'Miscellaneous income', null, '2024-02-20'],
        ['expense', 35000, 'Transportation costs', null, '2024-01-10'],
        ['expense', 28000, 'Warehouse rent', null, '2024-02-01'],
        ['expense', 28000, 'Warehouse rent', null, '2024-03-01'],
        ['expense', 45000, 'Staff salaries', null, '2024-01-31'],
        ['expense', 45000, 'Staff salaries', null, '2024-02-29'],
        ['expense', 50000, 'Staff salaries', null, '2024-03-15'],
        ['expense', 15000, 'Utility bills', null, '2024-01-20'],
        ['expense', 12000, 'Utility bills', null, '2024-02-20'],
        ['expense', 18000, 'Utility bills', null, '2024-03-20'],
        ['expense', 8500, 'Maintenance costs', null, '2024-01-25'],
        ['expense', 12000, 'Maintenance costs', null, '2024-02-15'],
        ['expense', 9500, 'Maintenance costs', null, '2024-03-10'],
        ['expense', 20000, 'Marketing expenses', null, '2024-01-18'],
        ['expense', 25000, 'Marketing expenses', null, '2024-02-15'],
        ['expense', 15000, 'Marketing expenses', null, '2024-03-12'],
        ['expense', 10000, 'Insurance premium', null, '2024-01-05'],
        ['expense', 10000, 'Insurance premium', null, '2024-02-05']
      ];
      
      for (const t of transactions) {
        await pool.query(
          'INSERT INTO transactions (type, amount, description, reference_id, created_at) VALUES ($1, $2, $3, $4, $5)',
          t
        );
      }
      console.log('Added 30 transactions');
    }
    
    // Verify counts
    const finalCustomers = await pool.query('SELECT COUNT(*) FROM customers');
    const finalOrders = await pool.query('SELECT COUNT(*) FROM orders');
    const finalPayments = await pool.query('SELECT COUNT(*) FROM payments');
    const finalTransactions = await pool.query('SELECT COUNT(*) FROM transactions');
    const finalOrderItems = await pool.query('SELECT COUNT(*) FROM order_items');
    
    console.log('\n=== Final Counts ===');
    console.log(`Customers: ${finalCustomers.rows[0].count}`);
    console.log(`Orders: ${finalOrders.rows[0].count}`);
    console.log(`Order Items: ${finalOrderItems.rows[0].count}`);
    console.log(`Payments: ${finalPayments.rows[0].count}`);
    console.log(`Transactions: ${finalTransactions.rows[0].count}`);
    
    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

runSeed();
