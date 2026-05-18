const Database = require('better-sqlite3');
const path = require('path');

// Creamos o abrimos el archivo de la base de datos
const db = new Database(path.join(__dirname, 'database.db'));

module.exports = db;