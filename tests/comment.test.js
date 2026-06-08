const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

jest.mock('../src/config/db');

describe('Comments API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /comments/post/:postId', () => {
    it('debería retornar la lista de comentarios para un post y estado 200', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 }); // El post existe
      
      const mockComments = [
        { id: 1, post_id: 1, author_id: 2, content: 'Comentario 1' },
        { id: 2, post_id: 1, author_id: 3, content: 'Comentario 2' }
      ];
      db.query.mockResolvedValueOnce({ rows: mockComments });

      const res = await request(app).get('/comments/post/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockComments);
    });

    it('debería retornar 404 si el post no existe', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 }); // El post no existe

      const res = await request(app).get('/comments/post/999');

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Publicación no encontrada');
    });
  });

  describe('POST /comments', () => {
    it('debería crear un comentario y retornar estado 201', async () => {
      const mockComment = { id: 4, post_id: 1, author_id: 2, content: 'Nuevo comentario' };
      db.query.mockResolvedValueOnce({ rows: [mockComment] });

      const res = await request(app)
        .post('/comments')
        .send({ post_id: 1, author_id: 2, content: 'Nuevo comentario' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(mockComment);
    });

    it('debería retornar 400 si falta el contenido, post_id o autor_id', async () => {
      const res = await request(app)
        .post('/comments')
        .send({ post_id: 1, author_id: 2 }); // Falta content

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('content');
    });

    it('debería retornar 400 si el autor o la publicación no existen en la DB', async () => {
      const dbError = new Error('insert or update violates foreign key constraint');
      dbError.code = '23503';
      db.query.mockRejectedValueOnce(dbError);

      const res = await request(app)
        .post('/comments')
        .send({ post_id: 999, author_id: 999, content: 'Comentario' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('El autor o la publicación especificada no existe');
    });
  });

  describe('DELETE /comments/:id', () => {
    it('debería eliminar el comentario y retornar estado 204', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 });

      const res = await request(app).delete('/comments/1');

      expect(res.statusCode).toBe(204);
    });

    it('debería retornar 404 si el comentario a eliminar no existe', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 });

      const res = await request(app).delete('/comments/999');

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Comentario no encontrado para eliminar');
    });
  });
});
