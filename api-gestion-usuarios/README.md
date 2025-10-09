# API REST de Gestión de Usuarios

API REST desarrollada con Node.js y Express para gestionar usuarios con operaciones CRUD completas.

## Descripción

Esta API permite crear, listar, actualizar y eliminar usuarios. Incluye validaciones robustas para:
- DPI de 13 dígitos numéricos
- Email con formato válido y único
- Password seguro (mínimo 8 caracteres, mayúscula, número y símbolo)
- Unicidad de DPI y email

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn

## 🔧 Instalación Local

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd user-api
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto:
```
PORT=3001
```

4. Ejecuta el servidor en modo desarrollo:
```bash
npm run dev
```

5. El servidor estará disponible en: `http://localhost:3001`

## URL de Despliegue

**Render:** `https://tu-app.onrender.com`

_(Reemplaza con tu URL real después del despliegue)_

## Endpoints

### 1. Crear Usuario

**POST** `/users`

Crea un nuevo usuario en el sistema.

**Body:**
```json
{
  "name": "Juan Pérez",
  "dpi": "1234567890123",
  "email": "juan.perez@example.com",
  "password": "Password123!"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "dpi": "1234567890123",
    "email": "juan.perez@example.com",
    "createdAt": "2025-10-08T12:00:00.000Z"
  }
}
```

**Errores posibles:**
- `400 Bad Request`: Datos inválidos
- `409 Conflict`: DPI o email ya registrado

### 2. Listar Usuarios

**GET** `/users`

Lista todos los usuarios con opciones de filtrado y paginación.

**Query Parameters:**
- `name` (opcional): Filtra por nombre (búsqueda parcial)
- `email` (opcional): Filtra por email exacto
- `limit` (opcional): Número de resultados por página
- `offset` (opcional): Número de resultados a saltar

**Ejemplos:**

```bash
# Listar todos los usuarios
GET /users

# Buscar por nombre
GET /users?name=juan

# Buscar por email
GET /users?email=juan.perez@example.com

# Con paginación
GET /users?limit=10&offset=0
```

**Respuesta exitosa (200):**
```json
{
  "total": 1,
  "limit": 10,
  "offset": 0,
  "users": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "dpi": "1234567890123",
      "email": "juan.perez@example.com",
      "createdAt": "2025-10-08T12:00:00.000Z"
    }
  ]
}
```

### 3. Actualizar Usuario

**PUT** `/users/:dpi`

Actualiza los datos de un usuario existente.

**Parámetros:**
- `dpi`: DPI del usuario a actualizar (en la URL)

**Body (todos opcionales):**
```json
{
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@example.com",
  "password": "NewPassword456!",
  "dpi": "9876543210987"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Usuario actualizado exitosamente",
  "user": {
    "id": 1,
    "name": "Juan Carlos Pérez",
    "dpi": "9876543210987",
    "email": "juancarlos@example.com",
    "createdAt": "2025-10-08T12:00:00.000Z",
    "updatedAt": "2025-10-08T13:00:00.000Z"
  }
}
```

**Errores posibles:**
- `400 Bad Request`: Datos inválidos
- `404 Not Found`: Usuario no encontrado
- `409 Conflict`: Nuevo DPI o email ya existe

### 4. Eliminar Usuario

**DELETE** `/users/:dpi`

Elimina un usuario del sistema.

**Parámetros:**
- `dpi`: DPI del usuario a eliminar (en la URL)

**Respuesta exitosa (200):**
```json
{
  "message": "Usuario eliminado exitosamente",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "dpi": "1234567890123",
    "email": "juan.perez@example.com",
    "createdAt": "2025-10-08T12:00:00.000Z"
  }
}
```

**Errores posibles:**
- `400 Bad Request`: DPI inválido
- `404 Not Found`: Usuario no encontrado

## 🔒 Validaciones

### DPI
- Exactamente 13 dígitos numéricos
- Único en el sistema

### Email
- Formato válido (ejemplo@dominio.com)
- Único en el sistema

### Password
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos un número
- Al menos un símbolo (!@#$%^&*...)

## 🧪 Pruebas con cURL

### Crear usuario:
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "dpi": "9876543210987",
    "email": "maria@example.com",
    "password": "Secure123!"
  }'
```

### Listar usuarios:
```bash
curl http://localhost:3000/users
```

### Actualizar usuario:
```bash
curl -X PUT http://localhost:3000/users/9876543210987 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María Isabel García"
  }'
```

### Eliminar usuario:
```bash
curl -X DELETE http://localhost:3000/users/9876543210987
```

## Despliegue en Render

1. Crea una cuenta en [Render](https://render.com)

2. Conecta tu repositorio de GitHub

3. Crea un nuevo Web Service con la siguiente configuración:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

4. Añade las variables de entorno necesarias (si las hay)

5. Despliega la aplicación

6. Actualiza la URL en este README con tu URL de Render

## Tecnologías

- Node.js
- Express.js
- CORS
- dotenv

## Autor

[Tu Nombre]

## 📄 Licencia

ISC