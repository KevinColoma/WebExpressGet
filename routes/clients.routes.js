const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const Sales = require('../models/sales');

// CRUD BÁSICO
router.get('/clients', async (req, res) => {
  try { res.json(await Client.find()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/clients/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(client);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/clients', async (req, res) => {
  try {
    const client = new Client(req.body); await client.save();
    res.status(201).json(client);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/clients/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(client);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/clients/:id', async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ message: 'Cliente eliminado' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Historial de compras de un cliente
router.get('/clients/:id/history', async (req, res) => {
  try {
    const sales = await Sales.find({ clientId: req.params.id });
    res.json(sales);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Clientes top (más compras)
router.get('/clients/top', async (req, res) => {
  try {
    const agg = await Sales.aggregate([
      { $group: { _id: "$clientId", total: { $sum: "$total" }, ventas: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ]);
    res.json(agg);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;