const AppError = require('./AppError');

class AnimalInvalidStateError extends AppError {
  constructor(estado) {
    super(`Operación no permitida para un animal con estado: ${estado}`, 400);
  }
}
module.exports = AnimalInvalidStateError;
