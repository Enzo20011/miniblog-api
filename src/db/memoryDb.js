// Base de datos simulada en memoria
const authors = [
  {
    id: 1,
    name: 'Ana García',
    email: 'ana@example.com',
    bio: 'Desarrolladora full-stack apasionada por Node.js',
    created_at: new Date('2026-06-01T10:00:00Z').toISOString()
  },
  {
    id: 2,
    name: 'Carlos Ruiz',
    email: 'carlos@example.com',
    bio: 'Escritor técnico especializado en bases de datos',
    created_at: new Date('2026-06-02T11:00:00Z').toISOString()
  },
  {
    id: 3,
    name: 'María López',
    email: 'maria@example.com',
    bio: 'Ingeniera de software con foco en APIs REST',
    created_at: new Date('2026-06-03T12:00:00Z').toISOString()
  }
];

const posts = [
  {
    id: 1,
    author_id: 1,
    title: 'Introducción a Node.js',
    content: 'Node.js es un runtime de JavaScript...',
    published: true,
    created_at: new Date('2026-06-04T09:00:00Z').toISOString()
  },
  {
    id: 2,
    author_id: 2,
    title: 'PostgreSQL vs MySQL',
    content: 'Ambas bases de datos tienen ventajas...',
    published: true,
    created_at: new Date('2026-06-05T10:00:00Z').toISOString()
  },
  {
    id: 3,
    author_id: 1,
    title: 'APIs RESTful',
    content: 'REST es un estilo arquitectónico...',
    published: true,
    created_at: new Date('2026-06-06T14:00:00Z').toISOString()
  },
  {
    id: 4,
    author_id: 3,
    title: 'Manejo de errores en Express',
    content: 'El manejo apropiado de errores...',
    published: false,
    created_at: new Date('2026-06-07T08:30:00Z').toISOString()
  },
  {
    id: 5,
    author_id: 1,
    title: 'Async/Await explicado',
    content: 'Las promesas simplifican el código asíncrono...',
    published: false,
    created_at: new Date('2026-06-08T09:15:00Z').toISOString()
  }
];

const comments = [
  {
    id: 1,
    post_id: 1,
    author_id: 2,
    content: '¡Excelente artículo!',
    created_at: new Date('2026-06-04T10:00:00Z').toISOString()
  },
  {
    id: 2,
    post_id: 1,
    author_id: 3,
    content: 'Muy útil, gracias.',
    created_at: new Date('2026-06-04T12:00:00Z').toISOString()
  },
  {
    id: 3,
    post_id: 2,
    author_id: 1,
    content: 'Interesante comparación.',
    created_at: new Date('2026-06-05T15:00:00Z').toISOString()
  }
];

let nextAuthorId = 4;
let nextPostId = 6;
let nextCommentId = 4;

module.exports = {
  authors,
  posts,
  comments,
  getNextAuthorId: () => nextAuthorId++,
  getNextPostId: () => nextPostId++,
  getNextCommentId: () => nextCommentId++
};
