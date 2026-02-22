import { Godown } from '../models/Godown.js';

export const getAllGodowns = async (req, res) => {
  try {
    const godowns = await Godown.findAll();
    // Add product count to each godown
    for (const godown of godowns) {
      godown.product_count = await Godown.getProductCount(godown.id);
    }
    res.json(godowns);
  } catch (error) {
    console.error('Get godowns error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGodownById = async (req, res) => {
  try {
    const godown = await Godown.findById(req.params.id);
    if (!godown) {
      return res.status(404).json({ message: 'Godown not found' });
    }
    godown.product_count = await Godown.getProductCount(godown.id);
    res.json(godown);
  } catch (error) {
    console.error('Get godown error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createGodown = async (req, res) => {
  try {
    const godown = await Godown.create(req.body);
    res.status(201).json({
      message: 'Godown created successfully',
      godown
    });
  } catch (error) {
    console.error('Create godown error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateGodown = async (req, res) => {
  try {
    const godown = await Godown.update(req.params.id, req.body);
    if (!godown) {
      return res.status(404).json({ message: 'Godown not found' });
    }
    res.json({
      message: 'Godown updated successfully',
      godown
    });
  } catch (error) {
    console.error('Update godown error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteGodown = async (req, res) => {
  try {
    const productCount = await Godown.getProductCount(req.params.id);
    if (productCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete godown with products. Remove products first.' 
      });
    }

    const godown = await Godown.delete(req.params.id);
    if (!godown) {
      return res.status(404).json({ message: 'Godown not found' });
    }
    res.json({ message: 'Godown deleted successfully' });
  } catch (error) {
    console.error('Delete godown error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
