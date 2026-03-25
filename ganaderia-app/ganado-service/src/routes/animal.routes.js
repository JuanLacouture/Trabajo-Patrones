const express = require('express');
const router = express.Router();
const controller = require('../controllers/animal.controller');

router.post('/', controller.registrar);
router.get('/', controller.listar);
router.get('/:chapeta', controller.obtener);
router.patch('/:chapeta/estado', controller.actualizarEstado);

module.exports = router;
