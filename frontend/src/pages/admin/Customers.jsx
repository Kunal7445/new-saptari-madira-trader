import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { customerService } from '../../services/orderService';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', address: '', company_name: ''
  });

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      setCustomers([
        { id: 1, name: 'ABC Restaurant', phone: '9841XXXXXX', email: 'abc@restaurant.com', address: 'Kathmandu', company_name: 'ABC Restaurant Pvt. Ltd.', pending_amount: 25000, paid_amount: 150000 },
        { id: 2, name: 'XYZ Bar & Grill', phone: '9842XXXXXX', email: 'xyz@bar.com', address: 'Pokhara', company_name: 'XYZ Entertainment', pending_amount: 45000, paid_amount: 280000 },
        { id: 3, name: 'Hotel Paradise', phone: '9843XXXXXX', email: 'paradise@hotel.com', address: 'Birgunj', company_name: 'Paradise Hotels', pending_amount: 0, paid_amount: 450000 },
        { id: 4, name: 'City Wholesale', phone: '9844XXXXXX', email: 'city@wholesale.com', address: 'Rajbiraj', company_name: 'City Trading Co.', pending_amount: 85000, paid_amount: 620000 },
      ]);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, formData);
        toast.success('Customer updated successfully');
      } else {
        await customerService.createCustomer(formData);
        toast.success('Customer created successfully');
      }
      setShowModal(false); setEditingCustomer(null); resetForm(); fetchCustomers();
    } catch (error) { toast.error('Failed to save customer'); }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({ name: customer.name, phone: customer.phone, email: customer.email || '', address: customer.address || '', company_name: customer.company_name || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try { await customerService.deleteCustomer(id); toast.success('Customer deleted'); fetchCustomers(); }
      catch (error) { toast.error('Failed to delete'); }
    }
  };

  const resetForm = () => setFormData({ name: '', phone: '', email: '', address: '', company_name: '' });

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white">Customers</h1><p className="text-gray-400 mt-1">Manage your customers</p></div>
        <button onClick={() => { resetForm(); setEditingCustomer(null); setShowModal(true); }} className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"><FiPlus className="mr-2" />Add Customer</button>
      </div>

      <div className="glass-dark rounded-xl p-4 mb-6">
        <div className="relative"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-12" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <motion.div key={customer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">{customer.name}</h3>
                <p className="text-gray-400 text-sm">{customer.company_name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(customer)} className="p-2 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-white"><FiEdit2 size={16} /></button>
                <button onClick={() => handleDelete(customer.id)} className="p-2 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-red-500"><FiTrash2 size={16} /></button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center text-gray-400"><FiPhone className="mr-2" />{customer.phone}</p>
              {customer.email && <p className="flex items-center text-gray-400"><FiMail className="mr-2" />{customer.email}</p>}
              {customer.address && <p className="flex items-center text-gray-400"><FiMapPin className="mr-2" />{customer.address}</p>}
            </div>
            <div className="mt-4 pt-4 border-t border-dark-700">
              <div className="flex justify-between mb-2"><span className="text-gray-400 text-sm">Total Paid:</span><span className="text-green-500 font-medium">Rs. {(customer.paid_amount || 0).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 text-sm">Pending:</span><span className="text-yellow-500 font-medium">Rs. {(customer.pending_amount || 0).toLocaleString()}</span></div>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-dark rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-4">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="input-label">Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" /></div>
              <div><label className="input-label">Phone *</label><input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" /></div>
              <div><label className="input-label">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" /></div>
              <div><label className="input-label">Company Name</label><input type="text" value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} className="input-field" /></div>
              <div><label className="input-label">Address</label><textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="input-field" rows="2" /></div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingCustomer(null); }} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">{editingCustomer ? 'Update' : 'Add'} Customer</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Customers;
