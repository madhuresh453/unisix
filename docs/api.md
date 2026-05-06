# UNI6CTF API

Base URL: `http://localhost:5000/api`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

## CTF

- `GET /ctfs`
- `GET /ctfs/:ctfId`
- `POST /ctfs` admin
- `POST /ctfs/:ctfId/register`
- `GET /ctfs/:ctfId/certificate`

## Challenges

- `GET /challenges`
- `GET /challenges/:challengeId`
- `POST /challenges` admin
- `POST /challenges/:challengeId/hints/:hintId/unlock`

## Submissions

- `POST /submissions`
- `GET /submissions/mine`
- `GET /submissions` admin

## Leaderboard

- `GET /leaderboard/global`
- `GET /leaderboard/teams`
- `GET /leaderboard/countries`
- `GET /leaderboard/ctf/:ctfId`
