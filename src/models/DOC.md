## Refactorización de Servicios y Modelos (US3)
Con la base de datos funcionando y migrada, el siguiente paso fue cambiar el paradigma de cómo nuestra aplicación consultaba la información en la capa lógica (`productModel.js` y `productService.js`).

**El problema anterior:**
Antes, leíamos todo el archivo JSON y lo cargábamos en la memoria del servidor (`findAll`). Luego, usábamos métodos de arreglos de JavaScript como `.filter()`, `.sort()` y `.find()` para buscar lo que el usuario pedía. Esto en un sistema real con miles de productos colapsaría el servidor.

**La nueva solución (SQL):**
Ahora, la regla es **"Pedirle a la base de datos exactamente lo que necesitamos"**.
1. **Búsqueda y Filtrado:** Reemplazamos los `.filter()` de JS por la cláusula `WHERE` y el operador `LIKE` de SQL en el modelo.
2. **Ordenamiento:** Reemplazamos el `.sort()` de JS por la cláusula `ORDER BY` directamente en la consulta SQL.
3. **Relaciones (JOIN):** Como en el esquema normalizamos las categorías (asignándoles un `category_id`), implementamos un `LEFT JOIN` con la tabla `categories`. Esto permite que el modelo le devuelva a la vista el nombre real de la categoría ("Bebidas") y no un simple número, manteniendo la compatibilidad sin romper el frontend.