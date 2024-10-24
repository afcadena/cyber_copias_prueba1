import cloudinary from '../cloudinary.js';
import Product from '../models/product.model.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configurar multer para Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
  },
});

const upload = multer({ storage: storage });

// Middleware para manejar la carga de archivos

// Crear un nuevo producto con imagen subida a Cloudinary
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, status, imageUrl } = req.body;

    const newProduct = new Product({
      name,
      category,
      price,
      imageUrl,
      stock,
      status,
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
  const { id } = req.params;
  try {
    let updateData = req.body;

    // Si se proporciona una nueva imagen, actualizarla en Cloudinary
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Eliminar la imagen de Cloudinary
    if (product.imageUrl) {
      const publicId = product.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
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

// Función para cargar imágenes
export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha proporcionado ninguna imagen' });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error);
    res.status(500).json({ message: 'Error al subir la imagen' });
  }
};