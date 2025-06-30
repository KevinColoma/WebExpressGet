const express = require('express');
const router = express.Router();
const Catalog = require('../models/catalogs');

// CRUD BÁSICO
router.get('/catalogs', async (req, res) => {
  try { res.json(await Catalog.find()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/catalogs/:id', async (req, res) => {
  try {
    const catalog = await Catalog.findById(req.params.id);
    if (!catalog) return res.status(404).json({ error: 'Catálogo no encontrado' });
    res.json(catalog);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/catalogs', async (req, res) => {
  try {
    const catalog = new Catalog(req.body); await catalog.save();
    res.status(201).json(catalog);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/catalogs/:id', async (req, res) => {
  try {
    const catalog = await Catalog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!catalog) return res.status(404).json({ error: 'Catálogo no encontrado' });
    res.json(catalog);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/catalogs/:id', async (req, res) => {
  try {
    const deleted = await Catalog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Catálogo no encontrado' });
    res.json({ message: 'Catálogo eliminado' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Descargar archivo de catálogo
router.get('/catalogs/download/:id', async (req, res) => {
  try {
    const catalog = await Catalog.findById(req.params.id);
    if (!catalog) return res.status(404).json({ error: 'Catálogo no encontrado' });
    // Suponiendo que filePath es ruta absoluta o relativa en tu servidor:
    res.download(catalog.filePath);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;