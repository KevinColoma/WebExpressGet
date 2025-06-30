const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  purchaseUnit: { type: String, required: true },
  quantityIncluded: { type: Number, required: true },
  saleUnit: { type: String, required: true },
  purchasePrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  stock: { type: Number, required: true },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' } // opcional: enlazar con proveedor si se requiere
});

module.exports = mongoose.model('Product', productSchema);