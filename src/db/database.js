const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Creamos o abrimos el archivo de la base de datos
const db = new Database(path.join(__dirname, 'database.db'));

// Leemos el archivo schema.sql
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Ejecutamos el schema para crear las tablas si no existen
// Usamos .exec() porque el archivo tiene múltiples sentencias SQL
db.exec(schema);

console.log("Base de datos inicializada :D");

module.exports = db;