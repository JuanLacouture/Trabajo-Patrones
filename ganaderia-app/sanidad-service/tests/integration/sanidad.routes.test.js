process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

const request = require('supertest');
const app = require('../../index');
const db = require('../../src/config/firebase');
const ganadoClient = require('../../src/clients/ganadoClient');

jest.mock('../../src/clients/ganadoClient');

describe('SanidadRoutes - Integration Tests', () => {

  beforeEach(async () => {
    const vacunas = await db.collection('vacunaciones').get();
    const tratamientos = await db.collection('tratamientos').get();
    const leche = await db.collection('produccion_leche').get();
    const batch = db.batch();
    vacunas.docs.forEach(doc => batch.delete(doc.ref));
    tratamientos.docs.forEach(doc => batch.delete(doc.ref));
    leche.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }, 15000);

  afterAll(async () => {
    jest.clearAllMocks();
  });

  test('POST /api/sanidad/vacuna - debe registrar vacuna a animal ACTIVO', async () => {
    ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-001', estado: 'ACTIVO' });
    const res = await request(app).post('/api/sanidad/vacuna').send({
      chapeta: 'ICA-001', nombreVacuna: 'Aftosa', dosis: '2ml', fecha: '2026-03-24'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.nombreVacuna).toBe('Aftosa');
  });

  test('POST /api/sanidad/vacuna - debe fallar si animal VENDIDO', async () => {
    ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-003', estado: 'VENDIDO' });
    const res = await request(app).post('/api/sanidad/vacuna').send({
      chapeta: 'ICA-003', nombreVacuna: 'Aftosa', dosis: '2ml', fecha: '2026-03-24'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('VENDIDO');
  });

  test('POST /api/sanidad/vacuna - debe fallar si animal FALLECIDO', async () => {
    ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-004', estado: 'FALLECIDO' });
    const res = await request(app).post('/api/sanidad/vacuna').send({
      chapeta: 'ICA-004', nombreVacuna: 'Aftosa', dosis: '2ml', fecha: '2026-03-24'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('FALLECIDO');
  });

  test('POST /api/sanidad/tratamiento - debe registrar tratamiento a animal ACTIVO', async () => {
    ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-002', estado: 'ACTIVO' });
    const res = await request(app).post('/api/sanidad/tratamiento').send({
      chapeta: 'ICA-002', descripcion: 'Desparasitacion', fechaInicio: '2026-03-24', fechaFin: '2026-03-30'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.descripcion).toBe('Desparasitacion');
  });

  test('POST /api/sanidad/tratamiento - debe fallar sin campos obligatorios', async () => {
    const res = await request(app).post('/api/sanidad/tratamiento').send({ chapeta: 'ICA-002' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('obligatorios');
  });

  test('GET /api/sanidad/:chapeta/vacunas - debe listar vacunas del animal', async () => {
    ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-001', estado: 'ACTIVO' });
    await request(app).post('/api/sanidad/vacuna').send({
      chapeta: 'ICA-001', nombreVacuna: 'Brucelosis', dosis: '1ml', fecha: '2026-03-24'
    });
    const res = await request(app).get('/api/sanidad/ICA-001/vacunas');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('POST /api/produccion/leche - debe registrar leche a VACA ACTIVA', async () => {
    ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-001', estado: 'ACTIVO', categoria: 'VACA' });
    const res = await request(app).post('/api/produccion/leche').send({
      chapeta: 'ICA-001', litros: 12, fecha: '2026-03-24'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.litros).toBe(12);
  });

  test('POST /api/produccion/leche - debe fallar si animal es TORO', async () => {
    ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-002', estado: 'ACTIVO', categoria: 'TORO' });
    const res = await request(app).post('/api/produccion/leche').send({
      chapeta: 'ICA-002', litros: 5, fecha: '2026-03-24'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('VACA');
  });

  test('POST /api/produccion/leche - debe fallar si VACA VENDIDA', async () => {
    ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-003', estado: 'VENDIDO', categoria: 'VACA' });
    const res = await request(app).post('/api/produccion/leche').send({
      chapeta: 'ICA-003', litros: 8, fecha: '2026-03-24'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('VENDIDO');
  });

  test('GET /api/produccion/:chapeta/leche - debe listar produccion del animal', async () => {
    ganadoClient.getAnimal.mockResolvedValue({ chapeta: 'ICA-001', estado: 'ACTIVO', categoria: 'VACA' });
    await request(app).post('/api/produccion/leche').send({
      chapeta: 'ICA-001', litros: 10, fecha: '2026-03-24'
    });
    const res = await request(app).get('/api/produccion/ICA-001/leche');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

});
