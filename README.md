# Employee Task Management System

Phase 1 of a DevOps learning project: a clean React + Express application for managing employee work, with JWT authentication, MongoDB persistence, and optional AWS S3 attachments. Deployment infrastructure is intentionally reserved for later phases.

## Stack and architecture

- Frontend: React 18, Vite, React Router, Axios
- Backend: Node.js, Express, Mongoose
- Authentication: JWT + bcrypt
- Storage: AWS S3 with presigned downloads
- Security: Helmet, CORS allow-list, rate limiting, validation, memory-buffer uploads

`frontend` is a browser SPA. `backend` exposes `/api/auth`, `/api/tasks`, `/api/users`, `/health`, and `/health/ready`. Secrets are read only from environment variables.

## Prerequisites

Node.js 20+, npm, and a running MongoDB instance (local MongoDB or MongoDB Atlas). AWS S3 is required only when attachment upload is used.

## Local setup

```powershell
cd backend
Copy-Item .env.example .env
npm install
# edit .env with at least MONGODB_URI and JWT_SECRET
npm run dev
```

In another terminal:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Frontend: `http://localhost:5173`; API: `http://localhost:5000`.

### Environment variables

Backend (`backend/.env.example`): `NODE_ENV`, `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`, `FRONTEND_URL`.

Frontend (`frontend/.env.example`): `VITE_API_BASE_URL`.

Never commit `.env` files or real keys. In production, use an IAM role or equivalent workload identity instead of long-lived AWS access keys where possible.

## MongoDB and S3 setup

For local MongoDB, install/start MongoDB and use `mongodb://localhost:27017/employee_task_management`. For Atlas, replace `MONGODB_URI` with the Atlas connection string and allow the development client IP.

Create an S3 bucket in the selected region, set the four AWS variables in `backend/.env`, and keep the bucket private. The API uploads under `task-attachments/{taskId}/...` and returns a 15-minute presigned download URL. Allowed files are PDF, PNG, JPG/JPEG, DOC/DOCX up to 10 MB.

## Seed data

```powershell
cd backend
npm run seed
```

Development-only credentials: `admin@example.com` / `DevOnly123!`, `alice@example.com` / `DevOnly123!`, `bob@example.com` / `DevOnly123!`. Change or remove these before any shared environment.

## API summary

Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.

Tasks: `POST /api/tasks`, `GET /api/tasks?status=&priority=&assignedTo=&page=&limit=&search=`, `GET /api/tasks/:id`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`, `PATCH /api/tasks/:id/status`, `POST /api/tasks/:id/attachment`, `DELETE /api/tasks/:id/attachment`.

Attendance: `POST /api/attendance/check-in` with multipart field `image` (JPG/PNG, max 10 MB), `POST /api/attendance/check-out`, `GET /api/attendance/me`. Admins can use `GET /api/attendance`.

Admin: `GET /api/users`, `GET /api/tasks/stats`.

Health: `GET /health`, `GET /health/ready`.

Use a Bearer token from login for protected routes. A ready-to-import collection is in `postman/employee-task-management.postman_collection.json` and uses `{{baseUrl}}` and `{{token}}` variables.

## Tests and troubleshooting

```powershell
cd backend
npm test
```

The test suite uses an in-memory MongoDB server for health, registration, login, protected access, task creation, and task retrieval. If the first test run cannot download the MongoDB binary, run it again with network access or point tests at a local MongoDB instance.

If `/health/ready` returns 503, check `MONGODB_URI` and that MongoDB is running. If the UI shows network errors, check that the backend is on port 5000 and `frontend/.env` points to its `/api` URL. S3 errors mean the AWS variables or bucket permissions are incomplete.

## Future phases

This phase does not include Docker, CI/CD, Terraform, Kubernetes/EKS, Helm, observability, autoscaling, Lambda, API Gateway, Ansible, or production infrastructure. The app is prepared for those phases through environment-based configuration, health probes, stateless API behavior, stdout logging, graceful shutdown, and a production frontend build.
