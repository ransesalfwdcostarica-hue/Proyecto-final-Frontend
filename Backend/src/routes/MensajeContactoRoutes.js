const express = require('express');
const router = express.Router();
const MensajeContactoController = require('../controllers/MensajeContactoController');
const auth = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/verifyRole');

router.get('/', auth, isAdmin, MensajeContactoController.getAll);
router.get('/:id', auth, isAdmin, MensajeContactoController.getById);
router.post('/', MensajeContactoController.create); // Public for contact form
router.put('/:id', auth, isAdmin, MensajeContactoController.update);
router.delete('/:id', auth, isAdmin, MensajeContactoController.delete);

module.exports = router;
