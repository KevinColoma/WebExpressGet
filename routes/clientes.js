const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// Agregar cliente
router.post('/', async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();
    res.status(201).json(nuevoCliente);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear cliente' });
  }
});

// Actualizar cliente
router.put('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cliente);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar cliente' });
  }
});

// Eliminar cliente
router.delete('/:id', async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar cliente' });
  }
});

module.exports = router;
// Este archivo define las rutas para manejar las operaciones CRUD de los clientes.
// Incluye las rutas para obtener todos los clientes, agregar un nuevo cliente, actualizar un cliente