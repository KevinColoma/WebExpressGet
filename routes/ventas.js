const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');

// Obtener todas las ventas
router.get('/', async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
});

// Agregar venta
router.post('/', async (req, res) => {
  try {
    const nuevaVenta = new Venta(req.body);
    await nuevaVenta.save();
    res.status(201).json(nuevaVenta);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear venta' });
  }
});

// Actualizar venta
router.put('/:id', async (req, res) => {
  try {
    const venta = await Venta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(venta);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar venta' });
  }
});

// Eliminar venta
router.delete('/:id', async (req, res) => {
  try {
    await Venta.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Venta eliminada' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar venta' });
  }
});

// 🧠 GET adicional: total de ventas
router.get('/total', async (req, res) => {
  try {
    const ventas = await Venta.aggregate([
      {
        $group: {
          _id: null,
          totalVentas: { $sum: "$cantidad" }
        }
      }
    ]);
    res.json({ totalVentas: ventas[0]?.totalVentas || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Error al calcular total de ventas' });
  }
});

module.exports = router;
