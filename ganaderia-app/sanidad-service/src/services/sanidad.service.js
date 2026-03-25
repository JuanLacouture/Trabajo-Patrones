const repo = require('../repository/sanidad.repository');
const { getAnimal } = require('../clients/ganadoClient');
const AnimalInvalidStateError = require('../exceptions/AnimalInvalidStateError');
const AppError = require('../exceptions/AppError');

const registrarVacuna = async (data) => {
  const { chapeta, nombreVacuna, dosis, fecha } = data;
  if (!chapeta || !nombreVacuna || !dosis || !fecha) {
    throw new AppError('Chapeta, nombre de vacuna, dosis y fecha son obligatorios', 400);
  }

  const animal = await getAnimal(chapeta);

  if (['VENDIDO', 'FALLECIDO'].includes(animal.estado)) {
    throw new AnimalInvalidStateError(animal.estado);
  }

  return await repo.registrarVacuna({ chapeta, nombreVacuna, dosis, fecha });
};

const registrarTratamiento = async (data) => {
  const { chapeta, descripcion, fechaInicio, fechaFin } = data;
  if (!chapeta || !descripcion || !fechaInicio) {
    throw new AppError('Chapeta, descripción y fecha de inicio son obligatorios', 400);
  }

  const animal = await getAnimal(chapeta);

  if (['VENDIDO', 'FALLECIDO'].includes(animal.estado)) {
    throw new AnimalInvalidStateError(animal.estado);
  }

  return await repo.registrarTratamiento({ chapeta, descripcion, fechaInicio, fechaFin: fechaFin || null });
};

const listarVacunas = async (chapeta) => repo.listarVacunasPorAnimal(chapeta);

module.exports = { registrarVacuna, registrarTratamiento, listarVacunas };
