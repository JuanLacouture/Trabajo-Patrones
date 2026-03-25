const service = require('../services/animal.service');

const registrar = async (req, res, next) => {
  try {
    const animal = await service.registrarAnimal(req.body);
    res.status(201).json(animal);
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
    const animal = await service.obtenerAnimal(req.params.chapeta);
    res.status(200).json(animal);
  } catch (err) { next(err); }
};

const listar = async (req, res, next) => {
  try {
    const animales = await service.listarAnimales();
    res.status(200).json(animales);
  } catch (err) { next(err); }
};

const actualizarEstado = async (req, res, next) => {
  try {
    const resultado = await service.actualizarEstado(req.params.chapeta, req.body.estado);
    res.status(200).json(resultado);
  } catch (err) { next(err); }
};

module.exports = { registrar, obtener, listar, actualizarEstado };
