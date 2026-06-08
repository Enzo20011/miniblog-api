const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

jest.mock('../src/config/db');

describe('Posts API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /posts', () => {
    it('debería retornar la lista de publicaciones con estado 200', async () => {
      const mockPosts = [
        { id: 1, title: 'Post 1', content: 'Content 1', author_id: 1, published: true },
        { id: 2, title: 'Post 2', content: 'Content 2', author_id: 2, published: false }
      ];
      db.query.mockResolvedValueOnce({ rows: mockPosts });

      const res = await request(app).get('/posts');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockPosts);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM posts ORDER BY id ASC');
    });
  });

  describe('GET /posts/:id', () => {
    it('debería retornar el detalle de la publicación con estado 200 si existe', async () => {
      const mockPost = { id: 1, title: 'Post 1', content: 'Content 1', author_id: 1, published: true };
      db.query.mockResolvedValueOnce({ rows: [mockPost] });

      const res = await request(app).get('/posts/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockPost);
    });

    it('debería retornar 404 si la publicación no existe', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).get('/posts/999');

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Publicación no encontrada');
    });
  });

  describe('GET /posts/author/:authorId', () => {
    it('debería retornar las publicaciones del autor con sus detalles y estado 200', async () => {
      // Primer query verifica si existe el autor
      db.query.mockResolvedValueOnce({ rowCount: 1 });
      
      const mockJoinedRows = [
        {
          id: 1,
          title: 'Post 1',
          content: 'Content 1',
          author_id: 1,
          published: true,
          created_at: '2026-06-04T09:00:00Z',
          author_name: 'Ana García',
          author_email: 'ana@example.com',
          author_bio: 'Bio Ana'
        }
      ];
      db.query.mockResolvedValueOnce({ rows: mockJoinedRows });

      const res = await request(app).get('/posts/author/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        {
          id: 1,
          title: 'Post 1',
          content: 'Content 1',
          author_id: 1,
          published: true,
          created_at: '2026-06-04T09:00:00Z',
          author: {
            id: 1,
            name: 'Ana García',
            email: 'ana@example.com',
            bio: 'Bio Ana'
          }
        }
      ]);
    });

    it('debería retornar 404 si el autor no existe', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 }); // El autor no existe

      const res = await request(app).get('/posts/author/999');

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Autor no encontrado');
    });
  });

  describe('POST /posts', () => {
    it('debería crear una publicación y retornar estado 201', async () => {
      const mockPost = { id: 6, title: 'Nuevo Post', content: 'Nuevo Contenido', author_id: 1, published: false };
      db.query.mockResolvedValueOnce({ rows: [mockPost] });

      const res = await request(app)
        .post('/posts')
        .send({ title: 'Nuevo Post', content: 'Nuevo Contenido', author_id: 1 });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(mockPost);
    });

    it('debería retornar 400 si falta el título, contenido o autor', async () => {
      const res = await request(app)
        .post('/posts')
        .send({ content: 'Contenido', author_id: 1 });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('title');
    });

    it('debería retornar 400 si el author_id no es un entero válido', async () => {
      const res = await request(app)
        .post('/posts')
        .send({ title: 'Post', content: 'Contenido', author_id: 'no-es-un-id' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('author_id');
    });

    it('debería retornar 400 si el autor especificado no existe en la DB', async () => {
      const dbError = new Error('insert or update violates foreign key');
      dbError.code = '23503';
      db.query.mockRejectedValueOnce(dbError);

      const res = await request(app)
        .post('/posts')
        .send({ title: 'Post', content: 'Contenido', author_id: 999 });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('El autor especificado no existe');
    });
  });

  describe('PUT /posts/:id', () => {
    it('debería actualizar la publicación y retornar estado 200', async () => {
      const mockUpdatedPost = { id: 1, title: 'Título Editado', content: 'Contenido Editado', author_id: 1, published: true };
      db.query.mockResolvedValueOnce({ rows: [mockUpdatedPost] });

      const res = await request(app)
        .put('/posts/1')
        .send({ title: 'Título Editado', content: 'Contenido Editado', published: true });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockUpdatedPost);
    });

    it('debería retornar 404 si la publicación a actualizar no existe', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .put('/posts/999')
        .send({ title: 'Editado' });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Publicación no encontrada para actualizar');
    });
  });

  describe('DELETE /posts/:id', () => {
    it('debería eliminar la publicación y retornar estado 204', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 });

      const res = await request(app).delete('/posts/1');

      expect(res.statusCode).toBe(204);
    });

    it('debería retornar 404 si la publicación a eliminar no existe', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 });

      const res = await request(app).delete('/posts/999');

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Publicación no encontrada para eliminar');
    });
  });
});
