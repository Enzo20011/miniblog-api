const commentService = require('../services/commentService');

const commentController = {
  async getByPostId(req, res, next) {
    try {
      const { postId } = req.params;
      const comments = await commentService.getByPostId(postId);
      if (!comments) {
        return res.status(404).json({ error: 'Publicación no encontrada' });
      }
      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { post_id, author_id, content } = req.body;
      const newComment = await commentService.create({ post_id, author_id, content });
      res.status(201).json(newComment);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const success = await commentService.delete(id);
      if (!success) {
        return res.status(404).json({ error: 'Comentario no encontrado para eliminar' });
      }
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
};

module.exports = commentController;
