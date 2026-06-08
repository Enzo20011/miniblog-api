const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { validateComment } = require('../middlewares/validationHandler');

router.get('/post/:postId', commentController.getByPostId);
router.post('/', validateComment, commentController.create);
router.delete('/:id', commentController.delete);

module.exports = router;
