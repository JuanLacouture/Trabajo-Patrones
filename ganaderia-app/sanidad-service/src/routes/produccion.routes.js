const express = require('express');
const router = express.Router();
const controller = require('../controllers/produccion.controller');

router.post('/leche', controller.registrarLeche);
router.get('/:chapeta/leche', controller.listarLeche);

module.exports = router;
