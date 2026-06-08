const db = require('../config/db');

const commentService = {
  async getByPostId(postId) {
    // Verificar si la publicación existe
    const postRes = await db.query('SELECT 1 FROM posts WHERE id = $1', [postId]);
    if (postRes.rowCount === 0) {
      return null;
    }

    const res = await db.query(
      'SELECT * FROM comments WHERE post_id = $1 ORDER BY id ASC',
      [postId]
    );
    return res.rows;
  },

  async create({ post_id, author_id, content }) {
    try {
      const res = await db.query(
        'INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3) RETURNING *',
        [post_id, author_id, content]
      );
      return res.rows[0];
    } catch (err) {
      // Código 23503 de Postgres representa violación de clave foránea
      if (err.code === '23503') {
        const error = new Error('El autor o la publicación especificada no existe');
        error.statusCode = 400;
        throw error;
      }
      throw err;
    }
  },

  async delete(id) {
    const res = await db.query('DELETE FROM comments WHERE id = $1', [id]);
    return res.rowCount > 0;
  }
};

module.exports = commentService;
