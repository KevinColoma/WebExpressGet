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
