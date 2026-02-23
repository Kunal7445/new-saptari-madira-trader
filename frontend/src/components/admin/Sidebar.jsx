import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, FiPackage, FiShoppingCart, FiUsers, FiDollarSign, 
  FiBarChart2, FiFileText, FiLogOut 
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
    { name: 'Inventory', path: '/admin/inventory', icon: FiPackage },
    { name: 'Orders', path: '/admin/orders', icon: FiShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: FiUsers },
    { name: 'Payments', path: '/admin/payments', icon: FiDollarSign },
    { name: 'Reports', path: '/admin/reports', icon: FiBarChart2 },
    { name: 'Balance Sheet', path: '/admin/balance-sheet', icon: FiFileText },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-dark-800 border-r border-dark-700 flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-dark-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">NSMT Admin</h1>
            <p className="text-gray-500 text-xs">Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-red-600/20 text-red-500'
                  : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center space-x-3 mb-4 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center">
            <span className="text-white font-medium">{user?.name?.charAt(0) || 'A'}</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{user?.name || 'Admin'}</p>
            <p className="text-gray-500 text-xs">{user?.email || 'admin@saptarimadira.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-dark-700 rounded-lg transition-colors"
        >
          <FiLogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
