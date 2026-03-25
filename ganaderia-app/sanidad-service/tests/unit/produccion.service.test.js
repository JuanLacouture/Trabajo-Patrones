const produccionService = require('../../src/services/produccion.service');
const produccionRepository = require('../../src/repository/produccion.repository');
const ganadoClient = require('../../src/clients/ganadoClient');

jest.mock('../../src/repository/produccion.repository');
jest.mock('../../src/clients/ganadoClient');

describe('ProduccionService - Unit Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('debe registrar leche a una VACA ACTIVA', async () => {
    ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-001', estado: 'ACTIVO', categoria: 'VACA' });
    produccionRepository.registrarLeche.mockResolvedValue({
      id: 'xyz789', chapeta: 'ICA-001', litros: 12, fecha: '2026-03-24'
    });

    const resultado = await produccionService.registrarLeche({
      chapeta: 'ICA-001', litros: 12, fecha: '2026-03-24'
    });

    expect(resultado.litros).toBe(12);
    expect(produccionRepository.registrarLeche).toHaveBeenCalledTimes(1);
  });

  test('debe lanzar error si el animal es TORO', async () => {
    ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-002', estado: 'ACTIVO', categoria: 'TORO' });

    await expect(produccionService.registrarLeche({
      chapeta: 'ICA-002', litros: 5, fecha: '2026-03-24'
    })).rejects.toThrow('Solo se puede registrar leche a una VACA. Este animal es: TORO');
  });

  test('debe lanzar error si la vaca esta VENDIDA', async () => {
    ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-003', estado: 'VENDIDO', categoria: 'VACA' });

    await expect(produccionService.registrarLeche({
      chapeta: 'ICA-003', litros: 8, fecha: '2026-03-24'
    })).rejects.toThrow('Operación no permitida para un animal con estado: VENDIDO');
  });

  test('debe lanzar error si faltan campos obligatorios', async () => {
    await expect(produccionService.registrarLeche({ chapeta: 'ICA-001' }))
      .rejects.toThrow('Chapeta, litros y fecha son obligatorios');
  });

});
// Al final de cada archivo de test
afterAll(async () => {
  jest.clearAllMocks();
});
