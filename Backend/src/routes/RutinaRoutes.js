const express = require('express');
const router = express.Router();
const RutinaController = require('../controllers/RutinaController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, RutinaController.getAll);
router.get('/:id', auth, RutinaController.getById);
router.post('/', auth, RutinaController.create);
router.put('/:id', auth, RutinaController.update);
router.delete('/:id', auth, RutinaController.delete);

module.exports = router;
