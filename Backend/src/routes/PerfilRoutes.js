const express = require('express');
const router = express.Router();
const PerfilController = require('../controllers/PerfilController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, PerfilController.getAll);
router.get('/:id', auth, PerfilController.getById);
router.post('/', auth, PerfilController.create);
router.put('/:id', auth, PerfilController.update);
router.delete('/:id', auth, PerfilController.delete);

module.exports = router;
