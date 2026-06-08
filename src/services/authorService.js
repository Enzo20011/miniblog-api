const db = require('../config/db');

const authorService = {
  async getAll() {
    const res = await db.query('SELECT * FROM authors ORDER BY id ASC');
    return res.rows;
  },

  async getById(id) {
    const res = await db.query('SELECT * FROM authors WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  async create({ name, email, bio }) {
    try {
      const res = await db.query(
        'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
        [name, email, bio || null]
      );
      return res.rows[0];
    } catch (err) {
      // Código 23505 de Postgres representa violación de restricción UNIQUE (email duplicado)
      if (err.code === '23505') {
        const error = new Error('El email ya está registrado');
        error.statusCode = 400;
        throw error;
      }
      throw err;
    }
  },

  async update(id, { name, email, bio }) {
    const fields = [];
    const values = [];
    let index = 1;

    if (name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }
    if (email !== undefined) {
      fields.push(`email = $${index++}`);
      values.push(email);
    }
    if (bio !== undefined) {
      fields.push(`bio = $${index++}`);
      values.push(bio);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const queryStr = `UPDATE authors SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;

    try {
      const res = await db.query(queryStr, values);
      return res.rows[0] || null;
    } catch (err) {
      if (err.code === '23505') {
        const error = new Error('El email ya está registrado');
        error.statusCode = 400;
        throw error;
      }
      throw err;
    }
  },

  async delete(id) {
    const res = await db.query('DELETE FROM authors WHERE id = $1', [id]);
    return res.rowCount > 0;
  }
};

module.exports = authorService;
