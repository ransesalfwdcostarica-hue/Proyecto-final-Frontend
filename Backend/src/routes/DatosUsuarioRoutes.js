const express = require('express');
const router = express.Router();
const DatosUsuarioController = require('../controllers/DatosUsuarioController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, DatosUsuarioController.getAll);
router.get('/:id', auth, DatosUsuarioController.getById);
router.post('/', auth, DatosUsuarioController.create);
router.put('/:id', auth, DatosUsuarioController.update);
router.delete('/:id', auth, DatosUsuarioController.delete);

module.exports = router;
