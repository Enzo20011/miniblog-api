const db = require('../config/db');

const postService = {
  async getAll() {
    const res = await db.query('SELECT * FROM posts ORDER BY id ASC');
    return res.rows;
  },

  async getById(id) {
    const res = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  async getByAuthorId(authorId) {
    // Verificar si el autor existe
    const authorRes = await db.query('SELECT 1 FROM authors WHERE id = $1', [authorId]);
    if (authorRes.rowCount === 0) {
      return null;
    }

    // Obtener publicaciones con los detalles del autor
    const res = await db.query(
      `SELECT 
        p.id, p.title, p.content, p.author_id, p.published, p.created_at,
        a.name AS author_name, a.email AS author_email, a.bio AS author_bio
      FROM posts p
      INNER JOIN authors a ON p.author_id = a.id
      WHERE p.author_id = $1
      ORDER BY p.id ASC`,
      [authorId]
    );

    return res.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      author_id: row.author_id,
      published: row.published,
      created_at: row.created_at,
      author: {
        id: row.author_id,
        name: row.author_name,
        email: row.author_email,
        bio: row.author_bio
      }
    }));
  },

  async create({ title, content, author_id, published }) {
    try {
      const res = await db.query(
        'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, content, author_id, published === undefined ? false : !!published]
      );
      return res.rows[0];
    } catch (err) {
      // Código 23503 de Postgres representa violación de clave foránea (FK constraint)
      if (err.code === '23503') {
        const error = new Error('El autor especificado no existe');
        error.statusCode = 400;
        throw error;
      }
      throw err;
    }
  },

  async update(id, { title, content, published }) {
    const fields = [];
    const values = [];
    let index = 1;

    if (title !== undefined) {
      fields.push(`title = $${index++}`);
      values.push(title);
    }
    if (content !== undefined) {
      fields.push(`content = $${index++}`);
      values.push(content);
    }
    if (published !== undefined) {
      fields.push(`published = $${index++}`);
      values.push(!!published);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const queryStr = `UPDATE posts SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;

    const res = await db.query(queryStr, values);
    return res.rows[0] || null;
  },

  async delete(id) {
    const res = await db.query('DELETE FROM posts WHERE id = $1', [id]);
    return res.rowCount > 0;
  }
};

module.exports = postService;
