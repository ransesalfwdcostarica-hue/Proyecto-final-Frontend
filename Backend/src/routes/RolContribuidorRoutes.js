const express = require('express');
const router = express.Router();
const RolContribuidorController = require('../controllers/RolContribuidorController');
const auth = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/verifyRole');

router.get('/', RolContribuidorController.getAll);
router.get('/:id', RolContribuidorController.getById);
router.post('/', auth, isAdmin, RolContribuidorController.create);
router.put('/:id', auth, isAdmin, RolContribuidorController.update);
router.delete('/:id', auth, isAdmin, RolContribuidorController.delete);

module.exports = router;
