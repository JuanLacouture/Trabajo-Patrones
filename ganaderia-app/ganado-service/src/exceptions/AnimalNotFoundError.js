const AppError = require('./AppError');

class AnimalNotFoundError extends AppError {
  constructor(chapeta) {
    super(`Animal con chapeta ${chapeta} no encontrado`, 404);
  }
}
module.exports = AnimalNotFoundError;
