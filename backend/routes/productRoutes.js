import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  updateStock,
  getStockSummary 
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes - get products without auth
router.get('/', getAllProducts);
router.get('/stock-summary', getStockSummary);
router.get('/:id', getProductById);

// Protected routes - modify products
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);
router.put('/stock/update', authenticateToken, updateStock);

export default router;
