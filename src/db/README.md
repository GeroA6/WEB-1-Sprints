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
