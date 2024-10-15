import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'El nombre del producto es obligatorio'], trim: true },
  category: { type: String, required: [true, 'La categoría del producto es obligatoria'], trim: true },
  price: { 
    type: Number, 
    required: [true, 'El precio es obligatorio'], 
    min: [0, 'El precio no puede ser negativo'] 
  },
  imageUrl: { 
    type: [String], // Se deja como un arreglo para múltiples imágenes
    validate: [arrayLimit, '{PATH} excede el límite de 5 imágenes'],
    required: [true, 'Se requiere al menos una URL de imagen']
  },
  rating: { type: Number, default: 0, min: [0, 'La calificación no puede ser negativa'], max: [5, 'La calificación máxima es 5'] },
  reviews: { type: Number, default: 0, min: [0, 'Las reseñas no pueden ser negativas'] },
  stock: { 
    type: Number, 
    required: [true, 'El stock es obligatorio'], 
    min: [0, 'El stock no puede ser negativo'] 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware para actualizar automáticamente el campo `updatedAt` antes de cada 'save'
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Validar que haya un límite de imágenes
function arrayLimit(val) {
  return val.length <= 5;
}

const Product = mongoose.model('Product', ProductSchema);

export default Product;
