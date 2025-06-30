const express = require('express');
const router = express.Router();
const Product = require('../models/products');

// Obtener todos los productos
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar producto por nombre o código
router.get('/products/search', async (req, res) => {
  try {
    const q = req.query.q;
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { code: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Productos con stock bajo (menos de 10)
router.get('/products/low-stock', async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lt: 10 } });
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Productos más vendidos
router.get('/products/most-sold', async (req, res) => {
  try {
    const Sales = require('../models/sales');
    const agg = await Sales.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);
    res.json(agg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Productos por categoría
router.get('/products/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ categoryId: req.params.categoryId });
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Calcular el IVA de un producto
router.get('/products/:id/iva', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    const iva = product.salePrice * 0.12;
    res.json({ name: product.name, salePrice: product.salePrice, iva });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Vender un producto (disminuir stock)
router.post('/products/:id/vender', async (req, res) => {
  try {
    const cantidad = req.body.cantidad || 1;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    if (product.stock < cantidad) return res.status(400).json({ error: 'Stock insuficiente' });
    product.stock -= cantidad;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Agregar stock a un producto
router.post('/products/:id/agregar-stock', async (req, res) => {
  try {
    const cantidad = req.body.cantidad || 1;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    product.stock += cantidad;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener un producto por ID (debe ir después de rutas específicas)
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Crear un nuevo producto
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar un producto
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar un producto
router.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
