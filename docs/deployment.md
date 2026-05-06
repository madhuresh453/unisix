# Deployment

## Local

```bash
npm install
npm run seed
npm run dev
```

Client: `http://localhost:3000`

API: `http://localhost:5000/api`

## Docker

```bash
docker compose up --build
```

Before production, replace `JWT_SECRET` and `FLAG_PEPPER`, configure a managed MongoDB URI, and run behind TLS.
