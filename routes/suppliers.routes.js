const express = require('express');
const router = express.Router();
const Supplier = require('../models/suppliers');
const Product = require('../models/products');
const Catalog = require('../models/catalogs');

// CRUD BÁSICO
router.get('/suppliers', async (req, res) => {
  try { res.json(await Supplier.find()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/suppliers/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(supplier);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/suppliers', async (req, res) => {
  try {
    const supplier = new Supplier(req.body); await supplier.save();
    res.status(201).json(supplier);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/suppliers/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplier) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(supplier);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/suppliers/:id', async (req, res) => {
  try {
    const deleted = await Supplier.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json({ message: 'Proveedor eliminado' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Productos de un proveedor (suponiendo que hay un campo supplierId en producto)
router.get('/suppliers/:id/products', async (req, res) => {
  try {
    const products = await Product.find({ supplierId: req.params.id });
    res.json(products);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Asociar catálogo a proveedor
router.post('/suppliers/:id/add-catalog', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Proveedor no encontrado' });
    const catalogId = req.body.catalogId;
    supplier.catalogId = catalogId;
    await supplier.save();
    res.json(supplier);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;