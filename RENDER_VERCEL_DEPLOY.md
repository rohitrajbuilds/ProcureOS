# ProcureOS Render + Vercel Deployment

This project is set up to deploy with:

- Render for the FastAPI backend and managed PostgreSQL
- Vercel for the Next.js frontend

## Architecture

- Backend: `backend/`
- Frontend: `frontend/`
- Render blueprint: `render.yaml`
- Vercel config: `frontend/vercel.json`

## 1. Deploy the Backend on Render

### Option A: Blueprint

1. Push this repository to GitHub.
2. In Render, create a new Blueprint from the repo.
3. Render will read `render.yaml` from the repository root.
4. During setup, provide:
   - `FRONTEND_URL`
   - `CORS_ORIGINS`
   - Optional `OPENAI_API_KEY`

### Backend environment variables

- `SECRET_KEY`
  Render generates this automatically from `render.yaml`.
- `DATABASE_URL`
  Render injects this automatically from the managed Postgres instance.
- `FRONTEND_URL`
  Set this to your Vercel production URL, for example:
  `https://procureos.vercel.app`
- `CORS_ORIGINS`
  Set this to the allowed frontend origins, comma-separated.
  Example:
  `https://procureos.vercel.app,https://procureos-git-main-yourteam.vercel.app`

### Render backend settings

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health Check Path: `/health`

## 2. Deploy the Frontend on Vercel

1. Import the GitHub repo into Vercel.
2. Set the project Root Directory to `frontend`.
3. Vercel will detect Next.js automatically.
4. Add the required environment variable:

`NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com/api`

5. Deploy the project.

## 3. Wire the Two Services Together

After both are live:

1. Copy the Vercel production URL.
2. Update Render:
   - `FRONTEND_URL=https://your-vercel-app.vercel.app`
   - `CORS_ORIGINS=https://your-vercel-app.vercel.app`
3. Redeploy the Render backend if needed.

If you use Vercel preview deployments and want them to call the backend too, add the preview domain pattern values manually to `CORS_ORIGINS`.

## 4. Recommended Production Values

### Render backend

- `FRONTEND_URL=https://your-app.vercel.app`
- `CORS_ORIGINS=https://your-app.vercel.app`
- `OPENAI_API_KEY=` only if you later switch from mock agent logic to a real model

### Vercel frontend

- `NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api`

## 5. Verification Checklist

After deployment:

1. Open the Vercel frontend
2. Register a user
3. Log in
4. Create a procurement request
5. Open Vendors page
6. Open Decision page
7. Confirm backend health at:
   `https://your-render-service.onrender.com/health`
