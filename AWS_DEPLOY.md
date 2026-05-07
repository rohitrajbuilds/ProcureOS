# ProcureOS AWS Deployment

ProcureOS is now prepared for an AWS deployment path that works well for a credit-based AWS account:

- Frontend: AWS Amplify Hosting
- Backend: AWS App Runner
- Database: Amazon RDS for PostgreSQL

This approach keeps the frontend and backend managed, while still letting you use PostgreSQL instead of the local SQLite fallback.

## Recommended AWS Architecture

- `frontend/` -> Amplify Hosting
- `backend/` -> App Runner source-based service
- PostgreSQL -> RDS PostgreSQL

## Why this setup

- Amplify natively supports Next.js SSR apps, including Next.js 14.
- App Runner supports source-based Python services and monorepo source directories.
- RDS PostgreSQL keeps the backend aligned with production-style database usage.

## 1. Deploy the database on Amazon RDS

Create a PostgreSQL database in RDS.

Suggested settings for a prototype:

- Engine: PostgreSQL
- Public access: enabled for the simplest prototype setup
- Store the endpoint, username, password, port, and database name

Construct the backend database URL in this format:

`postgresql+psycopg2://USERNAME:PASSWORD@HOST:5432/DATABASE`

## 2. Deploy the backend on AWS App Runner

AWS App Runner supports source-based Python services and reads `apprunner.yaml` from the service source directory.

Relevant file:

- `backend/apprunner.yaml`

### App Runner console steps

1. Open AWS App Runner
2. Choose `Create service`
3. Choose `Source code repository`
4. Connect your GitHub repository
5. Select this repo
6. Branch: `main`
7. Source directory: `backend`
8. Configuration source: `Use configuration file`

### Backend environment variables to add in App Runner

Set these in the App Runner console:

- `DATABASE_URL=postgresql+psycopg2://USERNAME:PASSWORD@HOST:5432/DATABASE`
- `SECRET_KEY=<generate-a-long-random-secret>`
- `FRONTEND_URL=https://your-amplify-app.amplifyapp.com`
- `CORS_ORIGINS=https://your-amplify-app.amplifyapp.com`
- Optional: `OPENAI_API_KEY=<your-key>`

### Backend health check

Use:

`/health`

After deployment, save the App Runner URL, for example:

`https://abc123.us-east-1.awsapprunner.com`

## 3. Deploy the frontend on AWS Amplify

Amplify supports Next.js SSR applications and monorepo builds.

Relevant file:

- `amplify.yml`

### Amplify console steps

1. Open AWS Amplify
2. Choose `Create new app`
3. Choose GitHub as the source
4. Select this repository
5. Select branch `main`
6. Enable `My app is a monorepo`
7. Set the app root to:

`frontend`

Amplify will set:

`AMPLIFY_MONOREPO_APP_ROOT=frontend`

### Frontend environment variable

Add:

`NEXT_PUBLIC_API_URL=https://your-apprunner-service.awsapprunner.com/api`

## 4. Wire the services together

After Amplify is deployed:

1. Copy the Amplify app URL
2. Go back to App Runner
3. Update:
   - `FRONTEND_URL=https://your-amplify-url`
   - `CORS_ORIGINS=https://your-amplify-url`
4. Redeploy the backend

## 5. Post-deploy verification

Check these in order:

1. App Runner health:
   - `https://your-apprunner-url/health`
2. Open the Amplify frontend
3. Register a user
4. Log in
5. Open Vendors page
6. Create a procurement request
7. Open the decision page

## 6. Cost guidance for a free-credit account

This managed setup is straightforward, but App Runner and RDS can consume credits faster than a single EC2 deployment.

If your goal is the absolute cheapest AWS hosting path, the next-best option is:

- one small EC2 instance
- Docker Compose
- SQLite for demo usage

That option is cheaper, but less managed and less production-like than Amplify + App Runner + RDS.
