# New Saptari Madira Trader

A production-ready full-stack web application for alcohol distribution and inventory management in Nepal.

## Business Overview

- **Business Name**: New Saptari Madira Trader
- **Location**: Rajbiraj, Saptari, Nepal
- **Type**: Alcohol distribution and wholesale
- **Operating Since**: 20+ years
- **Purpose**: Internal business inventory and accounting (NOT for public online sales)

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React.js (Vite)
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios
- React Hot Toast

## Features

### Public Pages
- **Home**: Hero section, business intro, alcohol categories, about, contact
- **About**: Company history, vision & mission, godown info
- **Products**: Categories (Whisky, Rum, Vodka, Gin), product listings
- **Order**: Order placement form for customers
- **Contact**: Address, phone, email, contact form

### Admin Dashboard (Login Required)
- Dashboard with statistics
- Inventory Management (Add/Edit/Delete products, stock tracking)
- Order Management (View, update status, delete orders)
- Customer Management
- Payment Tracking (Pending/Paid status)
- Godown Management (Multiple storage locations)
- Balance Sheet (Financial overview)
- Reports (PDF & Excel export)

## Project Structure

```
New_Saptari_Madira_Trader/
├── backend/                 # Express.js API server
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── server.js           # Entry point
│   └── package.json
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/     # API services
│   │   └── App.jsx       # Main app component
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── schema.sql         # PostgreSQL schema
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation & Setup

### 1. Database Setup

1. Install PostgreSQL from https://www.postgresql.org/download/
2. Create a new database:
   
```
sql
   CREATE DATABASE saptari_madira_trader;
   
```
3. Run the SQL schema:
   
```
bash
   psql -U postgres -d saptari_madira_trader -f database/schema.sql
   
```

### 2. Backend Setup

```
bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# - DB_HOST=localhost
# - DB_PORT=5432
# - DB_NAME=saptari_madira_trader
# - DB_USER=postgres
# - DB_PASSWORD=your_password

# Start the server
npm run dev
```

The backend will run on http://localhost:5000

### 3. Frontend Setup

```
bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on http://localhost:5173

## Default Login

After running the database schema, create an admin user:

```
sql
-- Insert admin user (password will be: admin123)
-- You'll need to use a bcrypt generator to create the hash
```

Or use the registration endpoint to create your first admin account.

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Register
- GET `/api/auth/me` - Get current user

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create product
- PUT `/api/products/:id` - Update product
- DELETE `/api/products/:id` - Delete product
- GET `/api/products/category/:categoryId` - Get products by category
- GET `/api/products/low-stock` - Get low stock products

### Categories
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create category
- PUT `/api/categories/:id` - Update category
- DELETE `/api/categories/:id` - Delete category

### Godowns
- GET `/api/godowns` - Get all godowns
- POST `/api/godowns` - Create godown
- PUT `/api/godowns/:id` - Update godown
- DELETE `/api/godowns/:id` - Delete godown

### Orders
- GET `/api/orders` - Get all orders
- GET `/api/orders/:id` - Get order by ID
- POST `/api/orders` - Create order
- PUT `/api/orders/:id/status` - Update order status
- DELETE `/api/orders/:id` - Delete order

### Customers
- GET `/api/customers` - Get all customers
- POST `/api/customers` - Create customer
- PUT `/api/customers/:id` - Update customer
- DELETE `/api/customers/:id` - Delete customer

### Payments
- GET `/api/payments` - Get all payments
- POST `/api/payments` - Record payment
- PUT `/api/payments/:id/status` - Update payment status

### Reports
- GET `/api/reports/sales` - Sales report
- GET `/api/reports/inventory` - Inventory report
- GET `/api/reports/balance-sheet` - Balance sheet
- GET `/api/reports/customers` - Customer report

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saptari_madira_trader
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## Building for Production

### Frontend
```
bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

### Backend
```
bash
cd backend
npm start
```

## Design Features

- Modern dark theme with glassmorphism effects
- Smooth Framer Motion animations
- Responsive design (mobile, tablet, desktop)
- Professional wholesale business look
- Sidebar navigation in admin dashboard
- Clean tables with search & filter functionality

## License

This project is for internal business use only.
