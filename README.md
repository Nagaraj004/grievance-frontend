# தமிழ்நாடு புகார் தளம் — Full Stack
### Tamil Nadu Grievance Portal — FastAPI + PostgreSQL + React 18

---

## 🏗️ Project Structure

```
grievance-fullstack/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── api/v1/endpoints/ # Route handlers
│   │   ├── core/             # Config, security, dependencies
│   │   ├── db/               # Database connection
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Business logic
│   │   └── main.py           # FastAPI app entry point
│   ├── alembic/              # Database migrations
│   ├── requirements.txt
│   ├── .env
│   └── Dockerfile
├── frontend/                 # React 18 + TypeScript frontend
│   ├── src/
│   │   ├── pages/            # All page components
│   │   ├── components/       # Reusable UI components
│   │   ├── services/         # API client + grievanceService
│   │   ├── store/            # Redux Toolkit
│   │   ├── context/          # Auth + Language context
│   │   ├── i18n/             # Tamil / English translations
│   │   └── types/            # TypeScript types
│   ├── .env
│   └── Dockerfile
└── docker-compose.yml
```

---

## 🚀 Quick Start (Without Docker)

### 1. PostgreSQL Setup

```bash
# Start PostgreSQL and create database
psql -U postgres
CREATE DATABASE grievance_db;
\q
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — update DATABASE_URL with your credentials

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**
Swagger UI: **http://localhost:8000/docs**
ReDoc: **http://localhost:8000/redoc**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# VITE_API_URL=http://localhost:8000/api/v1 (default)

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🐳 Quick Start (Docker)

```bash
# Start everything with one command
docker-compose up --build

# In separate terminal, run migrations (first time only)
docker-compose exec backend alembic upgrade head
```

Services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Swagger: http://localhost:8000/docs
- PostgreSQL: localhost:5432

---

## 🔐 Credentials

| Role | Username | Password | Access |
|---|---|---|---|
| Admin | `admin` | `admin123` | Full access — update statuses, admin panel |
| Minister | `minister` | `tnmin123` | Read-only dashboard + stats |

> These are seeded automatically on first startup.

---

## 🌐 API Endpoints

### Public (No Auth Required)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/grievances/` | Submit new grievance |
| `GET` | `/api/v1/grievances/track/{token}` | Track by token |
| `GET` | `/api/v1/grievances/by-mobile/{mobile}` | Find by mobile |
| `POST` | `/api/v1/auth/login` | Login (get JWT) |

### Protected — Minister + Admin
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/grievances/` | List all (paginated + filters) |
| `GET` | `/api/v1/grievances/stats/summary` | Analytics dashboard |
| `GET` | `/api/v1/auth/me` | Current user profile |

### Protected — Admin Only
| Method | Endpoint | Description |
|---|---|---|
| `PATCH` | `/api/v1/grievances/{token}` | Update status / assign / remarks |
| `POST` | `/api/v1/auth/create-user` | Create new user |

---

## 🎯 Demo Data

On first startup, 6 demo grievances are seeded automatically:

| Token | Status | Department |
|---|---|---|
| `GRV25DEMO01` | IN PROGRESS | Roads & Infrastructure |
| `GRV25DEMO02` | ASSIGNED | Water Supply |
| `GRV25DEMO03` | UNDER REVIEW | Education |
| `GRV25DEMO04` | RESOLVED | Electricity |
| `GRV25DEMO05` | SUBMITTED | Social Welfare |
| `GRV25DEMO06` | CLOSED | Health |

Mobile `9876543210` has 2 demo grievances (GRV25DEMO01, GRV25DEMO02).

---

## 🗄️ Database Migrations (Alembic)

```bash
cd backend

# Apply all migrations
alembic upgrade head

# Create new migration after model changes
alembic revision --autogenerate -m "Add new column"

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

---

## 🔑 JWT Authentication Flow

1. Frontend calls `POST /api/v1/auth/login` with `{username, password}`
2. Backend validates credentials, returns `{access_token, role, username}`
3. Frontend stores token in `localStorage` as `tn_access_token`
4. All protected requests include `Authorization: Bearer <token>`
5. Token expires after 60 minutes (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`)

---

## 🎨 Tech Stack

### Backend
- **FastAPI** — Modern async Python web framework
- **PostgreSQL** — Production database
- **SQLAlchemy 2.0** — ORM with type hints
- **Alembic** — Database migration tool
- **python-jose** — JWT token generation/validation
- **passlib[bcrypt]** — Password hashing
- **Pydantic v2** — Data validation and serialization

### Frontend
- **React 18** + **TypeScript**
- **Vite** — Ultra-fast dev bundler
- **TailwindCSS** — Utility-first CSS
- **Redux Toolkit** — State management with async thunks
- **React Router v6** — Client-side routing
- **Axios** — HTTP client with JWT interceptors
- **Framer Motion** — Animations
- **React Icons** — Icon library

---

## 🌍 Language Support

Toggle between Tamil (தமிழ்) and English using the navbar button. All UI text is translated. Language preference is saved in localStorage.

---

## 🏛️ DMK Theme

Colors inspired by the Dravida Munnetra Kazhagam party palette:
- Deep Black: `#1a1a1a`
- Dark Red: `#7f1d1d`
- Primary Red: `#b91c1c`

---

## 📦 Production Build

```bash
# Frontend
cd frontend
npm run build
# Output in frontend/dist/

# Backend (production)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```
