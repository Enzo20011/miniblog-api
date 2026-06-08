const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { validatePost } = require('../middlewares/validationHandler');

router.get('/', postController.getAll);
router.get('/:id', postController.getById);
router.get('/author/:authorId', postController.getByAuthorId);
router.post('/', validatePost, postController.create);
router.put('/:id', validatePost, postController.update);
router.delete('/:id', postController.delete);

module.exports = router;
