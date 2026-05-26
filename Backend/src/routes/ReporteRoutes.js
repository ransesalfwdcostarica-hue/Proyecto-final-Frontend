const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/ReporteController');
const auth = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/verifyRole');

router.get('/', auth, isAdmin, ReporteController.getAll);
router.get('/:id', auth, isAdmin, ReporteController.getById);
router.post('/', auth, ReporteController.create);
router.put('/:id', auth, isAdmin, ReporteController.update);
router.delete('/:id', auth, isAdmin, ReporteController.delete);

module.exports = router;
