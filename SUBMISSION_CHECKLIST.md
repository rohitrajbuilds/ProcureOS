# ProcureOS Prototype Submission Checklist

Use this checklist before uploading the prototype on the platform.

## 1. Source Code

- GitHub repository link is accessible
- Repository includes backend, frontend, Docker setup, and environment template
- `.env` and secrets are not committed
- README includes setup steps and API flow

Repository:

`https://github.com/rajdataengineer992722-bot/ProcureOS.git`

## 2. Instructions to Run

- Local setup steps are documented
- Docker setup steps are documented
- Required ports are listed:
  - frontend: `3000`
  - backend: `8000`
  - postgres: `5432`
- Sample test flow is documented

Main file for this:

- `README.md`

## 3. Video Demo

Record a 4 to 7 minute walkthrough covering:

- Problem statement
- Product overview
- User registration and login
- Dashboard overview
- Create procurement request
- Vendor shortlist and negotiation simulation
- Risk analysis and final decision
- Analytics view
- Tech architecture and deployment overview

## 4. PPT Submission

Include:

- Title slide
- Problem and opportunity
- Solution overview
- Product workflow
- AI agent architecture
- RAG and FAISS layer
- Screenshots of dashboard
- Tech stack and deployment
- Demo summary and future roadmap

Reference:

- `PRESENTATION_OUTLINE.md`

## 5. Product Demo Flow

Before recording or presenting, test:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/procurement/create`
- `GET /api/vendors`
- `GET /api/decision/{id}`
- Dashboard login page loads
- Dashboard page loads after auth
- Vendors page renders data
- Decisions page shows selected vendor and reasoning

## 6. Talking Points

Be ready to explain:

- Why procurement is a strong enterprise use case
- How agents divide responsibilities
- Why RAG improves decision quality
- How risk and negotiation are made auditable
- How the system can evolve into a production SaaS platform

## 7. Final Upload Pack

Submit these on the platform:

- Video link
- PPT file
- Source code link
- Instructions to run
