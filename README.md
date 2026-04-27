# 🚀 Negratone - E-commerce Platform

Negratone es una plataforma de comercio electrónico desarrollada como parte de un proyecto académico para la facultad. El objetivo principal de este repositorio es migrar un sitio web estático a una arquitectura dinámica utilizando Node.js y Express, aplicando el patrón de arquitectura MVC (Modelo-Vista-Controlador) y metodologías modernas de diseño de componentes.

## 🛠️ Tecnologías Utilizadas

* **Entorno de ejecución:** Node.js
* **Framework de servidor:** Express.js
* **Motor de Plantillas:** EJS (Embedded JavaScript templating)
* **Frontend:** HTML5, CSS3, JavaScript
* **Dependencias principales:** `express`, `ejs`, `method-override` (y otras listadas en el `package.json`).

## 🆕 Novedades y Actualizaciones Recientes

El proyecto ha pasado por una refactorización profunda para mejorar su escalabilidad y mantenimiento:

1. **Arquitectura MVC Implementada:**
   - **Rutas (`src/routes`):** El archivo `mainRoutes.js` ahora centraliza y dirige el tráfico de las URLs hacia los controladores adecuados.
   - **Controladores (`src/controllers`):** Se implementó `mainController.js` para manejar la lógica de la aplicación y renderizar las vistas correctas según la petición del cliente.

2. **Transición a Vistas Dinámicas (EJS):**
   - Se eliminaron los archivos HTML estáticos.
   - Ahora el proyecto cuenta con páginas dinámicas `.ejs` (`index`, `login`, `register`, `cart`, `checkout`, `product`, `profile`, `error`).

3. **Componentización con Atomic Design:**
   - Para maximizar la reutilización de código, las vistas están divididas en la carpeta `partials/` siguiendo el diseño atómico:
     - **Global:** Elementos estructurales como el `head.ejs`.
     - **Atoms:** Componentes indivisibles (`back-link.ejs`, `form-button.ejs`).
     - **Molecules:** Agrupaciones simples (`ad-card.ejs`, `product-card.ejs`, `nav-item.ejs`).
     - **Organisms:** Secciones completas de la interfaz (`header.ejs`, `footer.ejs`, `nav-bar.ejs`, `login-form.ejs`, `shopping-cart.ejs`).

## 📂 Estructura de Directorios

\`\`\`text
Negratone/
├── /public/                # Recursos estáticos públicos
│   ├── /css/               # Archivos de estilos (styles.css)
│   └── /img/               # Imágenes y logos del proyecto
├── /src/                   # Código fuente de la aplicación
│   ├── /controllers/       # Controladores de la lógica de negocio (mainController.js)
│   ├── /routes/            # Definición de endpoints y rutas (mainRoutes.js)
│   └── /views/             # Plantillas dinámicas EJS
│       ├── /pages/         # Vistas principales (index, cart, login, etc.)
│       └── /partials/      # Fragmentos reutilizables (atoms, molecules, organisms, global)
├── app.js                  # Punto de entrada principal de la aplicación Node.js
└── package.json            # Configuración de dependencias y scripts
\`\`\`

## 🚀 Instalación y Ejecución

Para correr este proyecto en tu entorno local, sigue estos pasos:

1. **Clonar el repositorio:**
   \`\`\`bash
   git clone <URL_DEL_REPOSITORIO>
   cd Negratone
   \`\`\`
2. **Instalar las dependencias:**
   \`\`\`bash
   npm install
   \`\`\`
3. **Iniciar el servidor en modo desarrollo:**
   \`\`\`bash
   npm start
   # o si usas nodemon: npm run dev
   \`\`\`
4. **Visualizar el sitio:**
   Abre tu navegador web e ingresa a \`http://localhost:3000\` (o el puerto configurado).
