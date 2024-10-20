import mongoose from 'mongoose';

const { Schema } = mongoose;

const CompraSchema = new Schema({
  proveedor: { type: String, required: true },
  fecha: { type: Date, required: true },
  total: { type: Number, required: true },
  estado: { type: String, default: 'Recibido' },
  productos: [
    {
      nombre: { type: String, required: true },
      cantidad: { type: Number, required: true },
      precio: { type: Number, required: true },
    },
  ],
});

export default mongoose.model('Compra', CompraSchema);
