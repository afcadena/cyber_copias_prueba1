import mongoose from 'mongoose';
import axios from 'axios';

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/cybercopiasfinal', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Definición del esquema y modelo para los productos
const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    imageUrl: [String],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    stock: Number,
    status: String,
});

const Product = mongoose.model('Product', productSchema);

// Función para obtener datos de JSON Server y hacer upsert
const transferData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/products');
        const products = response.data;

        // Procesar y hacer upsert (insertar o actualizar) de los productos en MongoDB
        for (const product of products) {
            const { id, ...productWithoutId } = product;

            // Buscar por nombre del producto y hacer upsert
            await Product.findOneAndUpdate(
                { name: productWithoutId.name },  // Buscar por nombre
                productWithoutId,                 // Datos a actualizar
                { upsert: true, new: true }       // Insertar si no existe
            );
        }

        console.log('Datos transferidos exitosamente a MongoDB mediante upsert');
    } catch (error) {
        console.error('Error al transferir datos:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Ejecutar la función de transferencia
transferData();
