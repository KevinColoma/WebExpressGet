const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catalogSchema = new Schema({
  name: { type: String, required: true },
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Catalog', catalogSchema);