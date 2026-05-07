# Railway Deployment

This repository is set up to deploy on Railway as an isolated monorepo with three services:

- `frontend` from `/frontend`
- `backend` from `/backend`
- `Postgres` from Railway's managed PostgreSQL template

## 1. Create the Railway project

1. Push this repo to GitHub.
2. Create a new Railway project connected to the repo.
3. Add a `Postgres` service.
4. Add a `backend` service from this repo.
5. Add a `frontend` service from this repo.

## 2. Configure root directories

In Railway service settings:

- `backend` Root Directory: `/backend`
- `frontend` Root Directory: `/frontend`

## 3. Point each service at its config file

Because Railway config files do not automatically follow the service root directory in a monorepo, set these absolute config paths in Railway:

- `backend` Config-as-Code path: `/backend/railway.json`
- `frontend` Config-as-Code path: `/frontend/railway.json`

## 4. Set environment variables

### Backend service

- `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- `SECRET_KEY=<generate-a-long-random-secret>`

Optional:

- `FRONTEND_URL=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}`

### Frontend service

- `NEXT_PUBLIC_API_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}/api`

## 5. Public networking

Generate a public domain for:

- `backend`
- `frontend`

## 6. Deploy order

1. Deploy `Postgres`
2. Deploy `backend`
3. Deploy `frontend`

## Notes

- The backend healthcheck path is `/health`.
- Both Dockerfiles now respect Railway's injected `PORT` variable.
- `NEXT_PUBLIC_API_URL` is a build-time variable for Next.js, so redeploy the frontend after changing it.
- Local Docker and local development still work because the Dockerfiles fall back to ports `8000` and `3000`.
