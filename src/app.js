const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
require('dotenv').config();

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Cargar documentación OpenAPI si existe
try {
  const openapiPath = path.join(__dirname, '../openapi.yaml');
  const swaggerDocument = YAML.load(openapiPath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Documentación OpenAPI cargada en /api-docs');
} catch (err) {
  console.warn('Advertencia: No se pudo cargar el archivo openapi.yaml', err.message);
}

// Ruta de bienvenida básica
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenido a la API de MiniBlog',
    docs: '/api-docs'
  });
});

// Registrar todas las rutas
app.use('/', routes);

// Middleware de manejo de errores (debe registrarse al final)
app.use(errorHandler);

module.exports = app;
