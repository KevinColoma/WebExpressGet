const express = require('express');
const router = express.Router();
const Category = require('../models/categories');

// CRUD BÁSICO
router.get('/categories', async (req, res) => {
  try { res.json(await Category.find()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/categories', async (req, res) => {
  try {
    const category = new Category(req.body); await category.save();
    res.status(201).json(category);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;