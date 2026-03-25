const sanidadService = require('../../src/services/sanidad.service');
const sanidadRepository = require('../../src/repository/sanidad.repository');
const ganadoClient = require('../../src/clients/ganadoClient');

jest.mock('../../src/repository/sanidad.repository');
jest.mock('../../src/clients/ganadoClient');

describe('SanidadService - Unit Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── registrarVacuna ───
  describe('registrarVacuna', () => {

    test('debe registrar vacuna a animal ACTIVO', async () => {
      ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-001', estado: 'ACTIVO' });
      sanidadRepository.registrarVacuna.mockResolvedValue({
        id: 'abc123', chapeta: 'ICA-001', nombreVacuna: 'Aftosa', dosis: '2ml', fecha: '2026-03-24'
      });

      const resultado = await sanidadService.registrarVacuna({
        chapeta: 'ICA-001', nombreVacuna: 'Aftosa', dosis: '2ml', fecha: '2026-03-24'
      });

      expect(resultado.nombreVacuna).toBe('Aftosa');
      expect(sanidadRepository.registrarVacuna).toHaveBeenCalledTimes(1);
    });

    test('debe lanzar error si animal esta VENDIDO', async () => {
      ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-003', estado: 'VENDIDO' });

      await expect(sanidadService.registrarVacuna({
        chapeta: 'ICA-003', nombreVacuna: 'Aftosa', dosis: '2ml', fecha: '2026-03-24'
      })).rejects.toThrow('Operación no permitida para un animal con estado: VENDIDO');
    });

    test('debe lanzar error si animal esta FALLECIDO', async () => {
      ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-004', estado: 'FALLECIDO' });

      await expect(sanidadService.registrarVacuna({
        chapeta: 'ICA-004', nombreVacuna: 'Aftosa', dosis: '2ml', fecha: '2026-03-24'
      })).rejects.toThrow('Operación no permitida para un animal con estado: FALLECIDO');
    });

    test('debe lanzar error si faltan campos obligatorios', async () => {
      await expect(sanidadService.registrarVacuna({ chapeta: 'ICA-001' }))
        .rejects.toThrow('Chapeta, nombre de vacuna, dosis y fecha son obligatorios');
    });

  });

});
// Al final de cada archivo de test
afterAll(async () => {
  jest.clearAllMocks();
});
