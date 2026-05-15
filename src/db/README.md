# Documentación del Diseño de la Base de Datos (Sprint 3)

En este documento explicamos como diseñamos la base de datos de nuestra aplicación.

## El Proceso
Diseñar el archivo `schema.sql` define cómo se conecta cada parte del ecommerce para que el sistema sea escalable y no se rompa nada. Definimos los tipos de datos para dejar las tablas listas para los siguentes User Stories.

## Estructura de las Tablas

### Tabla `products`
Es la tabla que más usamos. Aquí el reto fue decidir qué pasaba con el **stock** y los **precios**.
- Usamos `REAL` para los precios para que acepten decimales.
- Agregamos `masPedidos` como un número (0 o 1) para reemplazar los booleanos del JSON.
- Definimos un `DEFAULT 0` en el stock para evitar que un producto nuevo "nazca" con errores.

### Tabla `categories`
Aunque el requerimiento era opcional, decidimos incluirla. Queremos que las categorías sean únicas (`UNIQUE`) para que no haya duplicados que confundan al usuario.

### Tabla `users` 
Esta tabla está vacía de datos, pero ya tiene la estructura para el Sprint 4. 
- El `email` es `UNIQUE` (nadie puede registrarse dos veces con la misma cuenta).
- Ya dejamos listo el campo `password_hash`, porque aprendimos que **nunca** se guardan las contraseñas reales.

### Tablas `orders` y `order_items`
Aquí es donde se pone más complejo, tuvimos que dividir la compra en dos tablas:
- **`orders`**: el ticket (quién compró y cuánto gastó en total).
- **`order_items`**: El detalle del ticket (qué productos compró y en qué cantidad).
Usamos **Foreign Keys** para que, si un usuario desaparece o un producto se borra, la base de datos nos avise y mantenga todo prolijo.

## Conexión y Automatización (`database.js`)
Para no tener que ejecutar comandos manuales, configuramos `database.js` para que:
1. Cree el archivo `database.db` si no existe.
2. Lea el archivo `schema.sql` y cree todas las tablas automáticamente al arrancar.

## Funcionamiento de `migrate-js`
Ya existe un comando en `package.json` por lo que para ejecutar la migracion hay que escrbir en la consola 
```bash
npm run migrate
```


1. **Conexión Inicial:** Al hacer `require('./database')`, Node va a leer ese archivo, el cual a su vez lee el `schema.sql` y crea la base de datos vacía (si no estaba creada).
2. **Lectura de Datos:** Con el módulo `fs` agarra el `products.json` y lo convierte en un array de objetos JavaScript `(JSON.parse)` para poder recorrerlo producto por producto.
3. **Preparación `(db.prepare)`:** La consulta de SQL se deja "preparada" con los signos de pregunta (`?`). SQLite la compila internamente, haciéndola más rápida y previniendo inyecciones de código malicioso.
4. **La Lógica Central (La Transacción):** Se recorre con un for todos los productos. Como en la tabla los productos tienen un `category_id`, primero se encarga de guardar la categoría en texto, obtener su ID numérico generado por la base de datos, y luego recién ahí guardar el producto completo junto con el boolean arreglado (1 o 0), hay un atributo que esta escrito de dos formas diferentes en el JSON.
5. **¿Por qué `db.transaction()?`** Si guardamos 50 productos uno a uno en SQLite, es muy lento porque abre y cierra el archivo de la DB 50 veces. Al envolverlo en una transacción, SQLite procesa todo en la memoria y lo guarda de un solo impacto. Además, si falla un producto en el medio, se cancela todo, evitando bases de datos a medio cargar.
* `productService.js` / `productModel.js` todavia estan programados para buscar y leer el `JSON`. Hay que modificar esos archivos para que ahora le pidan los datos directamente a la base de datos usando consultas SQL (ej: SELECT * FROM products)