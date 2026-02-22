import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPackage, FiTruck, FiAward, FiStar } from 'react-icons/fi';

const Home = () => {
  const [products, setProducts] = useState([]);

useEffect(() => {
    // Sample products with local alcohol bottle images
    setProducts([
      { id: 1, name: 'Johnnie Walker Black Label', brand: 'Johnnie Walker', category: 'Whisky', price: 4500, image: '/Images/Black_Label.webp' },
      { id: 2, name: 'Johnnie Walker Blue Label', brand: 'Johnnie Walker', category: 'Whisky', price: 12500, image: '/Images/Blue_Label.webp' },
      { id: 3, name: 'Black Oak Whisky', brand: 'Black Oak', category: 'Whisky', price: 2800, image: '/Images/black-oak.webp' },
      { id: 4, name: 'Bombay Sapphire Gin', brand: 'Bombay Sapphire', category: 'Gin', price: 2200, image: '/Images/Bombay_Sapphire.webp' },
    ]);
  }, []);

  const features = [
    { icon: FiTruck, title: 'Fast Delivery', description: 'Multiple godowns for quick delivery across Nepal' },
    { icon: FiAward, title: '20+ Years Experience', description: 'Trusted by thousands of customers since 2000' },
    { icon: FiPackage, title: 'Premium Quality', description: 'Authentic Nepali and International brands' },
    { icon: FiStar, title: 'Best Prices', description: 'Competitive wholesale prices guaranteed' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1920')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-dark-900"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Premium Alcohol</span>
              <br />
              <span className="text-white">Distribution in Nepal</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Your trusted partner for authentic Nepali and international alcohol brands. 
              Operating from Rajbiraj, Saptari with 20+ years of excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 glow-red"
              >
                View Products
                <FiArrowRight className="ml-2" />
              </Link>
              <Link
                to="/order"
                className="inline-flex items-center justify-center px-8 py-4 bg-dark-700 hover:bg-dark-600 text-white font-semibold rounded-xl border border-dark-600 transition-all duration-300"
              >
                Place Order
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-gray-600 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="gradient-text">Us</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We are committed to providing the best alcohol distribution services in Nepal
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-dark rounded-xl p-6 text-center hover:border-red-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-600/20 flex items-center justify-center">
                  <feature.icon className="text-red-500 text-2xl" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview Section */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="gradient-text">Products</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our wide range of premium alcohol brands from around the world
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-dark rounded-xl overflow-hidden group hover:border-red-500/50 transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="text-red-500 text-xs font-medium mb-1">{product.category}</p>
                  <h3 className="text-white font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{product.brand}</p>
                  <p className="text-white font-bold">Rs. {product.price.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-lg transition-colors"
            >
              View All Products
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-dark rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to <span className="gradient-text">Order</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Contact us today for wholesale orders. We deliver across Nepal with competitive prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/order"
                className="inline-flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 glow-red"
              >
                Place Order
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-dark-700 hover:bg-dark-600 text-white font-semibold rounded-xl border border-dark-600 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
