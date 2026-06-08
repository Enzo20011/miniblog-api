// Middleware global para el manejo de errores

function errorHandler(err, req, res, next) {
  // Registrar el error en la consola del servidor para propósitos de depuración
  console.error('Error capturado por el middleware global:', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    error: message,
    // Mostrar stack trace solo en modo de desarrollo
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;
