import Compra from '../models/compra.model.js';

// Obtener todas las compras
export const getAllCompras = async (req, res) => {
  try {
    const compras = await Compra.find();
    res.json(compras);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear una nueva compra
export const createCompra = async (req, res) => {
  const { proveedor, fecha, total, productos, estado } = req.body;

  // Validaciones básicas
  if (!proveedor || !fecha || total == null || !productos || productos.length === 0) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  const nuevaCompra = new Compra({
    proveedor,
    fecha,
    total,
    productos,
    estado: estado || 'Recibido',
  });

  try {
    const compraCreada = await nuevaCompra.save();
    res.status(201).json(compraCreada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Actualizar una compra
export const updateCompra = async (req, res) => {
  try {
    const compraActualizada = await Compra.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!compraActualizada) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }
    res.json(compraActualizada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Eliminar una compra
export const deleteCompra = async (req, res) => {
  try {
    const compraEliminada = await Compra.findByIdAndDelete(req.params.id);
    if (!compraEliminada) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }
    res.json({ message: 'Compra eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
