const express = require('express');
const router = express.Router();
const ContribuidorController = require('../controllers/ContribuidorController');
const auth = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/verifyRole');

router.get('/', auth, ContribuidorController.getAll);
router.get('/:id', auth, ContribuidorController.getById);
router.post('/', auth, isAdmin, ContribuidorController.create);
router.put('/:id', auth, isAdmin, ContribuidorController.update);
router.delete('/:id', auth, isAdmin, ContribuidorController.delete);

module.exports = router;
