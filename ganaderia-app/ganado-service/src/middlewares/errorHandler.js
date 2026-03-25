const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Errores NO esperados
  console.error('ERROR INESPERADO:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
  });
};

module.exports = errorHandler;
