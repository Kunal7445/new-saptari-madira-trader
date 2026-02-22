import { Payment } from '../models/Payment.js';

export const getAllPayments = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    let payments;
    if (startDate && endDate) {
      payments = await Payment.getPaymentsByDateRange(startDate, endDate);
    } else {
      payments = await Payment.findAll();
    }
    
    // Filter by status if provided
    if (status) {
      payments = payments.filter(payment => payment.status === status);
    }
    
    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPaymentsByCustomer = async (req, res) => {
  try {
    const payments = await Payment.findByCustomer(req.params.customerId);
    res.json(payments);
  } catch (error) {
    console.error('Get customer payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json({
      message: 'Payment created successfully',
      payment
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.updateStatus(req.params.id, status);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({
      message: 'Payment status updated successfully',
      payment
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.delete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.getPendingPayments();
    res.json(payments);
  } catch (error) {
    console.error('Get pending payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPaymentSummary = async (req, res) => {
  try {
    const totalPending = await Payment.getTotalPending();
    const totalReceived = await Payment.getTotalReceived();
    
    res.json({
      totalPending: parseFloat(totalPending),
      totalReceived: parseFloat(totalReceived),
      netBalance: parseFloat(totalReceived) - parseFloat(totalPending)
    });
  } catch (error) {
    console.error('Get payment summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
