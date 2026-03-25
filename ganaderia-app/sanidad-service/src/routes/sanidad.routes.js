const express = require('express');
const router = express.Router();
const controller = require('../controllers/sanidad.controller');

router.post('/vacuna', controller.registrarVacuna);
router.post('/tratamiento', controller.registrarTratamiento);
router.get('/:chapeta/vacunas', controller.listarVacunas);

module.exports = router;
