import { Product } from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, search, lowStock } = req.query;
    
    let products;
    
    if (lowStock === 'true') {
      products = await Product.getLowStock(10);
    } else if (category) {
      products = await Product.findByCategory(category);
    } else if (search) {
      products = await Product.search(search);
    } else {
      products = await Product.findAll();
    }

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.update(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.delete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { productId, godownId, quantity, isAddition } = req.body;
    await Product.updateStock(productId, godownId, quantity, isAddition);
    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStockSummary = async (req, res) => {
  try {
    const stockValue = await Product.getTotalStockValue();
    const lowStockProducts = await Product.getLowStock(10);
    
    res.json({
      totalValue: parseFloat(stockValue.total_value),
      totalQuantity: parseInt(stockValue.total_quantity),
      lowStockProducts,
      lowStockCount: lowStockProducts.length
    });
  } catch (error) {
    console.error('Get stock summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
