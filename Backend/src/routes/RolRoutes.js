const express = require('express');
const router = express.Router();
const RolController = require('../controllers/RolController');
const auth = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/verifyRole');

router.get('/', RolController.getAll);
router.get('/:id', RolController.getById);
router.post('/', auth, isAdmin, RolController.create);
router.put('/:id', auth, isAdmin, RolController.update);
router.delete('/:id', auth, isAdmin, RolController.delete);

module.exports = router;
