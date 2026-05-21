const fs = require('fs');
const path = require('path');
const db = require('../dataBase');

function inicializarDB(){
    // leemos el archivo schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // ejecutamos el schema para crear las tablas si no existen
    db.exec(schema);
    console.log("Base de datos inicializada");
}

inicializarDB();
