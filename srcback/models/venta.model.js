// models/Venta.js

import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true },
  nombre: { type: String, required: true },
});

const ventaSchema = new mongoose.Schema({
  fecha: { type: Date, required: true },
  total: { type: Number, required: true },
  productos: { type: [productoSchema], required: true },
  estado: { type: String, enum: ['Completada', 'Pendiente'], default: 'Completada' },
});

export default mongoose.model('Venta', ventaSchema);
