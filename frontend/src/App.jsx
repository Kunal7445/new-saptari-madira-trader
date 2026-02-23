import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Products from './pages/public/Products';
import Order from './pages/public/Order';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Payments from './pages/admin/Payments';
import Reports from './pages/admin/Reports';
import BalanceSheet from './pages/admin/BalanceSheet';

// Public Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Admin Components
import Sidebar from './components/admin/Sidebar';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-900">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/products" element={<><Navbar /><Products /><Footer /></>} />
        <Route path="/order" element={<><Navbar /><Order /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
        <Route path="/login" element={user ? <Navigate to="/admin/dashboard" /> : <Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute>
            <AdminLayout><Dashboard /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/inventory" element={
          <PrivateRoute>
            <AdminLayout><Inventory /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/orders" element={
          <PrivateRoute>
            <AdminLayout><Orders /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/customers" element={
          <PrivateRoute>
            <AdminLayout><Customers /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/payments" element={
          <PrivateRoute>
            <AdminLayout><Payments /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/reports" element={
          <PrivateRoute>
            <AdminLayout><Reports /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/balance-sheet" element={
          <PrivateRoute>
            <AdminLayout><BalanceSheet /></AdminLayout>
          </PrivateRoute>
        } />
        
        {/* Redirects */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;
