import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch } from 'react-icons/fi';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Whisky', 'Rum', 'Vodka', 'Gin', 'Beer', 'Wine'];

  // Sample products data with local alcohol bottle images - all 18 products with proper brand names and prices
  const products = [
    { id: 1, name: 'Johnnie Walker Black Label', brand: 'Johnnie Walker', category: 'Whisky', size: '750ml', price: 4500, stock: 50, image: '/Images/Black_Label.webp' },
    { id: 2, name: 'Johnnie Walker Blue Label', brand: 'Johnnie Walker', category: 'Whisky', size: '750ml', price: 12500, stock: 15, image: '/Images/Blue_Label.webp' },
    { id: 3, name: 'Johnnie Walker Double Black', brand: 'Johnnie Walker', category: 'Whisky', size: '750ml', price: 5500, stock: 35, image: '/Images/Double-Black.webp' },
    { id: 4, name: 'Johnnie Walker Red Label', brand: 'Johnnie Walker', category: 'Whisky', size: '750ml', price: 2800, stock: 120, image: '/Images/Red-label.webp' },
    { id: 5, name: "Jack Daniel's Old No.7", brand: "Jack Daniel's", category: 'Whisky', size: '750ml', price: 3200, stock: 65, image: '/Images/Jack Daniels.webp' },
    { id: 6, name: 'Jameson Irish Whiskey', brand: 'Jameson', category: 'Whisky', size: '750ml', price: 2800, stock: 80, image: '/Images/jameson.webp' },
    { id: 7, name: 'Kala Patthar Whisky', brand: 'Kala Patthar', category: 'Whisky', size: '750ml', price: 1200, stock: 150, image: '/Images/Kala-Patthar-Whisky.webp' },
    { id: 8, name: 'Oaksmith Gold', brand: 'Oaksmith', category: 'Whisky', size: '750ml', price: 1500, stock: 90, image: '/Images/oaksmith Gold.webp' },
    { id: 9, name: 'Old Durbar Whisky', brand: 'Old Durbar', category: 'Whisky', size: '750ml', price: 1800, stock: 70, image: '/Images/Old-Durbar.webp' },
    { id: 10, name: 'Signature Premium Whisky', brand: 'Signature', category: 'Whisky', size: '750ml', price: 950, stock: 200, image: '/Images/Signature.webp' },
    { id: 11, name: 'VAT 69 Whisky', brand: 'VAT 69', category: 'Whisky', size: '750ml', price: 1100, stock: 180, image: '/Images/VAT-69.webp' },
    { id: 12, name: 'Black Oak Whisky', brand: 'Black Oak', category: 'Whisky', size: '750ml', price: 1400, stock: 110, image: '/Images/black-oak.webp' },
    { id: 13, name: 'Golden Oak Whisky', brand: 'Golden Oak', category: 'Whisky', size: '750ml', price: 1600, stock: 85, image: '/Images/Golden-Oak.webp' },
    { id: 14, name: 'Bombay Sapphire Gin', brand: 'Bombay Sapphire', category: 'Gin', size: '750ml', price: 2500, stock: 45, image: '/Images/Bombay_Sapphire.webp' },
    { id: 15, name: 'Ruslan Vodka', brand: 'Ruslan', category: 'Vodka', size: '750ml', price: 1800, stock: 100, image: '/Images/Ruslan.webp' },
    { id: 16, name: 'Kings Hill Red Wine', brand: 'Kings Hill', category: 'Wine', size: '750ml', price: 2200, stock: 60, image: '/Images/Kings-Hill-Red-sweet-wine.webp' },
    { id: 17, name: 'Souverain Wine', brand: 'Souverain', category: 'Wine', size: '750ml', price: 2500, stock: 40, image: '/Images/souverain wine.webp' },
    { id: 18, name: 'Tuborg Beer', brand: 'Tuborg', category: 'Beer', size: '500ml', price: 350, stock: 500, image: '/Images/Tuborg.webp' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="gradient-text">Products</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Browse our extensive collection of premium alcohol brands
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <FiFilter className="text-gray-400 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
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
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-dark rounded-xl overflow-hidden group hover:border-red-500/50 transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${
                    product.stock > 50 ? 'bg-green-500/20 text-green-400' :
                    product.stock > 20 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {product.stock > 50 ? 'In Stock' : product.stock > 20 ? 'Low Stock' : 'Very Low'}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-red-500 text-xs font-medium mb-1">{product.category}</p>
                  <h3 className="text-white font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{product.brand} • {product.size}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-white font-bold text-lg">Rs. {product.price.toLocaleString()}</p>
                    <span className="text-gray-500 text-sm">{product.stock} pcs</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
