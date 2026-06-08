// Middleware de validación para las entidades de la API

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validationHandler = {
  validateAuthor(req, res, next) {
    const { name, email, bio } = req.body;

    // Al crear (POST), name y email son requeridos
    if (req.method === 'POST') {
      if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'El campo "name" es obligatorio y no puede estar vacío.' });
      }
      if (!email || typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({ error: 'El campo "email" es obligatorio y no puede estar vacío.' });
      }
    }

    // Al actualizar (PUT), si se proveen name o email, validamos que no estén vacíos
    if (req.method === 'PUT') {
      if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
        return res.status(400).json({ error: 'El campo "name" no puede estar vacío.' });
      }
      if (email !== undefined && (typeof email !== 'string' || email.trim() === '')) {
        return res.status(400).json({ error: 'El campo "email" no puede estar vacío.' });
      }
    }

    // Validar formato de email
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ error: 'El formato del correo electrónico no es válido.' });
    }

    next();
  },

  validatePost(req, res, next) {
    const { title, content, author_id, published } = req.body;

    if (req.method === 'POST') {
      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'El campo "title" es obligatorio y no puede estar vacío.' });
      }
      if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({ error: 'El campo "content" es obligatorio y no puede estar vacío.' });
      }
      if (author_id === undefined || author_id === null) {
        return res.status(400).json({ error: 'El campo "author_id" es obligatorio.' });
      }
      if (!Number.isInteger(Number(author_id)) || Number(author_id) <= 0) {
        return res.status(400).json({ error: 'El campo "author_id" debe ser un número entero positivo.' });
      }
    }

    if (req.method === 'PUT') {
      if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({ error: 'El campo "title" no puede estar vacío.' });
      }
      if (content !== undefined && (typeof content !== 'string' || content.trim() === '')) {
        return res.status(400).json({ error: 'El campo "content" no puede estar vacío.' });
      }
    }

    next();
  },

  validateComment(req, res, next) {
    const { post_id, author_id, content } = req.body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'El campo "content" es obligatorio y no puede estar vacío.' });
    }

    if (req.method === 'POST') {
      if (post_id === undefined || post_id === null) {
        return res.status(400).json({ error: 'El campo "post_id" es obligatorio.' });
      }
      if (!Number.isInteger(Number(post_id)) || Number(post_id) <= 0) {
        return res.status(400).json({ error: 'El campo "post_id" debe ser un número entero positivo.' });
      }
      if (author_id === undefined || author_id === null) {
        return res.status(400).json({ error: 'El campo "author_id" es obligatorio.' });
      }
      if (!Number.isInteger(Number(author_id)) || Number(author_id) <= 0) {
        return res.status(400).json({ error: 'El campo "author_id" debe ser un número entero positivo.' });
      }
    }

    next();
  }
};

module.exports = validationHandler;
