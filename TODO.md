# TODO List for Changes

## 1. Database Updates
- [ ] Update schema.sql - add carton_size field to products table
- [ ] Update Product model - handle carton_size

## 2. Backend Updates
- [ ] Update productController.js - handle carton_size
- [ ] Update orderController.js - handle cartons, email bills
- [ ] Create emailService.js for sending bills

## 3. Frontend Updates
- [ ] Update Order.jsx - change to cartons, generate bill
- [ ] Update Inventory.jsx - remove godown selection, show cartons
- [ ] Update App.jsx - remove godown routes from sidebar

## 4. Testing
- [ ] Test order placement with cartons
- [ ] Test inventory management
- [ ] Test bill generation and email
