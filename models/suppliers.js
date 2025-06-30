const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
  idNumber: { type: String, required: true },
  company: { type: String, required: true },
  contactName: { type: String, required: true },
  phone: { type: String, required: true },
  bankAccount: { type: String, required: true },
  bankName: { type: String, required: true },
  catalogId: { type: Schema.Types.ObjectId, ref: 'Catalog' }
});

module.exports = mongoose.model('Supplier', supplierSchema);