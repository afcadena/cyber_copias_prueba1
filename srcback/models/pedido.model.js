import mongoose from 'mongoose';

const PedidoSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, default: 'En preparación' },
  total: { type: Number, required: true },
  products: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: String, required: true },
    },
  ],
  shippingDetails: {
    direccion: { type: String, required: true },
    casa: { type: String },
    telefono: { type: String, required: true },
    state: { type: String, required: true },
  },
});

const Pedido = mongoose.model('Pedido', PedidoSchema);
export default Pedido;
