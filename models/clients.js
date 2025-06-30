const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  taxid: { type: String, required: true },
  fullname: { type: String, required: true },
  address: { type: String },
  references: { type: String },
  phone: { type: String },
  email: { type: String }
});

module.exports = mongoose.model('Client', clientSchema);