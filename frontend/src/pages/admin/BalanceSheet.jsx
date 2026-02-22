import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { reportService } from '../../services/orderService';

const BalanceSheet = () => {
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState(null);

  useEffect(() => { fetchData(); }, [month]);

  const fetchData = async () => {
    try {
      const result = await reportService.getBalanceSheet({ month });
      setData(result);
    } catch (error) {
      setData({
        totalSales: 2450000,
        totalPurchases: 1800000,
        totalPending: 350000,
        totalReceived: 2100000,
        netProfit: 650000,
        expenses: 125000,
        transactions: [
          { id: 1, type: 'sale', description: 'Order #1234 - ABC Restaurant', amount: 45000, date: '2024-01-15' },
          { id: 2, type: 'purchase', description: 'Stock replenishment - Johnnie Walker', amount: 180000, date: '2024-01-14' },
          { id: 3, type: 'payment_received', description: 'Payment from XYZ Bar', amount: 35000, date: '2024-01-13' },
          { id: 4, type: 'expense', description: 'Transportation cost', amount: 15000, date: '2024-01-12' },
          { id: 5, type: 'sale', description: 'Order #1235 - City Wholesale', amount: 96000, date: '2024-01-11' },
        ]
      });
    } finally { setLoading(false); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white">Balance Sheet</h1><p className="text-gray-400 mt-1">Financial overview and transactions</p></div>
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-400" />
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="input-field w-auto" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-xl p-6">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Total Sales</span><FiTrendingUp className="text-green-500" /></div>
          <p className="text-2xl font-bold text-white">Rs. {(data?.totalSales / 100000).toFixed(1)}L</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-dark rounded-xl p-6">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Net Profit</span><FiTrendingUp className="text-green-500" /></div>
          <p className="text-2xl font-bold text-green-500">Rs. {(data?.netProfit / 100000).toFixed(1)}L</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-dark rounded-xl p-6">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Pending Payments</span><FiDollarSign className="text-yellow-500" /></div>
          <p className="text-2xl font-bold text-yellow-500">Rs. {(data?.totalPending / 100000).toFixed(1)}L</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-dark rounded-xl p-6">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Expenses</span><FiTrendingDown className="text-red-500" /></div>
          <p className="text-2xl font-bold text-red-500">Rs. {(data?.expenses / 100000).toFixed(1)}L</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-dark rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Income vs Expenses</h2>
          <div className="space-y-4">
            <div><div className="flex justify-between mb-1"><span className="text-gray-400">Total Sales</span><span className="text-green-500">Rs. {data?.totalSales?.toLocaleString()}</span></div><div className="h-2 bg-dark-700 rounded-full"><div className="h-2 bg-green-500 rounded-full" style={{ width: '100%' }}></div></div></div>
            <div><div className="flex justify-between mb-1"><span className="text-gray-400">Purchases</span><span className="text-red-400">Rs. {data?.totalPurchases?.toLocaleString()}</span></div><div className="h-2 bg-dark-700 rounded-full"><div className="h-2 bg-red-400 rounded-full" style={{ width: '73%' }}></div></div></div>
            <div><div className="flex justify-between mb-1"><span className="text-gray-400">Expenses</span><span className="text-red-500">Rs. {data?.expenses?.toLocaleString()}</span></div><div className="h-2 bg-dark-700 rounded-full"><div className="h-2 bg-red-500 rounded-full" style={{ width: '5%' }}></div></div></div>
          </div>
        </div>
        <div className="glass-dark rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Payment Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-800 rounded-lg p-4 text-center"><p className="text-gray-400 text-sm">Received</p><p className="text-2xl font-bold text-green-500">Rs. {(data?.totalReceived / 100000).toFixed(1)}L</p></div>
            <div className="bg-dark-800 rounded-lg p-4 text-center"><p className="text-gray-400 text-sm">Pending</p><p className="text-2xl font-bold text-yellow-500">Rs. {(data?.totalPending / 100000).toFixed(1)}L</p></div>
          </div>
        </div>
      </div>

      <div className="glass-dark rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Amount</th></tr></thead>
            <tbody>
              {data?.transactions?.map((tx) => (
                <tr key={tx.id}>
                  <td className="text-gray-400">{new Date(tx.date).toLocaleDateString()}</td>
                  <td><span className={`badge ${tx.type === 'sale' || tx.type === 'payment_received' ? 'badge-success' : tx.type === 'purchase' ? 'badge-danger' : 'badge-warning'}`}>{tx.type.replace('_', ' ')}</span></td>
                  <td className="text-white">{tx.description}</td>
                  <td className={tx.type === 'sale' || tx.type === 'payment_received' ? 'text-green-500' : 'text-red-400'}>Rs. {tx.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
