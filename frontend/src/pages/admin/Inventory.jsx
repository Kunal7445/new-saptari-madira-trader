import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiAlertTriangle, FiPackage } from 'react-icons/fi';
import { productService, categoryService, godownService } from '../../services/productService';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [godowns, setGodowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockModal, setStockModal] = useState({ show: false, product: null });

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category_id: '',
    bottle_size: '',
    price: '',
    description: '',
    origin: 'Nepali',
    image_url: ''
  });

  const [stockForm, setStockForm] = useState({
    godown_id: '',
    quantity: 0,
    type: 'add'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData, godownsData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
        godownService.getAllGodowns()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setGodowns(godownsData);
    } catch (error) {
      // Use sample data for demo
      setProducts([
        { id: 1, name: 'Johnnie Walker Black', brand: 'Johnnie Walker', category_name: 'Whisky', bottle_size: '750ml', price: 4500, total_stock: 50 },
        { id: 2, name: 'Grey Goose', brand: 'Grey Goose', category_name: 'Vodka', bottle_size: '750ml', price: 4500, total_stock: 35 },
        { id: 3, name: 'Captain Morgan', brand: 'Captain Morgan', category_name: 'Rum', bottle_size: '750ml', price: 1500, total_stock: 8 },
      ]);
      setCategories([
        { id: 1, name: 'Whisky' },
        { id: 2, name: 'Vodka' },
        { id: 3, name: 'Rum' },
        { id: 4, name: 'Gin' },
      ]);
      setGodowns([
        { id: 1, name: 'Main Warehouse', location: 'Rajbiraj' },
        { id: 2, name: 'Distribution Center', location: 'Birgunj' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(formData);
        toast.success('Product created successfully');
      }
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      category_id: product.category_id,
      bottle_size: product.bottle_size,
      price: product.price,
      description: product.description || '',
      origin: product.origin || 'Nepali',
      image_url: product.image_url || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleStockUpdate = async (e) => {
    e.preventDefault();
    try {
      await productService.updateStock({
        product_id: stockForm.product.id,
        godown_id: stockForm.godown_id,
        quantity: parseInt(stockForm.quantity),
        type: stockForm.type
      });
      toast.success('Stock updated successfully');
      setStockModal({ show: false, product: null });
      fetchData();
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      category_id: '',
      bottle_size: '',
      price: '',
      description: '',
      origin: 'Nepali',
      image_url: ''
    });
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.total_stock), 0);
  const lowStockProducts = products.filter(p => p.total_stock < 10);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventory</h1>
          <p className="text-gray-400 mt-1">Manage your product stock</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingProduct(null); setShowModal(true); }}
          className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-dark rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{products.length}</p>
            </div>
            <FiPackage className="text-red-500 text-2xl" />
          </div>
        </div>
        <div className="glass-dark rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Stock</p>
              <p className="text-2xl font-bold text-white">{products.reduce((s, p) => s + p.total_stock, 0)}</p>
            </div>
            <FiPackage className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="glass-dark rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Stock Value</p>
              <p className="text-2xl font-bold text-white">Rs. {(totalValue / 100000).toFixed(1)}L</p>
            </div>
            <FiPackage className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="glass-dark rounded-xl p-6 border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-500">{lowStockProducts.length}</p>
            </div>
            <FiAlertTriangle className="text-yellow-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="glass-dark rounded-xl p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-dark rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Size</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-gray-500 text-sm">{product.brand}</p>
                  </div>
                </td>
                <td>{product.category_name}</td>
                <td>{product.bottle_size}</td>
                <td>Rs. {product.price?.toLocaleString()}</td>
                <td>{product.total_stock || 0}</td>
                <td>
                  <span className={`badge ${
                    (product.total_stock || 0) > 20 ? 'badge-success' :
                    (product.total_stock || 0) > 10 ? 'badge-warning' :
                    'badge-danger'
                  }`}>
                    {(product.total_stock || 0) > 20 ? 'In Stock' :
                     (product.total_stock || 0) > 10 ? 'Low Stock' : 'Critical'}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStockModal({ show: true, product })}
                      className="p-2 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-white"
                      title="Update Stock"
                    >
                      <FiPackage size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-white"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-red-500"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-dark rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Brand *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Bottle Size</label>
                  <input
                    type="text"
                    value={formData.bottle_size}
                    onChange={(e) => setFormData({ ...formData, bottle_size: e.target.value })}
                    className="input-field"
                    placeholder="750ml"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Origin</label>
                  <select
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="input-field"
                  >
                    <option value="Nepali">Nepali</option>
                    <option value="Imported">Imported</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="input-label">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="input-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="3"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingProduct(null); }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Stock Update Modal */}
      {stockModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-dark rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-white mb-4">Update Stock</h2>
            <p className="text-gray-400 mb-4">{stockModal.product?.name}</p>
            <form onSubmit={handleStockUpdate} className="space-y-4">
              <div>
                <label className="input-label">Godown</label>
                <select
                  required
                  value={stockForm.godown_id}
                  onChange={(e) => setStockForm({ ...stockForm, godown_id: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Godown</option>
                  {godowns.map(g => (
                    <option key={g.id} value={g.id}>{g.name} - {g.location}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={stockForm.quantity}
                  onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Type</label>
                <select
                  value={stockForm.type}
                  onChange={(e) => setStockForm({ ...stockForm, type: e.target.value })}
                  className="input-field"
                >
                  <option value="add">Add Stock</option>
                  <option value="remove">Remove Stock</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStockModal({ show: false, product: null })}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Update Stock
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
