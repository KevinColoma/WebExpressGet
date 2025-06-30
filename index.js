// ejemplo
// GET: https://api-bazar-express.onrender.com/productos
// POST: https://api-bazar-express.onrender.com/productos

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error de conexión:', err.message));

// Rutas URIS originales
app.use('/clientes', require('./routes/clientes'));
app.use('/productos', require('./routes/productos'));
app.use('/ventas', require('./routes/ventas'));

// Rutas adicionales (de index2)
app.use(require('./routes/products.routes'));
app.use(require('./routes/categories.routes'));
app.use(require('./routes/suppliers.routes'));
app.use(require('./routes/clients.routes'));
app.use(require('./routes/sales.routes'));
app.use(require('./routes/catalogs.routes'));
app.use(require('./routes/notifications.routes'));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

//index.js:
/*
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); //  Cargar variables desde .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Conexión a MongoDB usando la URI del .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Rutas
app.use('/clientes', require('./routes/clientes'));
app.use('/productos', require('./routes/productos'));
app.use('/ventas', require('./routes/ventas'));

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
*/
