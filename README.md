# ProcureOS

AI autonomous procurement SaaS built with FastAPI, Next.js 14, SQLAlchemy, JWT auth, FAISS-backed retrieval, and a multi-agent procurement workflow.

## Project Structure

```text
backend/
  app/
    agents/
    core/
    database/
    models/
    rag/
    routers/
    schemas/
    seed/
    services/
    main.py
  requirements.txt
  seed.py
frontend/
  app/
  components/
  services/
  package.json
docker-compose.yml
.env.example
```

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:8000` and frontend runs on `http://localhost:3000`.

## Docker Setup

```bash
docker compose up --build
```

## Demo API Flow

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `POST /api/procurement/create`
4. `GET /api/vendors`
5. `GET /api/procurement/decision/{id}`

## Notes

- SQLite is the default fallback for local development.
- PostgreSQL is enabled in Docker Compose for enterprise-style deployment.
- The agent workflow is deterministic and mock-LLM driven so the app runs without external model dependencies.
