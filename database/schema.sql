-- New Saptari Madira Trader - PostgreSQL Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for admin authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Godowns table (storage locations) - Single godown only
CREATE TABLE godowns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    capacity INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table - with carton_size field
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    bottle_size VARCHAR(50),
    carton_size INTEGER DEFAULT 12,
    price DECIMAL(12, 2) NOT NULL,
    price_per_carton DECIMAL(12, 2),
    description TEXT,
    image_url TEXT,
    origin VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product-Godown junction table (for stock tracking per godown)
CREATE TABLE product_godowns (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    godown_id INTEGER REFERENCES godowns(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, godown_id)
);

-- Customers table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    company_name VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    godown_id INTEGER REFERENCES godowns(id) ON DELETE SET NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items table - with carton fields
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    carton_quantity INTEGER,
    carton_size INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    reference_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default category
INSERT INTO categories (name, description) VALUES 
('Whisky', 'Scotch, Irish, and other whiskies'),
('Vodka', 'Premium and standard vodkas'),
('Rum', 'White, dark, and flavored rums'),
('Gin', 'Premium and craft gins'),
('Wine', 'Red, white, and sparkling wines'),
('Beer', 'Imported and local beers'),
('Brandy', 'Cognac, armagnac and brandy varieties'),
('Other', 'Other alcohol beverages');

-- Insert default single godown
INSERT INTO godowns (name, location, capacity, description) VALUES 
('Main Warehouse', 'Rajbiraj, Saptari', 10000, 'Primary storage facility for all products');

-- Insert sample products with carton sizes (750ml=12, 375ml=24, 180ml=60)
INSERT INTO products (name, brand, category_id, bottle_size, carton_size, price, price_per_carton, origin, description) VALUES 
('Johnnie Walker Black Label', 'Johnnie Walker', 1, '750ml', 12, 4500, 4500, 'Scotland', 'Premium blended Scotch whisky'),
('Johnnie Walker Blue Label', 'Johnnie Walker', 1, '750ml', 12, 12500, 12500, 'Scotland', 'Premium blended Scotch whisky'),
('Johnnie Walker Red Label', 'Johnnie Walker', 1, '750ml', 12, 2800, 2800, 'Scotland', 'Premium blended Scotch whisky'),
("Jack Daniel's Old No.7", "Jack Daniel's", 1, '750ml', 12, 3200, 3200, 'USA', 'Tennessee whiskey'),
('Jameson Irish Whiskey', 'Jameson', 1, '750ml', 12, 2800, 2800, 'Ireland', 'Irish whiskey'),
('Kala Patthar Whisky', 'Kala Patthar', 1, '750ml', 12, 1200, 1200, 'Nepal', 'Nepali whisky'),
('Oaksmith Gold', 'Oaksmith', 1, '750ml', 12, 1500, 1500, 'India', 'Premium Indian whisky'),
('Old Durbar Whisky', 'Old Durbar', 1, '750ml', 12, 1800, 1800, 'Nepal', 'Nepali whisky'),
('Signature Premium Whisky', 'Signature', 1, '750ml', 12, 950, 950, 'India', 'Indian whisky'),
('VAT 69 Whisky', 'VAT 69', 1, '750ml', 12, 1100, 1100, 'Scotland', 'Blended Scotch whisky'),
('Black Oak Whisky', 'Black Oak', 1, '750ml', 12, 1400, 1400, 'India', 'Indian whisky'),
('Royal Stag', 'Royal Stag', 1, '750ml', 12, 2800, 2800, 'India', 'Premium Indian whisky'),
('Grey Goose', 'Grey Goose', 2, '750ml', 12, 4500, 4500, 'France', 'Premium French vodka'),
('Absolut Vodka', 'Absolut', 2, '750ml', 12, 3200, 3200, 'Sweden', 'Premium Swedish vodka'),
('Ruslan Vodka', 'Ruslan', 2, '750ml', 12, 1800, 1800, 'Russia', 'Russian vodka'),
('Bombay Sapphire', 'Bombay Sapphire', 4, '750ml', 12, 2500, 2500, 'England', 'Premium gin'),
('Tanqueray', 'Tanqueray', 4, '750ml', 12, 2800, 2800, 'Scotland', 'Premium gin'),
('Captain Morgan', 'Captain Morgan', 3, '750ml', 12, 1500, 1500, 'Jamaica', 'Spiced rum'),
('Bacardi White', 'Bacardi', 3, '750ml', 12, 1400, 1400, 'Cuba', 'White rum'),
('Kings Hill Red Wine', 'Kings Hill', 5, '750ml', 12, 2200, 2200, 'Chile', 'Red wine'),
('Souverain Wine', 'Souverain', 5, '750ml', 12, 2500, 2500, 'France', 'Red wine'),
('Tuborg Beer', 'Tuborg', 6, '500ml', 24, 350, 8400, 'Denmark', 'Premium lager'),
('Carlsberg Beer', 'Carlsberg', 6, '500ml', 24, 320, 7680, 'Denmark', 'Premium lager');

-- Insert stock for each product in godown 1
INSERT INTO product_godowns (product_id, godown_id, quantity)
SELECT p.id, 1, (RANDOM() * 100 + 20)::INTEGER
FROM products p;

-- Insert sample customers
INSERT INTO customers (name, phone, email, address, company_name) VALUES 
('ABC Restaurant', '9841000001', 'abc@restaurant.com', 'Kathmandu', 'ABC Restaurant Pvt. Ltd.'),
('XYZ Bar & Grill', '9841000002', 'xyz@bar.com', 'Pokhara', 'XYZ Entertainment'),
('Hotel Paradise', '9841000003', 'paradise@hotel.com', 'Birgunj', 'Paradise Hotels'),
('City Wholesale', '9841000004', 'city@wholesale.com', 'Rajbiraj', 'City Trading Co.');

-- Create indexes for better query performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_product_godowns_product ON product_godowns(product_id);
CREATE INDEX idx_product_godowns_godown ON product_godowns(godown_id);
