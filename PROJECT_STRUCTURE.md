# New Saptari Madira Trader - Full Stack Application

## Project Structure

```
New_Saptari_Madira_Trader/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── godownController.js
│   │   ├── orderController.js
│   │   ├── customerController.js
│   │   ├── paymentController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Godown.js
│   │   ├── Order.js
│   │   ├── Customer.js
│   │   ├── Payment.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── godownRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── reportRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── pdfGenerator.js
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── Table.jsx
│   │   │   ├── public/
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── AboutSection.jsx
│   │   │   │   └── ContactForm.jsx
│   │   │   └── admin/
│   │   │       ├── Sidebar.jsx
│   │   │       ├── StatsCard.jsx
│   │   │       ├── ProductForm.jsx
│   │   │       ├── OrderTable.jsx
│   │   │       └── PaymentModal.jsx
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── About.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── Order.jsx
│   │   │   │   ├── Contact.jsx
│   │   │   │   └── Login.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Inventory.jsx
│   │   │       ├── Products.jsx
│   │   │       ├── Orders.jsx
│   │   │       ├── Customers.jsx
│   │   │       ├── Payments.jsx
│   │   │       ├── Godowns.jsx
│   │   │       ├── Reports.jsx
│   │   │       └── BalanceSheet.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   └── orderService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── database/
│   └── schema.sql
│
└── README.md
