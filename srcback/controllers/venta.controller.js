// controllers/ventaController.js

import Venta from '../models/venta.model.js';
import Product from '../models/product.model.js';

// Obtener todas las ventas
export const getAllVentas = async (req, res) => {
  try {
    const ventas = await Venta.find().populate('productos.productoId');
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva venta
export const createVenta = async (req, res) => {
  try {
    const productosValidos = await Promise.all(
        req.body.productos.map(async (producto) => {
          const product = await Product.findById(producto.productoId);
          if (!product) {
            console.log(`Producto no encontrado: ${producto.productoId}`);
            throw new Error(`Producto no encontrado: ${producto.productoId}`);
          }
          return {
            id: product.id,
            productoId: product._id,  // corregir si no se está usando el campo correcto
            cantidad: producto.cantidad,
            precio: product.price,
            nombre: product.name,
          };
        })
      );

    const nuevaVenta = new Venta({
      fecha: req.body.fecha,
      total: req.body.total,
      productos: productosValidos,
      estado: req.body.estado,
    });

    const ventaGuardada = await nuevaVenta.save();
    res.status(201).json(ventaGuardada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar una venta
export const updateVenta = async (req, res) => {
  const { id } = req.params;
  try {
    const ventaActualizada = await Venta.findByIdAndUpdate(id, req.body, { new: true });
    if (!ventaActualizada) return res.status(404).json({ error: 'Venta no encontrada' });
    res.status(200).json(ventaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una venta
export const deleteVenta = async (req, res) => {
  const { id } = req.params;
  try {
    const ventaEliminada = await Venta.findByIdAndDelete(id);
    if (!ventaEliminada) return res.status(404).json({ error: 'Venta no encontrada' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


