import Product from '../models/product.model.js';

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, imageUrl, stock, status } = req.body;
    
    const newProduct = new Product({
      name,
      category,
      price,
      imageUrl,
      stock,
      status
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
};

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  const { id } = req.params; // Asegúrate de recibir el id correcto del producto
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
};
// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};

// Agregar una reseña y calificación
export const addReview = async (req, res) => {
  const { id } = req.params; // ID del producto
  const { user, rating, review } = req.body; // Datos de la reseña

  try {
    // Buscar el producto
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Actualizar la calificación y reseñas
    const updatedReviews = product.reviews + 1;
    const updatedRating = ((product.rating * product.reviews) + rating) / updatedReviews;

    // Agregar la nueva reseña al arreglo de reseñas
    product.userReviews.push({ user, rating, review });
    product.rating = updatedRating;
    product.reviews = updatedReviews;

    // Guardar el producto actualizado
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error('Error al agregar la reseña:', error);
    res.status(500).json({ message: 'Error al agregar la reseña' });
  }
};