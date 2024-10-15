import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// Obtener el carrito del usuario autenticado
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

// Agregar un producto al carrito
export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Verificar si el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Obtener o crear el carrito del usuario
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      // Actualizar la cantidad
      existingItem.quantity += quantity;
    } else {
      // Agregar el nuevo producto
      cart.items.push({
        productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
};

// Actualizar la cantidad de un producto en el carrito
export const updateItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    res.status(500).json({ message: 'Error al actualizar el producto en el carrito' });
  }
};

// Eliminar un producto del carrito
export const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ message: 'Error al eliminar producto del carrito' });
  }
};

// Vaciar el carrito
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    res.status(500).json({ message: 'Error al vaciar el carrito' });
  }
};
