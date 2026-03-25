const repo = require('../repository/potrero.repository');
const animalService = require('./animal.service');
const AppError = require('../exceptions/AppError');

const crearPotrero = async (data) => {
  const { nombre, capacidad } = data;
  if (!nombre || !capacidad) throw new AppError('Nombre y capacidad son obligatorios', 400);
  return await repo.crearPotrero(data);
};

const asignarAnimal = async (nombrePotrero, chapeta) => {
  // Validar que el animal existe y está activo
  const animal = await animalService.obtenerAnimal(chapeta);
  if (['VENDIDO', 'FALLECIDO'].includes(animal.estado)) {
    throw new AppError(`No se puede asignar un animal con estado ${animal.estado} a un potrero`, 400);
  }

  // Validar que el potrero existe y tiene capacidad
  const potrero = await repo.obtenerPotrero(nombrePotrero);
  if (!potrero) throw new AppError(`Potrero ${nombrePotrero} no encontrado`, 404);
  if (potrero.animales.length >= potrero.capacidad) {
    throw new AppError(`El potrero ${nombrePotrero} ya está lleno`, 400);
  }

  return await repo.asignarAnimal(nombrePotrero, chapeta);
};

const listarPotreros = async () => repo.listarPotreros();

module.exports = { crearPotrero, asignarAnimal, listarPotreros };
