const service = require('../services/sanidad.service');

const registrarVacuna = async (req, res, next) => {
  try {
    const resultado = await service.registrarVacuna(req.body);
    res.status(201).json(resultado);
  } catch (err) { next(err); }
};

const registrarTratamiento = async (req, res, next) => {
  try {
    const resultado = await service.registrarTratamiento(req.body);
    res.status(201).json(resultado);
  } catch (err) { next(err); }
};

const listarVacunas = async (req, res, next) => {
  try {
    const vacunas = await service.listarVacunas(req.params.chapeta);
    res.status(200).json(vacunas);
  } catch (err) { next(err); }
};

module.exports = { registrarVacuna, registrarTratamiento, listarVacunas };
