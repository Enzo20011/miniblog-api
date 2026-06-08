const authorService = require('../services/authorService');

const authorController = {
  async getAll(req, res, next) {
    try {
      const authors = await authorService.getAll();
      res.status(200).json(authors);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const author = await authorService.getById(id);
      if (!author) {
        return res.status(404).json({ error: 'Autor no encontrado' });
      }
      res.status(200).json(author);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name, email, bio } = req.body;
      const newAuthor = await authorService.create({ name, email, bio });
      res.status(201).json(newAuthor);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, bio } = req.body;
      const updatedAuthor = await authorService.update(id, { name, email, bio });
      if (!updatedAuthor) {
        return res.status(404).json({ error: 'Autor no encontrado para actualizar' });
      }
      res.status(200).json(updatedAuthor);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const success = await authorService.delete(id);
      if (!success) {
        return res.status(404).json({ error: 'Autor no encontrado para eliminar' });
      }
      res.status(204).end(); // No content
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authorController;
