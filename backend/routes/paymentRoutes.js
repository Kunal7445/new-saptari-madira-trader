import express from 'express';
import { 
  getAllPayments, 
  getPaymentById, 
  getPaymentsByCustomer,
  createPayment, 
  updatePaymentStatus, 
  deletePayment,
  getPendingPayments,
  getPaymentSummary
} from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllPayments);
router.get('/pending', getPendingPayments);
router.get('/summary', getPaymentSummary);
router.get('/customer/:customerId', getPaymentsByCustomer);
router.get('/:id', getPaymentById);
router.post('/', authenticateToken, createPayment);
router.put('/:id/status', authenticateToken, updatePaymentStatus);
router.delete('/:id', authenticateToken, deletePayment);

export default router;
