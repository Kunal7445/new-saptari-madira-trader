import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiPlus, FiDollarSign, FiCheck, FiClock } from 'react-icons/fi';
import { paymentService, customerService } from '../../services/orderService';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ customer_id: '', amount: '', payment_method: 'cash', notes: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [paymentsData, customersData] = await Promise.all([paymentService.getAllPayments(), customerService.getAllCustomers()]);
      setPayments(paymentsData); setCustomers(customersData);
    } catch (error) {
      setPayments([
        { id: 1, customer_name: 'ABC Restaurant', amount: 25000, status: 'paid', payment_method: 'bank_transfer', created_at: '2024-01-15' },
        { id: 2, customer_name: 'XYZ Bar & Grill', amount: 45000, status: 'pending', payment_method: 'cheque', created_at: '2024-01-14' },
        { id: 3, customer_name: 'City Wholesale', amount: 85000, status: 'pending', payment_method: 'bank_transfer', created_at: '2024-01-13' },
      ]);
      setCustomers([{ id: 1, name: 'ABC Restaurant' }, { id: 2, name: 'XYZ Bar & Grill' }, { id: 3, name: 'City Wholesale' }]);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await paymentService.createPayment(formData);
      toast.success('Payment recorded successfully');
      setShowModal(false); setFormData({ customer_id: '', amount: '', payment_method: 'cash', notes: '' });
      fetchData();
    } catch (error) { toast.error('Failed to record payment'); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await paymentService.updatePaymentStatus(id, status);
      toast.success(`Payment ${status}`);
      fetchData();
    } catch (error) { toast.error('Failed to update'); }
  };

  const filteredPayments = payments.filter(p => p.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalReceived = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white">Payments</h1><p className="text-gray-400 mt-1">Track customer payments</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"><FiPlus className="mr-2" />Record Payment</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-dark rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Received</p><p className="text-2xl font-bold text-green-500">Rs. {(totalReceived / 100000).toFixed(1)}L</p></div><FiDollarSign className="text-green-500 text-2xl" /></div></div>
        <div className="glass-dark rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Pending</p><p className="text-2xl font-bold text-yellow-500">Rs. {(totalPending / 100000).toFixed(1)}L</p></div><FiClock className="text-yellow-500 text-2xl" /></div></div>
        <div className="glass-dark rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Transactions</p><p className="text-2xl font-bold text-white">{payments.length}</p></div><FiDollarSign className="text-red-500 text-2xl" /></div></div>
      </div>

      <div className="glass-dark rounded-xl p-4 mb-6"><div className="relative"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search payments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-12" /></div></div>

      <div className="glass-dark rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr><th>Customer</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="text-white font-medium">{payment.customer_name}</td>
                <td>Rs. {payment.amount?.toLocaleString()}</td>
                <td className="capitalize">{payment.payment_method?.replace('_', ' ')}</td>
                <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                <td><span className={`badge ${payment.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{payment.status}</span></td>
                <td>
                  {payment.status === 'pending' && <button onClick={() => handleStatusUpdate(payment.id, 'paid')} className="p-2 hover:bg-dark-700 rounded-lg text-green-400 hover:text-green-300" title="Mark as Paid"><FiCheck size={16} /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-dark rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Record Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="input-label">Customer *</label><select required value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} className="input-field"><option value="">Select Customer</option>{customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div><label className="input-label">Amount (Rs.) *</label><input type="number" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="input-field" /></div>
              <div><label className="input-label">Payment Method</label><select value={formData.payment_method} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} className="input-field"><option value="cash">Cash</option><option value="bank_transfer">Bank Transfer</option><option value="cheque">Cheque</option></select></div>
              <div><label className="input-label">Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="input-field" rows="2" /></div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Record Payment</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Payments;
