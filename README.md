## 📁 Структура проекта

```
root/
├── backend/       # NestJS API
├── frontend/      # React SPA (Vite)
└── README.md
```

---

## Как развернуть у себя

### 🛠️ Зависимости

- Node.js >=18.x
- PostgreSQL >=13
- npm или pnpm

---

## 🐘 PostgreSQL

1. Создайте базу данных:

```bash
createdb myapp_db
```

2. Установите переменные окружения (в `.env`):

### backend/.env
```env
PORT=8000
ADMIN_LOGIN=example
ADMIN_PASSWORD=example
PG_HOST=localhost
PG_PORT=5432
PG_NAME=example
PG_PASSWORD=example
PG_DB=example
JWT_SECRET=example
```

### frontend/.env
```env
VITE_PUBLIC_API_BASE_URL=https://example.com/api
VITE_PUBLIC_SERVER_URL=https://example.com
```
---

## 🔧 Backend (NestJS)

### 1. Установка зависимостей:

```bash
cd backend
npm install
```

### 2. Настройка `.env`:

Создайте `.env` файл (если его нет):

```env
PORT=8000
ADMIN_LOGIN=example
ADMIN_PASSWORD=example
PG_HOST=localhost
PG_PORT=5432
PG_NAME=example
PG_PASSWORD=example
PG_DB=example
JWT_SECRET=example
```

### 3. Запуск сервера:

```bash
npm run start:dev
```

---

## 🌐 Frontend (React)

### 1. Установка зависимостей:

```bash
cd frontend
npm install
```

### 2. Настройка `.env`:

```env
VITE_PUBLIC_API_BASE_URL=https://example.com/api
VITE_PUBLIC_SERVER_URL=https://example.com
```

### 3. Запуск dev-сервера:

```bash
npm run dev
```

---

## Результат

- Откройте http://localhost:5173 — React-приложение
- API доступно на http://localhost:3000/api

---

## 🛠 Полезные команды

### Backend

```bash
npm run start:dev          # Запуск в dev-режиме
npm run build              # Сборка проекта
```

### Frontend

```bash
npm run dev     # Локальный сервер
npm run build   # Сборка для продакшена
```

---

## 📂 Дополнительно

- Используется React Hook Form, Zod, Vite, TailwindCSS
- NestJS с TypeORM
- Поддержка .env, валидации, загрузки файлов
