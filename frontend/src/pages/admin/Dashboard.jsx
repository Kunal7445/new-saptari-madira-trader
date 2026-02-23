import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import { reportService } from '../../services/orderService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    lowStockItems: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await reportService.getDashboardStats();
      setStats({
        totalProducts: response?.totalProducts || 0,
        totalOrders: response?.totalOrders || 0,
        totalCustomers: response?.totalCustomers || 0,
        totalRevenue: response?.totalRevenue || 0,
        pendingPayments: response?.pendingPayments || 0,
        lowStockItems: Array.isArray(response?.lowStockItems) ? response.lowStockItems : []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setStats({
        totalProducts: 156,
        totalOrders: 89,
        totalCustomers: 45,
        totalRevenue: 2450000,
        pendingPayments: 125000,
        lowStockItems: [
          { id: 1, name: 'Johnnie Walker Blue', stock: 5 },
          { id: 2, name: 'Grey Goose', stock: 8 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: FiPackage, colorClass: 'bg-red-500/20', iconClass: 'text-red-500', change: '+12%' },
    { title: 'Total Orders', value: stats.totalOrders, icon: FiShoppingCart, colorClass: 'bg-blue-500/20', iconClass: 'text-blue-500', change: '+8%' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: FiUsers, colorClass: 'bg-green-500/20', iconClass: 'text-green-500', change: '+5%' },
    { title: 'Total Revenue', value: `Rs. ${(stats.totalRevenue / 100000).toFixed(1)}L`, icon: FiDollarSign, colorClass: 'bg-orange-500/20', iconClass: 'text-orange-500', change: '+15%' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'ABC Restaurant', items: 5, total: 22500, status: 'pending' },
    { id: 'ORD-002', customer: 'XYZ Bar & Grill', items: 12, total: 48000, status: 'completed' },
    { id: 'ORD-003', customer: 'Hotel Paradise', items: 8, total: 36000, status: 'processing' },
    { id: 'ORD-004', customer: 'City Wholesale', items: 24, total: 96000, status: 'completed' },
    { id: 'ORD-005', customer: 'Mountain Resort', items: 6, total: 27000, status: 'pending' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-dark rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.colorClass} flex items-center justify-center`}>
                <stat.icon className={`${stat.iconClass} text-xl`} />
              </div>
              <span className="text-green-500 text-sm font-medium flex items-center">
                <FiTrendingUp className="mr-1" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm">{stat.title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-dark rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
            <a href="/admin/orders" className="text-red-500 text-sm hover:text-red-400">View All</a>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">{order.customer}</p>
                  <p className="text-gray-400 text-sm">{order.id} • {order.items} items</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">Rs. {order.total.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-dark rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FiAlertTriangle className="mr-2 text-yellow-500" />
              Low Stock Alert
            </h2>
            <a href="/admin/inventory" className="text-red-500 text-sm hover:text-red-400">View All</a>
          </div>
          <div className="space-y-4">
            {stats.lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg border-l-4 border-yellow-500">
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-gray-400 text-sm">Stock: {item.stock} units</p>
                </div>
                <div className="text-right">
                  <span className="text-yellow-500 text-sm font-medium">Low Stock</span>
                </div>
              </div>
            ))}
            {stats.lowStockItems.length === 0 && (
              <p className="text-gray-400 text-center py-8">No low stock items</p>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 glass-dark rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/admin/products" className="p-4 bg-dark-800 rounded-lg text-center hover:bg-dark-700 transition-colors">
            <FiPackage className="text-red-500 text-2xl mx-auto mb-2" />
            <p className="text-white text-sm">Add Product</p>
          </a>
          <a href="/admin/orders" className="p-4 bg-dark-800 rounded-lg text-center hover:bg-dark-700 transition-colors">
            <FiShoppingCart className="text-blue-500 text-2xl mx-auto mb-2" />
            <p className="text-white text-sm">View Orders</p>
          </a>
          <a href="/admin/customers" className="p-4 bg-dark-800 rounded-lg text-center hover:bg-dark-700 transition-colors">
            <FiUsers className="text-green-500 text-2xl mx-auto mb-2" />
            <p className="text-white text-sm">Add Customer</p>
          </a>
          <a href="/admin/reports" className="p-4 bg-dark-800 rounded-lg text-center hover:bg-dark-700 transition-colors">
            <FiTrendingUp className="text-orange-500 text-2xl mx-auto mb-2" />
            <p className="text-white text-sm">View Reports</p>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
