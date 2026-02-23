import nodemailer from 'nodemailer';

// Create transporter (configure with your email provider)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Admin email for receiving order copies
const ADMIN_EMAIL = 'admin@saptarimadira.com';

const generateBillHTML = (order, customer, items) => {
  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">${item.product_name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">${item.bottle_size || 'N/A'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">${item.carton_quantity} cartons</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">${item.bottles || (item.carton_quantity * (item.carton_size || 12))} bottles</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">Rs. ${item.unit_price.toLocaleString()}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">Rs. ${item.total_price.toLocaleString()}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #333; color: white; padding: 12px; text-align: left; }
        .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Saptari Madira Trader</h1>
          <p>Order Confirmation</p>
        </div>
        <div class="content">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> #${order.id}</p>
          <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-GB', { 
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
          })}</p>
          
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${customer.name}</p>
          <p><strong>Phone:</strong> ${customer.phone || 'N/A'}</p>
          <p><strong>Email:</strong> ${customer.email || 'N/A'}</p>
          ${customer.address ? `<p><strong>Address:</strong> ${customer.address}</p>` : ''}
          
          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Cartons</th>
                <th>Bottles</th>
                <th>Price/Carton</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <p class="total">Total Amount: Rs. ${order.total_amount.toLocaleString()}</p>
          
          ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
        </div>
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>New Saptari Madira Trader | Rajbiraj, Saptari</p>
          <p>Phone: 984-XXXXXXX | Email: info@saptarimadira.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendOrderEmail = async (order, customer, items) => {
  const billHTML = generateBillHTML(order, customer, items);
  
  // Email to customer
  if (customer.email) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || '"New Saptari Madira Trader" <your-email@gmail.com>',
        to: customer.email,
        subject: `Order Confirmation - #${order.id} | New Saptari Madira Trader`,
        html: billHTML
      });
      console.log('Customer email sent successfully');
    } catch (error) {
      console.error('Error sending customer email:', error);
    }
  }
  
  // Email to admin
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || '"New Saptari Madira Trader" <your-email@gmail.com>',
      to: ADMIN_EMAIL,
      subject: `New Order Received - #${order.id} | ${customer.name}`,
      html: billHTML
    });
    console.log('Admin email sent successfully');
  } catch (error) {
    console.error('Error sending admin email:', error);
  }
  
  return true;
};

export default { sendOrderEmail };
