const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  telefono: String
}, { collection: 'Clientes' });

module.exports = mongoose.model('Cliente', clienteSchema);
