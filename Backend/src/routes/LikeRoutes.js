const express = require('express');
const router = express.Router();
const LikeController = require('../controllers/LikeController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, LikeController.getAll);
router.get('/:id', auth, LikeController.getById);
router.post('/', auth, LikeController.create);
router.put('/:id', auth, LikeController.update);
router.delete('/:id', auth, LikeController.delete);

module.exports = router;
