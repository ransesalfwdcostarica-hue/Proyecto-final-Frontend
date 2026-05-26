const express = require('express');
const router = express.Router();
const TemaEnTendenciaController = require('../controllers/TemaEnTendenciaController');
const auth = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/verifyRole');

router.get('/', TemaEnTendenciaController.getAll);
router.get('/:id', TemaEnTendenciaController.getById);
router.post('/', auth, isAdmin, TemaEnTendenciaController.create);
router.put('/:id', auth, isAdmin, TemaEnTendenciaController.update);
router.delete('/:id', auth, isAdmin, TemaEnTendenciaController.delete);

module.exports = router;
