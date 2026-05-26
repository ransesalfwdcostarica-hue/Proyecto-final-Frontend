const express = require('express');
const router = express.Router();
const DetalleRazonReporteController = require('../controllers/DetalleRazonReporteController');
const auth = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/verifyRole');

router.get('/', auth, DetalleRazonReporteController.getAll);
router.get('/:id', auth, DetalleRazonReporteController.getById);
router.post('/', auth, isAdmin, DetalleRazonReporteController.create);
router.put('/:id', auth, isAdmin, DetalleRazonReporteController.update);
router.delete('/:id', auth, isAdmin, DetalleRazonReporteController.delete);

module.exports = router;
