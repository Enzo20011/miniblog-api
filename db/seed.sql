-- Limpiar datos existentes
TRUNCATE TABLE comments, posts, authors RESTART IDENTITY CASCADE;

-- Insertar Autores semilla
INSERT INTO authors (name, email, bio, created_at) VALUES
('Ana García', 'ana@example.com', 'Desarrolladora full-stack apasionada por Node.js', '2026-06-01T10:00:00Z'),
('Carlos Ruiz', 'carlos@example.com', 'Escritor técnico especializado en bases de datos', '2026-06-02T11:00:00Z'),
('María López', 'maria@example.com', 'Ingeniera de software con foco en APIs REST', '2026-06-03T12:00:00Z');

-- Insertar Publicaciones semilla (Posts)
INSERT INTO posts (title, content, author_id, published, created_at) VALUES
('Introducción a Node.js', 'Node.js es un runtime de JavaScript...', 1, TRUE, '2026-06-04T09:00:00Z'),
('PostgreSQL vs MySQL', 'Ambas bases de datos tienen ventajas...', 2, TRUE, '2026-06-05T10:00:00Z'),
('APIs RESTful', 'REST es un estilo arquitectónico...', 1, TRUE, '2026-06-06T14:00:00Z'),
('Manejo de errores en Express', 'El manejo apropiado de errores...', 3, FALSE, '2026-06-07T08:30:00Z'),
('Async/Await explicado', 'Las promesas simplifican el código asíncrono...', 1, FALSE, '2026-06-08T09:15:00Z');

-- Insertar Comentarios semilla (Comments)
INSERT INTO comments (post_id, author_id, content, created_at) VALUES
(1, 2, '¡Excelente artículo!', '2026-06-04T10:00:00Z'),
(1, 3, 'Muy útil, gracias.', '2026-06-04T12:00:00Z'),
(2, 1, 'Interesante comparación.', '2026-06-05T15:00:00Z');
