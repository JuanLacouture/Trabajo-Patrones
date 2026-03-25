const service = require('../services/potrero.service');

const crear = async (req, res, next) => {
  try {
    const potrero = await service.crearPotrero(req.body);
    res.status(201).json(potrero);
  } catch (err) { next(err); }
};

const asignarAnimal = async (req, res, next) => {
  try {
    const resultado = await service.asignarAnimal(req.params.nombre, req.body.chapeta);
    res.status(200).json(resultado);
  } catch (err) { next(err); }
};

const listar = async (req, res, next) => {
  try {
    const potreros = await service.listarPotreros();
    res.status(200).json(potreros);
  } catch (err) { next(err); }
};

module.exports = { crear, asignarAnimal, listar };
