const repo = require('../repository/animal.repository');
const AnimalNotFoundError = require('../exceptions/AnimalNotFoundError');
const AppError = require('../exceptions/AppError');

const CATEGORIAS_VALIDAS = ['TERNERO', 'NOVILLO', 'VACA', 'TORO'];

const registrarAnimal = async (data) => {
  const { chapeta, categoria, pesoInicial, precioPorKilo } = data;

  if (!chapeta || !categoria || !pesoInicial || !precioPorKilo) {
    throw new AppError('Chapeta, categoría, peso inicial y precio por kilo son obligatorios', 400);
  }
  if (!CATEGORIAS_VALIDAS.includes(categoria.toUpperCase())) {
    throw new AppError(`Categoría inválida. Use: ${CATEGORIAS_VALIDAS.join(', ')}`, 400);
  }

  return await repo.crearAnimal({ ...data, categoria: categoria.toUpperCase(), estado: 'ACTIVO' });
};

const obtenerAnimal = async (chapeta) => {
  const animal = await repo.obtenerAnimalPorChapeta(chapeta);
  if (!animal) throw new AnimalNotFoundError(chapeta);
  return animal;
};

const listarAnimales = async () => repo.listarAnimales();

const actualizarEstado = async (chapeta, estado) => {
  const animal = await obtenerAnimal(chapeta);
  return await repo.actualizarAnimal(chapeta, { estado: estado.toUpperCase() });
};

module.exports = { registrarAnimal, obtenerAnimal, listarAnimales, actualizarEstado };
