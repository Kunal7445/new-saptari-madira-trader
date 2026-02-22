import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiEye, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import { orderService } from '../../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      setOrders([
        { id: 1, customer_name: 'ABC Restaurant', total_amount: 22500, status: 'pending', created_at: '2024-01-15', items: [{ product_name: 'Johnnie Walker Black', quantity: 5, unit_price: 4500 }] },
        { id: 2, customer_name: 'XYZ Bar & Grill', total_amount: 48000, status: 'completed', created_at: '2024-01-14', items: [{ product_name: 'Grey Goose', quantity: 8, unit_price: 4500 }, { product_name: 'Captain Morgan', quantity: 8, unit_price: 1500 }] },
        { id: 3, customer_name: 'Hotel Paradise', total_amount: 36000, status: 'processing', created_at: '2024-01-14', items: [{ product_name: 'Jack Daniel\'s', quantity: 10, unit_price: 3600 }] },
        { id: 4, customer_name: 'City Wholesale', total_amount: 96000, status: 'completed', created_at: '2024-01-13', items: [{ product_name: 'Royal Stag', quantity: 80, unit_price: 1200 }] },
        { id: 5, customer_name: 'Mountain Resort', total_amount: 27000, status: 'cancelled', created_at: '2024-01-12', items: [{ product_name: 'Bombay Sapphire', quantity: 5, unit_price: 2200 }, { product_name: 'Absolut Vodka', quantity: 5, unit_price: 3200 }] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      toast.success(`Order ${status} successfully`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.deleteOrder(id);
        toast.success('Order deleted successfully');
        fetchOrders();
      } catch (error) {
        toast.error('Failed to delete order');
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Orders</h1>
        <p className="text-gray-400 mt-1">Manage customer orders</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
          <button key={status} onClick={() => setStatusFilter(status)} className={`glass-dark rounded-xl p-4 text-center transition-all ${statusFilter === status ? 'border-red-500' : ''}`}>
            <p className="text-2xl font-bold text-white">{statusCounts[status]}</p>
            <p className="text-gray-400 text-sm capitalize">{status}</p>
          </button>
        ))}
      </div>

      <div className="glass-dark rounded-xl p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-12" />
        </div>
      </div>

      <div className="glass-dark rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="text-white font-medium">#{order.id}</td>
                <td>{order.customer_name}</td>
                <td>{order.items?.length || 0} items</td>
                <td>Rs. {order.total_amount?.toLocaleString()}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${order.status === 'completed' ? 'badge-success' : order.status === 'pending' ? 'badge-warning' : order.status === 'processing' ? 'badge-info' : 'badge-danger'}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedOrder(order)} className="p-2 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-white" title="View Details"><FiEye size={16} /></button>
                    {order.status === 'pending' && <button onClick={() => handleStatusUpdate(order.id, 'processing')} className="p-2 hover:bg-dark-700 rounded-lg text-blue-400 hover:text-blue-300" title="Start Processing"><FiCheck size={16} /></button>}
                    {order.status === 'processing' && <button onClick={() => handleStatusUpdate(order.id, 'completed')} className="p-2 hover:bg-dark-700 rounded-lg text-green-400 hover:text-green-300" title="Mark Complete"><FiCheck size={16} /></button>}
                    {order.status !== 'cancelled' && order.status !== 'completed' && <button onClick={() => handleStatusUpdate(order.id, 'cancelled')} className="p-2 hover:bg-dark-700 rounded-lg text-red-400 hover:text-red-300" title="Cancel Order"><FiX size={16} /></button>}
                    <button onClick={() => handleDelete(order.id)} className="p-2 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-red-500" title="Delete Order"><FiTrash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-dark rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between"><span className="text-gray-400">Order ID:</span><span className="text-white">#{selectedOrder.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Customer:</span><span className="text-white">{selectedOrder.customer_name}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Date:</span><span className="text-white">{new Date(selectedOrder.created_at).toLocaleDateString()}</span></div>
              <div className="border-t border-dark-700 pt-4 mt-4">
                <h3 className="text-white font-semibold mb-3">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between bg-dark-800 p-3 rounded-lg">
                      <div><p className="text-white">{item.product_name}</p><p className="text-gray-500 text-sm">Qty: {item.quantity} x Rs. {item.unit_price}</p></div>
                      <p className="text-white font-medium">Rs. {(item.quantity * item.unit_price).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-dark-700 pt-4 mt-4">
                <div className="flex justify-between"><span className="text-gray-400 text-lg">Total:</span><span className="text-white text-xl font-bold">Rs. {selectedOrder.total_amount?.toLocaleString()}</span></div>
              </div>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="w-full mt-6 btn-secondary">Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Orders;
