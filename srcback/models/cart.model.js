import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true } // Precio actual del producto
    }
  ],
  total: { type: Number, required: true, default: 0 }, // Total del carrito
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CartSchema.pre('save', function (next) {
  this.total = this.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  next();
});

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;
