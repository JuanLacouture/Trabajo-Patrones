const repo = require('../repository/produccion.repository');
const { getAnimal } = require('../clients/ganadoClient');
const AnimalInvalidStateError = require('../exceptions/AnimalInvalidStateError');
const AppError = require('../exceptions/AppError');

const registrarLeche = async (data) => {
  const { chapeta, litros, fecha } = data;
  if (!chapeta || !litros || !fecha) {
    throw new AppError('Chapeta, litros y fecha son obligatorios', 400);
  }

  const animal = await getAnimal(chapeta);

  if (['VENDIDO', 'FALLECIDO'].includes(animal.estado)) {
    throw new AnimalInvalidStateError(animal.estado);
  }

  // Regla de negocio #3 — solo vacas
  if (animal.categoria !== 'VACA') {
    throw new AppError(`Solo se puede registrar leche a una VACA. Este animal es: ${animal.categoria}`, 400);
  }

  return await repo.registrarLeche({ chapeta, litros, fecha });
};

const listarLeche = async (chapeta) => repo.listarLechePorAnimal(chapeta);

module.exports = { registrarLeche, listarLeche };
