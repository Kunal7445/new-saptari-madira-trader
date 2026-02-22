import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiMapPin, FiPackage } from 'react-icons/fi';
import { godownService } from '../../services/productService';

const Godowns = () => {
  const [godowns, setGodowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGodown, setEditingGodown] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '', capacity: '', description: '' });

  useEffect(() => { fetchGodowns(); }, []);

  const fetchGodowns = async () => {
    try {
      const data = await godownService.getAllGodowns();
      setGodowns(data);
    } catch (error) {
      setGodowns([
        { id: 1, name: 'Main Warehouse', location: 'Rajbiraj, Saptari', capacity: 10000, description: 'Primary storage facility', product_count: 45 },
        { id: 2, name: 'Distribution Center', location: 'Birgunj, Parsa', capacity: 8000, description: 'Regional distribution hub', product_count: 32 },
        { id: 3, name: 'Regional Hub', location: 'Itahari, Sunsari', capacity: 6000, description: 'Eastern region storage', product_count: 28 },
      ]);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGodown) {
        await godownService.updateGodown(editingGodown.id, formData);
        toast.success('Godown updated successfully');
      } else {
        await godownService.createGodown(formData);
        toast.success('Godown created successfully');
      }
      setShowModal(false); setEditingGodown(null); resetForm(); fetchGodowns();
    } catch (error) { toast.error('Failed to save godown'); }
  };

  const handleEdit = (godown) => {
    setEditingGodown(godown);
    setFormData({ name: godown.name, location: godown.location, capacity: godown.capacity || '', description: godown.description || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this godown?')) {
      try { await godownService.deleteGodown(id); toast.success('Godown deleted'); fetchGodowns(); }
      catch (error) { toast.error('Failed to delete godown'); }
    }
  };

  const resetForm = () => setFormData({ name: '', location: '', capacity: '', description: '' });
  const filteredGodowns = godowns.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.location?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white">Godowns</h1><p className="text-gray-400 mt-1">Manage storage locations</p></div>
        <button onClick={() => { resetForm(); setEditingGodown(null); setShowModal(true); }} className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"><FiPlus className="mr-2" />Add Godown</button>
      </div>

      <div className="glass-dark rounded-xl p-4 mb-6"><div className="relative"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search godowns..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-12" /></div></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGodowns.map((godown) => (
          <motion.div key={godown.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center"><FiMapPin className="text-red-500 text-xl" /></div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(godown)} className="p-2 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-white"><FiEdit2 size={16} /></button>
                <button onClick={() => handleDelete(godown.id)} className="p-2 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-red-500"><FiTrash2 size={16} /></button>
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">{godown.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{godown.location}</p>
            {godown.description && <p className="text-gray-500 text-sm mb-4">{godown.description}</p>}
            <div className="flex items-center justify-between pt-4 border-t border-dark-700">
              <div className="flex items-center text-gray-400"><FiPackage className="mr-2" /><span className="text-sm">{godown.product_count || 0} products</span></div>
              <div className="text-gray-500 text-sm">{godown.capacity ? `${godown.capacity.toLocaleString()} units` : 'N/A'}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-dark rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">{editingGodown ? 'Edit Godown' : 'Add New Godown'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="input-label">Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" /></div>
              <div><label className="input-label">Location *</label><input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="input-field" placeholder="City, District" /></div>
              <div><label className="input-label">Capacity</label><input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="input-field" placeholder="Maximum capacity" /></div>
              <div><label className="input-label">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows="3" /></div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingGodown(null); }} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">{editingGodown ? 'Update' : 'Add'} Godown</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Godowns;
