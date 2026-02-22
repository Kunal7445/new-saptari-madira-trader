import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiMapPin, FiAward } from 'react-icons/fi';

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About <span className="gradient-text">Us</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Learn more about New Saptari Madira Trader and our journey in the alcohol distribution industry
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-16 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Our <span className="gradient-text">Story</span>
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  New Saptari Madira Trader was established in Rajbiraj, Saptari with a vision to become 
                  the most trusted name in premium alcohol distribution across Nepal.
                </p>
                <p>
                  For over 20 years, we have been serving customers with authentic Nepali and international 
                  alcohol brands. Our commitment to quality and customer satisfaction has helped us build 
                  a strong reputation in the industry.
                </p>
                <p>
                  Today, we operate multiple godowns across the region, ensuring fast and efficient 
                  delivery to our customers. We take pride in our extensive network and the trust 
                  we've earned from thousands of satisfied customers.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
                  alt="Company History"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-red-600 rounded-xl p-6 shadow-lg">
                <p className="text-white font-bold text-4xl">20+</p>
                <p className="text-white/80 text-sm">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-dark rounded-2xl p-8"
            >
              <div className="w-14 h-14 rounded-full bg-red-600/20 flex items-center justify-center mb-6">
                <FiEye className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-400">
                To be the leading alcohol distribution company in Nepal, known for authenticity, 
                reliability, and exceptional customer service. We envision creating a sustainable 
                network that brings premium alcohol brands to every corner of the country.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-dark rounded-2xl p-8"
            >
              <div className="w-14 h-14 rounded-full bg-orange-600/20 flex items-center justify-center mb-6">
                <FiTarget className="text-orange-500 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400">
                To provide authentic premium alcohol products at competitive prices while maintaining 
                the highest standards of service. We are committed to building long-term relationships 
                with our customers through transparency, trust, and consistent quality.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Godowns Section */}
      <section className="py-16 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Our <span className="gradient-text">Godowns</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We maintain multiple strategically located godowns to ensure efficient storage and delivery
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Main Warehouse', location: 'Rajbiraj, Saptari', capacity: '10,000+ Cases' },
              { name: 'Distribution Center', location: 'Rajbiraj, Saptari', capacity: '8,000+ Cases' },
              { name: 'Regional Hub', location: 'Rajbiraj, Saptari', capacity: '6,000+ Cases' },
            ].map((godown, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-dark rounded-xl p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center mb-4">
                  <FiMapPin className="text-red-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">{godown.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{godown.location}</p>
                <p className="text-gray-500 text-sm">{godown.capacity}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '20+', label: 'Years Experience' },
              { number: '500+', label: 'Products' },
              { number: '1000+', label: 'Customers' },
              { number: '50+', label: 'Brands' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.number}</p>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
