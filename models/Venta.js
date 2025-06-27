const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  cliente: String,
  producto: String,
  cantidad: Number,
  fecha: Date
}, { collection: 'Ventas' });

module.exports = mongoose.model('Venta', ventaSchema);
