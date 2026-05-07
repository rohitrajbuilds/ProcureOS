# ProcureOS

ProcureOS is an AI-powered procurement SaaS prototype that automates vendor discovery, vendor scoring, negotiation simulation, risk analysis, and final supplier decisioning through a multi-agent workflow.

## Core Capabilities

- JWT authentication with protected API routes
- Procurement request creation and workflow orchestration
- Multi-agent architecture with `VendorAgent`, `NegotiationAgent`, `RiskAgent`, and `DecisionAgent`
- FAISS-backed retrieval for vendor history and pricing trend context
- Dashboard for vendors, negotiations, decisions, and analytics
- Dockerized local deployment with PostgreSQL

## Tech Stack

- Frontend: Next.js 14, App Router, Tailwind CSS, Axios
- Backend: FastAPI, SQLAlchemy, JWT auth
- Database: PostgreSQL via Docker, SQLite fallback for local dev
- Vector retrieval: FAISS
- AI layer: deterministic mock-LLM style agent architecture

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
SUBMISSION_CHECKLIST.md
PRESENTATION_OUTLINE.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/rajdataengineer992722-bot/ProcureOS.git
cd ProcureOS
```

### 2. Backend setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload
```

Backend starts at `http://localhost:8000`.

### 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:3000`.

### 4. Environment setup

Copy `.env.example` values into your local environment if you want to customize secrets or URLs.

## Docker Setup

From the repo root:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

## Render + Vercel Deployment

This repository is now configured for:

- Render: FastAPI backend + managed PostgreSQL
- Vercel: Next.js frontend

### Render backend

- Blueprint file: `render.yaml`
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check: `/health`

Required backend environment variables:

- `FRONTEND_URL=https://your-vercel-app.vercel.app`
- `CORS_ORIGINS=https://your-vercel-app.vercel.app`
- Optional: `OPENAI_API_KEY`

### Vercel frontend

- Root directory: `frontend`
- Config file: `frontend/vercel.json`

Required frontend environment variable:

- `NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api`

Detailed deployment guide:

- `RENDER_VERCEL_DEPLOY.md`

## AWS Deployment

This repository is also configured for a lower-cost AWS path centered on a single EC2 instance.

Recommended AWS path for a credit-based account:

- one EC2 instance
- Docker Compose
- SQLite persistence
- Nginx reverse proxy

AWS EC2 deployment files:

- `docker-compose.ec2.yml`
- `deploy/ec2/nginx.conf`
- `.env.ec2.example`
- `AWS_DEPLOY.md`

The frontend is configured to build against `/api` for this EC2 path, so both frontend and backend are served from one public host through Nginx.

Use `AWS_DEPLOY.md` for the full EC2 deployment flow.

## Railway Deployment

This repository is configured for Railway as an isolated monorepo with:

- `backend` service from `/backend`
- `frontend` service from `/frontend`
- `Postgres` from Railway managed PostgreSQL

### Railway setup

1. Push this repository to GitHub.
2. Create a Railway project connected to the repo.
3. Add a `Postgres` service.
4. Add a `backend` service and set:
   - Root Directory: `/backend`
   - Config-as-Code path: `/backend/railway.json`
5. Add a `frontend` service and set:
   - Root Directory: `/frontend`
   - Config-as-Code path: `/frontend/railway.json`

### Railway environment variables

Backend service:

- `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- `SECRET_KEY=<generate-a-long-random-secret>`
- Optional: `FRONTEND_URL=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}`

Frontend service:

- `NEXT_PUBLIC_API_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}/api`

### Railway notes

- The backend healthcheck path is `/health`.
- Both Dockerfiles respect Railway's injected `PORT` variable.
- `NEXT_PUBLIC_API_URL` is a build-time variable for Next.js, so redeploy the frontend after changing it.
- See [RAILWAY_DEPLOY.md](E:/ProcureOS/RAILWAY_DEPLOY.md) for the focused Railway checklist.

## Demo User Flow

1. Open the frontend at `http://localhost:3000`
2. Register a new account
3. Log in to the dashboard
4. Create a procurement request with title, category, budget, quantity, and requirements
5. The system automatically:
   - fetches vendors
   - scores and shortlists vendors
   - runs negotiation simulation
   - performs risk analysis
   - retrieves historical context with FAISS
   - selects a final vendor with reasoning
6. Review the decision dossier and negotiation logs

## Demo API Flow

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `POST /api/procurement/create`
4. `GET /api/vendors`
5. `GET /api/decision/{id}`
6. `GET /api/procurement/decision/{id}`
7. `GET /api/analytics`

## Sample API Test Payloads

### Register

```json
{
  "full_name": "Rohit Raj",
  "email": "rohit@example.com",
  "password": "ProcureOS123"
}
```

### Login

```json
{
  "email": "rohit@example.com",
  "password": "ProcureOS123"
}
```

### Create Procurement Request

```json
{
  "title": "Procurement Software Licenses",
  "category": "Software",
  "budget": 12000,
  "quantity": 8,
  "requirements": "Need enterprise-grade procurement software with onboarding support, reliable delivery, and good post-sale support."
}
```

## What Makes This Prototype Strong

- Clear enterprise workflow from request creation to final decision
- Explainable AI outputs with JSON decision structures
- Auditable negotiation and risk trail
- Retrieval-enhanced decisioning with FAISS
- Easy local and Docker deployment

## Submission Assets

- Run instructions: this `README.md`
- PPT guide: `PRESENTATION_OUTLINE.md`
- Submission checklist: `SUBMISSION_CHECKLIST.md`

## Notes

- SQLite is the default fallback for local development.
- PostgreSQL is enabled in Docker Compose for enterprise-style deployment.
- The agent workflow is deterministic and mock-LLM driven so the app runs without external model dependencies.
- If Docker is not installed locally, use the standard backend and frontend setup instructions above.
