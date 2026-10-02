# Deployment

## Vercel Demo Deployment

The Vercel configuration builds the FastAPI function at `api/index.py`. FastAPI serves the React app from `/app` using the generated files in `frontend/dist`; the Python build does not run Vite.

Before deploying, build the frontend and include the generated files in the repository:

```powershell
Push-Location frontend
npm ci
npm run build
Pop-Location
```

Set these Vercel environment variables for the production environment:

- `MONGO_URL`: MongoDB Atlas connection URI. Do not use the local default `mongodb://localhost:27017` on Vercel.
- `DATABASE_NAME`: database name, for example `restaurant_management`.

`ATLAS_URL` or `MONGODB_URI` is also accepted as a remote connection fallback, but prefer setting `MONGO_URL` explicitly. Confirm the Atlas network rules permit the deployment to connect.

After deployment, verify `/health`, `/docs`, and `/app/`. The root route redirects to `/app/index.html`.

## Security Status

JWT authentication was removed at the project owner's request. API endpoints currently accept unauthenticated requests, and frontend role profiles do not secure API operations. **This deployment is suitable only for isolated demos with non-sensitive data; it is not safe for a public production restaurant.** Do not use real customer, staff, payment, or inventory data until server-side authentication and authorization are restored or an equivalent trusted access-control layer is placed in front of the API.

Vercel does not auto-create the default demo staff accounts. Do not deploy the development credentials documented in the local setup guide as production credentials.

## Test Environment

Install test dependencies with `pip install -r requirements-dev.txt`. The integration suite uses MongoDB and mutates data, so set `DATABASE_NAME` to a separate test database before running it. Never run the integration suite against production data.