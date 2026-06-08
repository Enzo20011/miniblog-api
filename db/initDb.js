const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Leer variables de entorno
const dbUser = process.env.PGUSER || 'postgres';
const dbHost = process.env.PGHOST || 'localhost';
const dbPassword = process.env.PGPASSWORD || 'postgres';
const dbDatabase = process.env.PGDATABASE || 'miniblog_db';
const dbPort = process.env.PGPORT || 5432;

async function initDb() {
  console.log('Iniciando configuración de la base de datos...');

  // 1. Conectar a la base de datos por defecto 'postgres' para crear la base de datos destino si no existe
  const mainClient = new Client({
    user: dbUser,
    host: dbHost,
    password: dbPassword,
    port: dbPort,
    database: 'postgres' // Conectarse a postgres por defecto
  });

  try {
    await mainClient.connect();
    
    // Verificar si la base de datos ya existe
    const res = await mainClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbDatabase]
    );

    if (res.rowCount === 0) {
      console.log(`La base de datos "${dbDatabase}" no existe. Creándola...`);
      await mainClient.query(`CREATE DATABASE ${dbDatabase}`);
      console.log(`Base de datos "${dbDatabase}" creada exitosamente.`);
    } else {
      console.log(`La base de datos "${dbDatabase}" ya existe.`);
    }
  } catch (err) {
    console.error('Error al verificar o crear la base de datos:', err.message);
  } finally {
    await mainClient.end();
  }

  // 2. Conectar a la base de datos destino 'miniblog_db' para correr los scripts SQL
  const targetClient = new Client({
    user: dbUser,
    host: dbHost,
    password: dbPassword,
    database: dbDatabase,
    port: dbPort
  });

  try {
    await targetClient.connect();
    console.log(`Conectado a la base de datos "${dbDatabase}".`);

    // Leer setup.sql
    console.log('Ejecutando setup.sql...');
    const setupSqlPath = path.join(__dirname, 'setup.sql');
    const setupSql = fs.readFileSync(setupSqlPath, 'utf8');
    await targetClient.query(setupSql);
    console.log('Tablas y estructuras creadas correctamente.');

    // Leer seed.sql
    console.log('Ejecutando seed.sql...');
    const seedSqlPath = path.join(__dirname, 'seed.sql');
    const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
    await targetClient.query(seedSql);
    console.log('Datos iniciales insertados correctamente.');

    console.log('¡Inicialización de base de datos finalizada con éxito!');
  } catch (err) {
    console.error('Error durante la ejecución del script SQL:', err.message);
    process.exit(1);
  } finally {
    await targetClient.end();
  }
}

initDb();
