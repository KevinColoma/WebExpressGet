const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  stock: Number
}, { collection: 'Productos' });

module.exports = mongoose.model('Producto', productoSchema);
