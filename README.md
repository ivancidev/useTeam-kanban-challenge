# 🧩 Kanban App 

Este proyecto es una aplicación Kanban con **Frontend en Next.js** y **Backend en NestJS**, conectados a una base de datos **MongoDB Atlas** en la nube. La comunicación entre frontend y backend es vía HTTP/WebSocket. Todo se ejecuta fácilmente con **Docker Compose**.

---

## 📁 Estructura del proyecto

```
/
├── frontend/
│   ├── Dockerfile
│   ├── .env.local      # Usado por Docker
│   ├── .env            # Usado para puerto local
│   └── .env.example
├── backend/
│   ├── Dockerfile
│   ├── .env.local      # Usado por Docker
│   ├── .env            # Usado para conexión API y socket
│   └── .env.example
├── docker-compose.yml
```

> **Nota:**  
> Los archivos `.env` y `.env.local` deben existir en ambos frontend y backend.  
> Docker usa `.env.local`, pero `.env` es útil para desarrollo local.

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

Edita `backend/.env.local` y reemplaza `DATABASE_URL` con tu cadena de conexión de MongoDB Atlas:

```
DATABASE_URL="mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/kanban-board?retryWrites=true&w=majority"
CLIENT_ORIGIN=http://localhost:3000
PORT=3001
```

#### 🛠️ Frontend

Puedes dejar los valores por defecto si el backend corre en `localhost:3001`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

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