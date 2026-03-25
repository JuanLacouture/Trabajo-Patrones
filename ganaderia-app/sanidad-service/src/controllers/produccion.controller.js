const service = require('../services/produccion.service');

const registrarLeche = async (req, res, next) => {
  try {
    const resultado = await service.registrarLeche(req.body);
    res.status(201).json(resultado);
  } catch (err) { next(err); }
};

const listarLeche = async (req, res, next) => {
  try {
    const leche = await service.listarLeche(req.params.chapeta);
    res.status(200).json(leche);
  } catch (err) { next(err); }
};

module.exports = { registrarLeche, listarLeche };
