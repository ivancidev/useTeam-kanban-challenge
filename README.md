# 🧩 Kanban App 

Este proyecto es una aplicación Kanban con **Frontend en Next.js** y **Backend en NestJS**, conectados a una base de datos **MongoDB Atlas** en la nube. La comunicación entre frontend y backend es vía HTTP/WebSocket. Todo se ejecuta fácilmente con **Docker Compose**.

---

## 📁 Estructura del proyecto

```
/
├── frontend/
│   ├── Dockerfile
│   ├── .env.local      # Usado por Docker
│   ├── .env            # Usado para puerto conexion con api y socket
│   └── .env.example
├── backend/
│   ├── Dockerfile
│   ├── .env.local      # Usado por Docker
│   ├── .env            # Usado para puerto
│   └── .env.example
├── docker-compose.yml
```

> **Nota:**  
> Los archivos `.env` y `.env.local` deben existir en ambos frontend y backend.  
> Docker usa `.env.local`, pero `.env` para puerto y socket.

---

## 🚀 Instalación rápida

### 1. Clona el repositorio

```bash
git clone https://github.com/ivancidev/useTeam-kanban-challenge.git
cd useTeam-kanban-challenge
```

### 2. Configura las variables de entorno

#### 🛠️ Backend

Copia los archivos de ejemplo y edítalos:

```bash
cp backend/.env.example backend/.env
cp backend/.env backend/.env.local
```

**¿Cómo obtener tu cadena de conexión de MongoDB Atlas?**

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) y regístrate o inicia sesión.
2. Crea un nuevo proyecto y luego un nuevo **Cluster** gratuito (M0).
3. Espera a que el cluster termine de crearse.
4. Haz clic en "Connect" > "Connect your application".
5. Copia la cadena de conexión que te genera Atlas.  
   **Importante:** Debes copiar la cadena tal como te la da Atlas, pero asegúrate de cambiar el nombre de usuario y la contraseña por los que creaste en Atlas, y agregar o modificar el nombre de la base de datos al final para que sea `kanban-board`.  
   Por ejemplo, tu cadena debe verse así (solo cambia `<TU_USUARIO>`, `<TU_CONTRASEÑA>` y el código del cluster según tu proyecto):

```
DATABASE_URL="mongodb+srv://<TU_USUARIO>:<TU_CONTRASEÑA>@cluster0.xxxxx.mongodb.net/kanban-board?retryWrites=true&w=majority&appName=Cluster0"
CLIENT_ORIGIN=http://localhost:3000
PORT=3001
```

> **Nota:** El código del cluster (`cluster0.xxxxx.mongodb.net`) es único para cada proyecto, así que debes copiarlo tal cual aparece en Atlas y solo modificar el usuario,
6. Ejemplo de cómo debe quedar la cadena en tus archivos `backend/.env` y `backend/.env.local` (solo cambia el usuario y la contraseña):

```
DATABASE_URL="mongodb+srv://<TU_USUARIO>:<TU_CONTRASEÑA>@cluster0.besymgf.mongodb.net/kanban-board?retryWrites=true&w=majority&appName=Cluster0"
CLIENT_ORIGIN=http://localhost:3000
PORT=3001
```

> **Importante:** Mantén el puerto `3001` en ambos archivos (`backend/.env` y `backend/.env.local`).  
> Así aseguras que el backend y el frontend se comuniquen correctamente.

> **Tip:** Si tu usuario o contraseña tienen caracteres especiales, usa [URL Encode](https://www.urlencoder.io/)

**Resumen:**  
Debes cambiar el usuario y la contraseña, y asegurarte que la base de datos sea `kanban-board`.  
**Recuerda:** La configuración debe ser igual en ambos archivos: `backend/.env` y `backend/.env.local


#### 🛠️ Frontend

Copia los archivos de ejemplo y edítalos:

```bash
cp frontend/.env.example frontend/.env
cp frontend/.env frontend/.env.local
```

No cambies el puerto, ya está configurado por defecto para conectarse al backend en `localhost:3001`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

> **Importante:** Mantén estos valores para asegurar la comunicación correcta entre frontend y

### 3. Ejecuta con Docker Compose

Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up --build
```

Esto levantará:

- 🟦 **Frontend:** http://localhost:3000
- 🟥 **Backend:** http://localhost:3001

---

## 📦 Requisitos previos

- Tener **Docker** y **Docker Compose** instalados.
- Tener una cuenta en **MongoDB Atlas** y la cadena de conexión (`DATABASE_URL`).

---

## ✅ Comprobación

Una vez iniciado, abre en tu navegador:

- 🌐 Frontend: [http://localhost:3000](http://localhost:3000)
- ⚙️ Backend: [http://localhost:3001](http://localhost:3001)

---


¡Listo! Ahora puedes probar y evaluar la aplicación

---

## 🚦 Ejecución por separado (sin Docker Compose)

Si prefieres ejecutar el frontend y el backend por separado, sigue estos pasos:

### Backend

1. Ve a la carpeta `backend`:
    ```bash
    cd backend
    ```
2. Instala las dependencias:
    ```bash
    npm install
    ```
3. Inicia el servidor:
    ```bash
    npm run start:dev
    ```

### Frontend

1. Ve a la carpeta `frontend`:
    ```bash
    cd frontend
    ```
2. Instala las dependencias:
    ```bash
    npm install
    ```
3. Inicia la aplicación:
    ```bash
    npm run dev
    ```

El frontend estará disponible en [http://localhost:3000](http://localhost:3000)  
El backend estará disponible en [http://localhost:3001](http://localhost:3001)

> **Nota:**  
> Recuerda copiar y configurar los archivos `.env` y `.env.local` en las carpetas `backend` y `frontend` a partir de sus respectivos `.env.example`.  
> Las variables deben ser iguales en ambos (`.env` y `.env.local`) para que todo funcione correctamente, tanto con Docker Compose como al ejecutar los servicios