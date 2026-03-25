const express = require('express');
const router = express.Router();
const controller = require('../controllers/potrero.controller');

router.post('/', controller.crear);
router.get('/', controller.listar);
router.post('/:nombre/asignar', controller.asignarAnimal);

module.exports = router;
