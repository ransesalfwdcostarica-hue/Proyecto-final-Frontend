const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const auth = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/verifyRole');

router.post('/login', UsuarioController.login);
router.post('/', UsuarioController.create);

// Rutas protegidas
router.get('/', auth, UsuarioController.getAll);
router.get('/:id', auth, UsuarioController.getById);
router.put('/:id', auth, UsuarioController.update);
router.patch('/:id', auth, UsuarioController.update);
router.delete('/:id', auth, isAdmin, UsuarioController.delete);

// Follow / unfollow
router.post('/:id/follow', auth, UsuarioController.follow);

module.exports = router;
