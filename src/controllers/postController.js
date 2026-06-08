const postService = require('../services/postService');

const postController = {
  async getAll(req, res, next) {
    try {
      const posts = await postService.getAll();
      res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await postService.getById(id);
      if (!post) {
        return res.status(404).json({ error: 'Publicación no encontrada' });
      }
      res.status(200).json(post);
    } catch (err) {
      next(err);
    }
  },

  async getByAuthorId(req, res, next) {
    try {
      const { authorId } = req.params;
      const posts = await postService.getByAuthorId(authorId);
      if (!posts) {
        return res.status(404).json({ error: 'Autor no encontrado' });
      }
      res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { title, content, author_id, published } = req.body;
      const newPost = await postService.create({ title, content, author_id, published });
      res.status(201).json(newPost);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, content, published } = req.body;
      const updatedPost = await postService.update(id, { title, content, published });
      if (!updatedPost) {
        return res.status(404).json({ error: 'Publicación no encontrada para actualizar' });
      }
      res.status(200).json(updatedPost);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const success = await postService.delete(id);
      if (!success) {
        return res.status(404).json({ error: 'Publicación no encontrada para eliminar' });
      }
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
};

module.exports = postController;
