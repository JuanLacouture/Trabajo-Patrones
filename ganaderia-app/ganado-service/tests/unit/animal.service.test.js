const animalService = require('../../src/services/animal.service');
const animalRepository = require('../../src/repository/animal.repository');

// Mock del repositorio completo
jest.mock('../../src/repository/animal.repository');

describe('AnimalService - Unit Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── registrarAnimal ───
  describe('registrarAnimal', () => {

    test('debe registrar un animal correctamente', async () => {
      const datos = { chapeta: 'ICA-001', categoria: 'VACA', pesoInicial: 320, precioPorKilo: 9500 };
      animalRepository.crearAnimal.mockResolvedValue({ ...datos, estado: 'ACTIVO' });

      const resultado = await animalService.registrarAnimal(datos);

      expect(resultado.chapeta).toBe('ICA-001');
      expect(resultado.estado).toBe('ACTIVO');
      expect(animalRepository.crearAnimal).toHaveBeenCalledTimes(1);
    });

    test('debe lanzar error si falta la chapeta', async () => {
      const datos = { categoria: 'VACA', pesoInicial: 320, precioPorKilo: 9500 };

      await expect(animalService.registrarAnimal(datos))
        .rejects.toThrow('Chapeta, categoría, peso inicial y precio por kilo son obligatorios');
    });

    test('debe lanzar error si la categoria es invalida', async () => {
      const datos = { chapeta: 'ICA-001', categoria: 'PERRO', pesoInicial: 320, precioPorKilo: 9500 };

      await expect(animalService.registrarAnimal(datos))
        .rejects.toThrow('Categoría inválida');
    });

    test('debe lanzar error si falta el peso inicial', async () => {
      const datos = { chapeta: 'ICA-001', categoria: 'VACA', precioPorKilo: 9500 };

      await expect(animalService.registrarAnimal(datos))
        .rejects.toThrow('Chapeta, categoría, peso inicial y precio por kilo son obligatorios');
    });

  });

  // ─── obtenerAnimal ───
  describe('obtenerAnimal', () => {

    test('debe retornar el animal si existe', async () => {
      animalRepository.obtenerAnimalPorChapeta.mockResolvedValue({
        chapeta: 'ICA-001', categoria: 'VACA', estado: 'ACTIVO'
      });

      const animal = await animalService.obtenerAnimal('ICA-001');

      expect(animal.chapeta).toBe('ICA-001');
      expect(animalRepository.obtenerAnimalPorChapeta).toHaveBeenCalledWith('ICA-001');
    });

    test('debe lanzar AnimalNotFoundError si no existe', async () => {
      animalRepository.obtenerAnimalPorChapeta.mockResolvedValue(null);

      await expect(animalService.obtenerAnimal('ICA-999'))
        .rejects.toThrow('Animal con chapeta ICA-999 no encontrado');
    });

  });

  // ─── actualizarEstado ───
  describe('actualizarEstado', () => {

    test('debe actualizar el estado correctamente', async () => {
      animalRepository.obtenerAnimalPorChapeta.mockResolvedValue({
        chapeta: 'ICA-001', estado: 'ACTIVO'
      });
      animalRepository.actualizarAnimal.mockResolvedValue({
        chapeta: 'ICA-001', estado: 'VENDIDO'
      });

      const resultado = await animalService.actualizarEstado('ICA-001', 'VENDIDO');

      expect(resultado.estado).toBe('VENDIDO');
      expect(animalRepository.actualizarAnimal).toHaveBeenCalledTimes(1);
    });

  });

});
