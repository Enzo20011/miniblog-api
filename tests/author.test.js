const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

// Mockear la base de datos para independizar los tests de un servidor PostgreSQL real
jest.mock('../src/config/db');

describe('Authors API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /authors', () => {
    it('debería retornar la lista de autores con estado 200', async () => {
      const mockAuthors = [
        { id: 1, name: 'Ana García', email: 'ana@example.com', bio: 'Bio Ana' },
        { id: 2, name: 'Carlos Ruiz', email: 'carlos@example.com', bio: 'Bio Carlos' }
      ];
      db.query.mockResolvedValueOnce({ rows: mockAuthors });

      const res = await request(app).get('/authors');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockAuthors);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM authors ORDER BY id ASC');
    });
  });

  describe('GET /authors/:id', () => {
    it('debería retornar el detalle del autor con estado 200 si existe', async () => {
      const mockAuthor = { id: 1, name: 'Ana García', email: 'ana@example.com', bio: 'Bio Ana' };
      db.query.mockResolvedValueOnce({ rows: [mockAuthor] });

      const res = await request(app).get('/authors/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockAuthor);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM authors WHERE id = $1', ['1']);
    });

    it('debería retornar 404 si el autor no existe', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).get('/authors/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Autor no encontrado' });
    });
  });

  describe('POST /authors', () => {
    it('debería crear un autor y retornar estado 201', async () => {
      const mockAuthor = { id: 4, name: 'Juan Perez', email: 'juan@example.com', bio: 'Bio Juan' };
      db.query.mockResolvedValueOnce({ rows: [mockAuthor] });

      const res = await request(app)
        .post('/authors')
        .send({ name: 'Juan Perez', email: 'juan@example.com', bio: 'Bio Juan' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(mockAuthor);
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
        ['Juan Perez', 'juan@example.com', 'Bio Juan']
      );
    });

    it('debería retornar 400 si falta el nombre', async () => {
      const res = await request(app)
        .post('/authors')
        .send({ email: 'juan@example.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('name');
    });

    it('debería retornar 400 si falta el email o tiene formato inválido', async () => {
      const res = await request(app)
        .post('/authors')
        .send({ name: 'Juan Perez', email: 'email_invalido' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('correo electrónico');
    });

    it('debería retornar 400 si el email ya existe', async () => {
      const dbError = new Error('duplicate key value violates unique constraint');
      dbError.code = '23505';
      db.query.mockRejectedValueOnce(dbError);

      const res = await request(app)
        .post('/authors')
        .send({ name: 'Juan Perez', email: 'ana@example.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('El email ya está registrado');
    });
  });

  describe('PUT /authors/:id', () => {
    it('debería actualizar un autor y retornar estado 200', async () => {
      const mockUpdatedAuthor = { id: 1, name: 'Ana García Editado', email: 'ana@example.com', bio: 'Nueva Bio' };
      db.query.mockResolvedValueOnce({ rows: [mockUpdatedAuthor] });

      const res = await request(app)
        .put('/authors/1')
        .send({ name: 'Ana García Editado', bio: 'Nueva Bio' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockUpdatedAuthor);
    });

    it('debería retornar 404 si el autor a actualizar no existe', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .put('/authors/999')
        .send({ name: 'Nombre' });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Autor no encontrado para actualizar');
    });
  });

  describe('DELETE /authors/:id', () => {
    it('debería eliminar el autor y retornar estado 204', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 });

      const res = await request(app).delete('/authors/1');

      expect(res.statusCode).toBe(204);
      expect(db.query).toHaveBeenCalledWith('DELETE FROM authors WHERE id = $1', ['1']);
    });

    it('debería retornar 404 si el autor a eliminar no existe', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 });

      const res = await request(app).delete('/authors/999');

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Autor no encontrado para eliminar');
    });
  });
});
