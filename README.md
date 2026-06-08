# API MiniBlog 🚀

API REST robusta, escalable y estructurada construida en Node.js, Express y PostgreSQL para gestionar autores, publicaciones (posts) y comentarios de un servicio de contenidos. Este proyecto corresponde al **Proyecto Integrador del Módulo 2 (PIM2) - Full Stack**.

---

## Características Principales
- **CRUD completo** para Autores (`authors`) y Publicaciones (`posts`).
- **Crédito Extra (Entidad Comments)**: Gestión de comentarios asociados a posts y autores.
- **Persistencia real**: Conexión a PostgreSQL mediante la librería nativa `pg` utilizando consultas parametrizadas para evitar ataques de inyección SQL.
- **Base de datos relacional**: Integridad referencial completa con eliminación en cascada (`ON DELETE CASCADE`).
- **Validaciones rigurosas**: Middleware de validación para garantizar la consistencia de los datos.
- **Manejo centralizado de errores**: Middleware global para captura de excepciones y respuestas HTTP uniformes.
- **Documentación interactiva**: Interfaz de Swagger UI expuesta en `/api-docs` para interactuar con la documentación OpenAPI 3.0.
- **Suite de pruebas**: 31 tests unitarios y de integración con **Jest** y **Supertest** que simulan la base de datos para ejecutarse de forma aislada y rápida en cualquier entorno.

---

## Estructura del Repositorio
```
📁 PIM2-Full Stack
├── 📁 db
│   ├── 📄 initDb.js       # Script de inicialización de la base de datos
│   ├── 📄 seed.sql         # Datos de prueba iniciales (seed)
│   └── 📄 setup.sql        # Estructura física de tablas e índices (DDL)
├── 📁 src
│   ├── 📁 config
│   │   └── 📄 db.js       # Configuración del pool pg.Pool
│   ├── 📁 controllers
│   │   ├── 📄 authorController.js
│   │   ├── 📄 commentController.js
│   │   └── 📄 postController.js
│   ├── 📁 middlewares
│   │   ├── 📄 errorHandler.js
│   │   └── 📄 validationHandler.js
│   ├── 📁 routes
│   │   ├── 📄 authorRoutes.js
│   │   ├── 📄 commentRoutes.js
│   │   ├── 📄 index.js
│   │   └── 📄 postRoutes.js
│   ├── 📁 services
│   │   ├── 📄 authorService.js
│   │   ├── 📄 commentService.js
│   │   └── 📄 postService.js
│   ├── 📄 app.js          # Configuración de la aplicación Express
│   └── 📄 server.js       # Punto de entrada y levantamiento del servidor
├── 📁 tests
│   ├── 📄 author.test.js  # Pruebas integrales de autores
│   ├── 📄 comment.test.js # Pruebas integrales de comentarios
│   └── 📄 post.test.js    # Pruebas integrales de posts
├── 📄 .env.example        # Ejemplo de variables de entorno
├── 📄 openapi.yaml        # Documentación OpenAPI 3.0 de la API
└── 📄 package.json        # Dependencias y scripts del proyecto
```

---

## Requisitos Previos
- **Node.js** (versión 16 o superior sugerida)
- **PostgreSQL** corriendo localmente o una base de datos PostgreSQL remota (por ejemplo, Supabase, Neon o Render).

---

## Instalación y Configuración Local

### 1. Clonar el repositorio e instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo llamado `.env` en la raíz del proyecto basándote en el archivo `.env.example`:
```env
PORT=3000
NODE_ENV=development

# Credenciales de PostgreSQL
PGUSER=tu_usuario_postgres
PGHOST=localhost
PGPASSWORD=tu_contraseña_postgres
PGDATABASE=miniblog_db
PGPORT=5432
```

### 3. Configurar e inicializar la Base de Datos
Asegúrate de que tu servidor PostgreSQL local esté encendido. Luego, ejecuta el siguiente comando para crear automáticamente la base de datos `miniblog_db`, estructurar las tablas e índices, e insertar los datos semilla (seed):
```bash
npm run db:setup
```

### 4. Iniciar el servidor en modo desarrollo
Para arrancar el servidor con recarga automática (`nodemon`):
```bash
npm run dev
```
El servidor estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Ejecución de Pruebas (Testing)
Para ejecutar toda la suite de pruebas unitarias y de integración que validan rutas, controladores, validaciones y servicios con base de datos simulada:
```bash
npm run test
```
*Las pruebas están completamente aisladas de la base de datos real mediante mocks de Jest, por lo que pasarán exitosamente sin importar el estado de tu base de datos local.*

---

## Documentación de la API (OpenAPI / Swagger)
Puedes acceder a la interfaz interactiva de Swagger UI donde podrás ver y probar todos los endpoints del sistema abriendo la siguiente dirección en tu navegador una vez que el servidor esté corriendo:
👉 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Guía de Despliegue en Railway

1. **Crear una base de datos PostgreSQL en Railway**:
   - Ve a Railway e inicializa un nuevo proyecto.
   - Selecciona **Add Service** y añade **PostgreSQL**.
   - Railway creará la base de datos y te proporcionará una variable de entorno llamada `DATABASE_URL`.

2. **Subir y configurar la aplicación Node.js**:
   - Conecta tu repositorio de GitHub a Railway.
   - En la sección **Variables de Entorno (Variables)** de la aplicación Express en Railway, añade las siguientes variables:
     - `NODE_ENV=production`
     - `PORT=3000`
     - `DATABASE_URL` (se enlazará automáticamente con el servicio de base de datos de Railway).
   
3. **Ejecutar el script SQL de creación en Railway**:
   - Puedes conectarte a la base de datos de Railway desde tu consola local usando el comando provisto por Railway (`railway connect` o utilizando una herramienta como DBeaver/pgAdmin con los datos de conexión externos de Railway).
   - Ejecuta el contenido de `db/setup.sql` y `db/seed.sql` sobre la base de datos remota para crear y poblar las tablas.

4. **Desplegar**:
   - Railway detectará el archivo `package.json` y desplegará la aplicación utilizando el script `npm start`.
   - Utiliza la URL pública provista por Railway (ej. `https://tu-app-production.up.railway.app/api-docs`) para consumir los servicios.

---

## Registro de Uso de Inteligencia Artificial (AI)
Durante el desarrollo de este proyecto utilicé herramientas de IA como asistente de consulta y apoyo, de forma similar a como se usaría la documentación oficial o Stack Overflow.

- **Herramienta utilizada**: ChatGPT / GitHub Copilot.
- **Cómo la usé**:
  - Consulté cómo estructurar correctamente las rutas y controladores en Express para mantener el código limpio y organizado.
  - Me ayudó a recordar la sintaxis de consultas parametrizadas con `pg` y cómo manejar errores de PostgreSQL (como el código `23505` para emails duplicados).
  - La usé para entender cómo configurar Jest con mocks al escribir los tests, ya que era la primera vez que trabajaba con Supertest.
  - Me sirvió para revisar si la estructura del archivo `openapi.yaml` era válida y entender el formato de los schemas.
