const express = require('express');
const router = express.Router();
const Sale = require('../models/sales');
const Product = require('../models/products');
const Client = require('../models/clients');

// CRUD BÁSICO
router.get('/sales', async (req, res) => {
  try { res.json(await Sale.find()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/sales/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(sale);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/sales', async (req, res) => {
  try {
    // Regla: al crear venta, baja stock
    const sale = new Sale(req.body);
    for (const item of sale.items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: `Producto no encontrado: ${item.productId}` });
      if (product.stock < item.quantity) return res.status(400).json({ error: `Stock insuficiente para ${product.name}` });
      product.stock -= item.quantity;
      await product.save();
    }
    await sale.save();
    res.status(201).json(sale);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/sales/:id', async (req, res) => {
  // Puede requerir lógica avanzada para revertir stock anterior y aplicar el nuevo
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sale) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(sale);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/sales/:id', async (req, res) => {
  try {
    const deleted = await Sale.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Venta no encontrada' });
    // Regla: Al eliminar venta, regresa stock
    for (const item of deleted.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
    res.json({ message: 'Venta eliminada y stock restituido' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Ventas por cliente
router.get('/sales/client/:clientId', async (req, res) => {
  try {
    const sales = await Sale.find({ clientId: req.params.clientId });
    res.json(sales);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Ventas por rango de fechas
router.get('/sales/date-range', async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    if (start && end) filter.date = { $gte: new Date(start), $lte: new Date(end) };
    const sales = await Sale.find(filter);
    res.json(sales);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Confirmar venta (opcional, ya incluida en POST /sales)
router.post('/sales/:id/confirm', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Venta no encontrada' });
    for (const item of sale.items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: `Producto no encontrado: ${item.productId}` });
      if (product.stock < item.quantity) return res.status(400).json({ error: `Stock insuficiente para ${product.name}` });
      product.stock -= item.quantity;
      await product.save();
    }
    sale.confirmed = true;
    await sale.save();
    res.json(sale);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Devolución/cancelación de venta (aumenta stock)
router.post('/sales/:id/return', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Venta no encontrada' });
    for (const item of sale.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
    sale.status = 'devuelta';
    await sale.save();
    res.json({ message: 'Venta devuelta y stock restituido', sale });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;