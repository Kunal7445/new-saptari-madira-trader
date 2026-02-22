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

-- Godowns table (storage locations)
CREATE TABLE godowns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    capacity INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    bottle_size VARCHAR(50),
    price DECIMAL(12, 2) NOT NULL,
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

-- Order Items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash',
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table (for balance sheet)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    reference_id INTEGER,
    reference_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@saptarimadira.com', '$2a$10$YourHashedPasswordHere', 'admin');

-- Insert default categories
INSERT INTO categories (name, description) VALUES 
('Whisky', 'Scotch, Bourbon, and other whisky varieties'),
('Vodka', 'Premium and regular vodka brands'),
('Rum', 'White, dark, and spiced rum'),
('Gin', 'Premium gin brands'),
('Beer', 'Various beer brands'),
('Wine', 'Red, white, and sparkling wines'),
('Brandy', 'Cognac and brandy varieties'),
('Other', 'Other alcohol beverages');

-- Insert default godowns
INSERT INTO godowns (name, location, capacity, description) VALUES 
('Main Warehouse', 'Rajbiraj, Saptari', 10000, 'Primary storage facility for all products'),
('Distribution Center', 'Birgunj, Parsa', 8000, 'Regional distribution hub for western region'),
('Regional Hub', 'Itahari, Sunsari', 6000, 'Eastern region storage facility');

-- Insert sample products
INSERT INTO products (name, brand, category_id, bottle_size, price, origin, description) VALUES 
('Johnnie Walker Black Label', 'Johnnie Walker', 1, '750ml', 4500, 'Scotland', 'Premium blended Scotch whisky'),
('Johnnie Walker Blue Label', 'Johnnie Walker', 1, '750ml', 12500, 'Scotland', 'Premium blended Scotch whisky'),
('Jack Daniel''s Old No.7', 'Jack Daniel''s', 1, '750ml', 3600, 'USA', 'Tennessee whiskey'),
('Royal Stag', 'Royal Stag', 1, '750ml', 1200, 'India', 'Premium Indian whisky'),
('Grey Goose', 'Grey Goose', 2, '750ml', 4500, 'France', 'Premium French vodka'),
('Absolut Vodka', 'Absolut', 2, '750ml', 3200, 'Sweden', 'Premium Swedish vodka'),
('Captain Morgan', 'Captain Morgan', 3, '750ml', 1500, 'Jamaica', 'Spiced rum'),
('Bacardi White', 'Bacardi', 3, '750ml', 1400, 'Cuba', 'White rum'),
('Bombay Sapphire', 'Bombay Sapphire', 4, '750ml', 2200, 'England', 'Premium gin'),
('Tanqueray', 'Tanqueray', 4, '750ml', 2800, 'Scotland', 'Premium gin');

-- Insert sample customers
INSERT INTO customers (name, phone, email, address, company_name) VALUES 
('ABC Restaurant', '9841XXXXXX', 'abc@restaurant.com', 'Kathmandu', 'ABC Restaurant Pvt. Ltd.'),
('XYZ Bar & Grill', '9842XXXXXX', 'xyz@bar.com', 'Pokhara', 'XYZ Entertainment'),
('Hotel Paradise', '9843XXXXXX', 'paradise@hotel.com', 'Birgunj', 'Paradise Hotels'),
('City Wholesale', '9844XXXXXX', 'city@wholesale.com', 'Rajbiraj', 'City Trading Co.');

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
