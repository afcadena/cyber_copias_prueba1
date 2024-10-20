import Proveedor from '../models/provider.model.js';

// Obtener todos los proveedores
export const getProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.status(200).json(proveedores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
};

// Crear un proveedor
export const createProveedor = async (req, res) => {
  const { nombre, contacto, telefono, email, direccion } = req.body;

  try {
    const nuevoProveedor = new Proveedor({
      nombre,
      contacto,
      telefono,
      email,
      direccion
    });

    const proveedorGuardado = await nuevoProveedor.save();
    res.status(201).json(proveedorGuardado);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
};

// Actualizar un proveedor
export const updateProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, contacto, telefono, email, direccion } = req.body;

  try {
    const proveedorActualizado = await Proveedor.findByIdAndUpdate(
      id,
      { nombre, contacto, telefono, email, direccion },
      { new: true }
    );

    res.status(200).json(proveedorActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
};

// Eliminar un proveedor
export const deleteProveedor = async (req, res) => {
  const { id } = req.params;

  try {
    await Proveedor.findByIdAndDelete(id);
    res.status(200).json({ message: 'Proveedor eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
};
