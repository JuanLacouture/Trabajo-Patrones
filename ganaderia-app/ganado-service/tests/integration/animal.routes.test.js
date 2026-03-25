process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

const request = require('supertest');
const app = require('../../index');
const db = require('../../src/config/firebase');

describe('AnimalRoutes - Integration Tests', () => {

  // Limpiar colección antes de cada test
  beforeEach(async () => {
    const snapshot = await db.collection('animales').get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  });

  afterAll(async () => {
    await app.close?.();
  });

  // ─── POST /api/animales ───
  test('POST /api/animales - debe crear un animal correctamente', async () => {
    const res = await request(app).post('/api/animales').send({
      chapeta: 'ICA-001',
      categoria: 'VACA',
      pesoInicial: 320,
      precioPorKilo: 9500,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.chapeta).toBe('ICA-001');
    expect(res.body.estado).toBe('ACTIVO');
  });

  test('POST /api/animales - debe fallar sin chapeta', async () => {
    const res = await request(app).post('/api/animales').send({
      categoria: 'VACA',
      pesoInicial: 320,
      precioPorKilo: 9500,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('obligatorios');
  });

  test('POST /api/animales - debe fallar con categoria invalida', async () => {
    const res = await request(app).post('/api/animales').send({
      chapeta: 'ICA-002',
      categoria: 'PERRO',
      pesoInicial: 100,
      precioPorKilo: 5000,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Categoría inválida');
  });

  // ─── GET /api/animales ───
  test('GET /api/animales - debe listar animales', async () => {
    await request(app).post('/api/animales').send({
      chapeta: 'ICA-001', categoria: 'VACA', pesoInicial: 320, precioPorKilo: 9500
    });

    const res = await request(app).get('/api/animales');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // ─── GET /api/animales/:chapeta ───
  test('GET /api/animales/:chapeta - debe retornar el animal', async () => {
    await request(app).post('/api/animales').send({
      chapeta: 'ICA-001', categoria: 'VACA', pesoInicial: 320, precioPorKilo: 9500
    });

    const res = await request(app).get('/api/animales/ICA-001');
    expect(res.statusCode).toBe(200);
    expect(res.body.chapeta).toBe('ICA-001');
  });

  test('GET /api/animales/:chapeta - debe retornar 404 si no existe', async () => {
    const res = await request(app).get('/api/animales/ICA-999');
    expect(res.statusCode).toBe(404);
  });

  // ─── PATCH /api/animales/:chapeta/estado ───
  test('PATCH /api/animales/:chapeta/estado - debe actualizar estado', async () => {
    await request(app).post('/api/animales').send({
      chapeta: 'ICA-001', categoria: 'VACA', pesoInicial: 320, precioPorKilo: 9500
    });

    const res = await request(app)
      .patch('/api/animales/ICA-001/estado')
      .send({ estado: 'VENDIDO' });

    expect(res.statusCode).toBe(200);
    expect(res.body.estado).toBe('VENDIDO');
  });

});
