const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  date: { type: Date, default: Date.now },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      total: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  confirmed: { type: Boolean, default: true },
  status: { type: String, default: 'completado' } // o 'devuelta', 'cancelada'
});

module.exports = mongoose.model('Sale', saleSchema);