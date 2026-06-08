const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

let pool;

// Si existe DATABASE_URL (provista por Railway u otros proveedores de hosting), usarla.
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Railway y otros proveedores de base de datos en la nube requieren SSL
    ssl: isProduction ? { rejectUnauthorized: false } : false
  });
} else {
  // Configuración local
  pool = new Pool({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'miniblog_db',
    port: parseInt(process.env.PGPORT, 10) || 5432
  });
}

// Escuchar eventos de error del pool para evitar fallos catastróficos en el servidor
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de base de datos:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
