const express = require('express');
const router = express.Router();
const PublicacionController = require('../controllers/PublicacionController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, PublicacionController.getAll);
router.get('/:id', auth, PublicacionController.getById);
router.post('/', auth, PublicacionController.create);
router.put('/:id', auth, PublicacionController.update);
router.delete('/:id', auth, PublicacionController.delete);

module.exports = router;
