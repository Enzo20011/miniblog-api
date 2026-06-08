const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const { validateAuthor } = require('../middlewares/validationHandler');

router.get('/', authorController.getAll);
router.get('/:id', authorController.getById);
router.post('/', validateAuthor, authorController.create);
router.put('/:id', validateAuthor, authorController.update);
router.delete('/:id', authorController.delete);

module.exports = router;
