import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiPlus, FiMinus, FiFilter } from 'react-icons/fi';
import { orderService } from '../../services/orderService';

const Order = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  const [cart, setCart] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Whisky', 'Gin', 'Vodka', 'Wine', 'Beer'];

  const getCartonSize = (bottleSize) => {
    if (bottleSize === '750ml') return 12;
    if (bottleSize === '375ml') return 24;
    if (bottleSize === '180ml') return 60;
    return 12;
  };

  const products = [
    { id: 1, name: 'Johnnie Walker Black Label', brand: 'Johnnie Walker', category: 'Whisky', size: '750ml', price: 4500, image: '/Images/Black_Label.webp', carton_size: 12 },
    { id: 2, name: 'Johnnie Walker Blue Label', brand: 'Johnnie Walker', category: 'Whisky', size: '750ml', price: 12500, image: '/Images/Blue_Label.webp', carton_size: 12 },
    { id: 3, name: 'Johnnie Walker Red Label', brand: 'Johnnie Walker', category: 'Whisky', size: '750ml', price: 2800, image: '/Images/Red-label.webp', carton_size: 12 },
    { id: 4, name: "Jack Daniel's Old No.7", brand: "Jack Daniel's", category: 'Whisky', size: '750ml', price: 3200, image: '/Images/Jack Daniels.webp', carton_size: 12 },
    { id: 5, name: 'Jameson Irish Whiskey', brand: 'Jameson', category: 'Whisky', size: '750ml', price: 2800, image: '/Images/jameson.webp', carton_size: 12 },
    { id: 6, name: 'Kala Patthar Whisky', brand: 'Kala Patthar', category: 'Whisky', size: '750ml', price: 1200, image: '/Images/Kala-Patthar-Whisky.webp', carton_size: 12 },
    { id: 7, name: 'Oaksmith Gold', brand: 'Oaksmith', category: 'Whisky', size: '750ml', price: 1500, image: '/Images/oaksmith Gold.webp', carton_size: 12 },
    { id: 8, name: 'Old Durbar Whisky', brand: 'Old Durbar', category: 'Whisky', size: '750ml', price: 1800, image: '/Images/Old-Durbar.webp', carton_size: 12 },
    { id: 9, name: 'Signature Premium Whisky', brand: 'Signature', category: 'Whisky', size: '750ml', price: 950, image: '/Images/Signature.webp', carton_size: 12 },
    { id: 10, name: 'VAT 69 Whisky', brand: 'VAT 69', category: 'Whisky', size: '750ml', price: 1100, image: '/Images/VAT-69.webp', carton_size: 12 },
    { id: 11, name: 'Black Oak Whisky', brand: 'Black Oak', category: 'Whisky', size: '750ml', price: 1400, image: '/Images/black-oak.webp', carton_size: 12 },
    { id: 12, name: 'Golden Oak Whisky', brand: 'Golden Oak', category: 'Whisky', size: '750ml', price: 1600, image: '/Images/Golden-Oak.webp', carton_size: 12 },
    { id: 13, name: 'Bombay Sapphire Gin', brand: 'Bombay Sapphire', category: 'Gin', size: '750ml', price: 2500, image: '/Images/Bombay_Sapphire.webp', carton_size: 12 },
    { id: 14, name: 'Ruslan Vodka', brand: 'Ruslan', category: 'Vodka', size: '750ml', price: 1800, image: '/Images/Ruslan.webp', carton_size: 12 },
    { id: 15, name: 'Kings Hill Red Wine', brand: 'Kings Hill', category: 'Wine', size: '750ml', price: 2200, image: '/Images/Kings-Hill-Red-sweet-wine.webp', carton_size: 12 },
    { id: 16, name: 'Souverain Wine', brand: 'Souverain', category: 'Wine', size: '750ml', price: 2500, image: '/Images/souverain wine.webp', carton_size: 12 },
    { id: 17, name: 'Tuborg Beer', brand: 'Tuborg', category: 'Beer', size: '500ml', price: 350, image: '/Images/Tuborg.webp', carton_size: 24 },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesCategory;
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, carton_quantity: item.carton_quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { 
        ...product, 
        carton_quantity: 1,
        price_per_carton: product.price,
        bottles: product.carton_size
      }]);
    }
    toast.success(`${product.name} added to cart`);
  };

  const updateCartonQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        return { ...item, carton_quantity: Math.max(1, item.carton_quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
    toast.success('Item removed from cart');
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price_per_carton * item.carton_quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Please add items to your order');
      return;
    }

    if (!formData.customerName || !formData.phone) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: formData.customerName,
        customer_phone: formData.phone,
        customer_email: formData.email,
        customer_address: formData.address,
        notes: formData.notes,
        items: cart.map(item => ({
          product_id: item.id,
          price_per_carton: item.price_per_carton,
          carton_quantity: item.carton_quantity
        }))
      };

      await orderService.createOrder(orderData);
      toast.success('Order placed successfully! A confirmation email has been sent.');
      setCart([]);
      setFormData({
        customerName: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
      });
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Place <span className="gradient-text">Order</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Browse our products and place your wholesale order (Sold in Cartons Only)
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-dark rounded-xl p-6 mb-6">
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-dark-700">
                <div className="flex items-center gap-2">
                  <FiFilter className="text-gray-400" />
                  <span className="text-gray-400 text-sm">Filter:</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-red-600 text-white'
                          : 'bg-dark-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FiShoppingCart className="mr-2" />
                Available Products ({filteredProducts.length})
              </h2>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-dark-800 rounded-lg p-3 flex flex-col">
                      <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-red-600/20 text-red-400 text-xs rounded">{product.category}</span>
                          <span className="px-2 py-0.5 bg-dark-700 text-gray-400 text-xs rounded">{product.size}</span>
                        </div>
                        <h3 className="text-white font-medium text-sm">{product.name}</h3>
                        <p className="text-gray-400 text-xs">{product.brand}</p>
                        <div className="mt-1">
                          <p className="text-red-500 font-bold">Rs. {product.price.toLocaleString()} <span className="text-gray-400 text-xs">/carton</span></p>
                          <p className="text-gray-500 text-xs">{product.carton_size} bottles/carton</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full mt-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No products found matching your filters.</p>
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className="mt-2 text-red-500 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="glass-dark rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Your Order</h2>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-dark-800 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <h3 className="text-white font-medium text-sm">{item.name}</h3>
                          <p className="text-gray-400 text-xs">{item.size} | Rs. {item.price_per_carton.toLocaleString()}/carton</p>
                          <p className="text-gray-500 text-xs">{item.carton_size} bottles per carton</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateCartonQuantity(item.id, -1)}
                          className="p-1 hover:bg-dark-700 rounded"
                        >
                          <FiMinus className="text-gray-400" />
                        </button>
                        <span className="text-white w-8 text-center">{item.carton_quantity}</span>
                        <button
                          onClick={() => updateCartonQuantity(item.id, 1)}
                          className="p-1 hover:bg-dark-700 rounded"
                        >
                          <FiPlus className="text-gray-400" />
                        </button>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-white font-bold">Rs. {(item.price_per_carton * item.carton_quantity).toLocaleString()}</p>
                        <p className="text-gray-500 text-xs">{item.carton_quantity} carton(s)</p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 text-xs hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-dark-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-2xl font-bold text-white">Rs. {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="glass-dark rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-4">Customer Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="input-label">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="input-field"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="input-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    placeholder="9842822810"
                  />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="input-label">Delivery Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                    rows="2"
                    placeholder="Enter delivery address"
                  />
                </div>
                <div>
                  <label className="input-label">Additional Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field"
                    rows="2"
                    placeholder="Any special instructions..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
