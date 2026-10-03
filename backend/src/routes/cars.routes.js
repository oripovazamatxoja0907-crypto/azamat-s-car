const express = require('express');
const router = express.Router();
const controller = require('../controllers/cars.controller');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth.middleware');
const {
  createCarSchema,
  updateCarSchema,
} = require('../validations/car.validation');

router.use(requireAuth);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validate(createCarSchema), controller.create);
router.put('/:id', validate(updateCarSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;