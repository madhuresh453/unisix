# UNI6CTF

UNI6CTF is a full-stack cybersecurity CTF platform and community ecosystem built with Next.js, Tailwind CSS, Framer Motion, Express, MongoDB, JWT auth, and Socket.io.

## Structure

```text
client/    Next.js App Router frontend
server/    Express API, Mongoose models, Socket.io, services
database/  schema references and seed data
docker/    Dockerfiles and nginx config
docs/      architecture, API, database, deployment, roadmap
scripts/   local helper scripts
```

## Quick Start

```bash
npm install
npm run seed
npm run dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:5000/api`

Seed admin:

- Email: `admin@uni6ctf.local`
- Password: `AdminPass123!`

Seed player:

- Email: `aarav@uni6ctf.local`
- Password: `PlayerPass123!`

## Core Features

- Dark cyberpunk Next.js UI with all requested App Router pages.
- JWT register/login and profile routes.
- Mongoose models for User, Team, CTF, Challenge, Submission, Writeup, Leaderboard, and Sponsor.
- Secure flag checking with salted HMAC hashes.
- Dynamic scoring, hint deductions, anti-cheat signals, and rate limiting.
- Socket.io live scoreboard rooms.
- PDF certificate generation after CTF participation.
- Seed data, Docker setup, and implementation docs.
