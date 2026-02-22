import express from 'express';
import { 
  getDashboardStats, 
  getBalanceSheet, 
  getSalesReport, 
  getInventoryReport,
  getLowStockReport,
  getCustomerReport
} from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, getDashboardStats);
router.get('/balance-sheet', authenticateToken, getBalanceSheet);
router.get('/sales', authenticateToken, getSalesReport);
router.get('/inventory', authenticateToken, getInventoryReport);
router.get('/low-stock', authenticateToken, getLowStockReport);
router.get('/customers', authenticateToken, getCustomerReport);

export default router;
