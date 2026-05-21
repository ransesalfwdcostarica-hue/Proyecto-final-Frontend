const express = require('express');
const router = express.Router();
const ComentarioController = require('../controllers/ComentarioController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, ComentarioController.getAll);
router.get('/:id', auth, ComentarioController.getById);
router.post('/', auth, ComentarioController.create);
router.put('/:id', auth, ComentarioController.update);
router.delete('/:id', auth, ComentarioController.delete);

module.exports = router;
