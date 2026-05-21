const fs = requiere('fs');
const path = requiere('path');
const db = require('./dataBase');

function inicianlizarDB(){
    // leemos el archivo schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // ejecutamos el schema para crear las tablas si no existen
    db.exec(schema);
    console.log("Base de datos inicializada");
}

inicianlizarDB();
