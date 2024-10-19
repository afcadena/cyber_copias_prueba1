import Pedido from '../models/pedido.model.js';
import User from '../models/user.models.js'; // Asegúrate de que la ruta es correcta

// Obtener todos los pedidos
export const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pedidos', error });
  }
};



export const createPedido = async (req, res) => {
    try {
      const { userId, email, casa, telefono, products, total, direccion, state } = req.body;
  
      // Validación de campos requeridos
      if (!userId || !email || !casa || !telefono || !products || !total || !direccion || !state) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
      }
  
      // Crear el nuevo pedido con los datos del body
      const nuevoPedido = new Pedido({
        cliente: email, // O el campo que quieras usar como cliente
        total,
        products,
        shippingDetails: {
          direccion,
          casa,
          telefono,
          state,
        },
      });
  
      const savedPedido = await nuevoPedido.save();
  
      // Actualizar la información del usuario
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { email, casa, telefono }, // Campos a actualizar
        { new: true }
      );
  
      // Verificar si se actualizó el usuario correctamente
      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
      }
  
      // Enviar la respuesta con el pedido guardado y usuario actualizado
      res.status(201).json({ pedido: savedPedido, user: updatedUser });
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      res.status(500).json({ message: 'Error al crear el pedido', error: error.message });
    }
  };
  
  
// Actualizar un pedido
export const updatePedido = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPedido = await Pedido.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedPedido);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el pedido', error });
  }
};

// Eliminar un pedido
export const deletePedido = async (req, res) => {
  const { id } = req.params;
  try {
    await Pedido.findByIdAndDelete(id);
    res.status(200).json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el pedido', error });
  }
};