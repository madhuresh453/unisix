# UNI6CTF Architecture

UNI6CTF is split into a Next.js client and an Express API. MongoDB stores users, teams, events, challenges, submissions, writeups, sponsors, and leaderboard snapshots. Socket.io streams scoreboard and notification events during live competitions.

## Runtime Flow

1. Users authenticate through JWT-backed `/api/auth` routes.
2. Admins create CTF events and publish challenges.
3. Players submit flags to `/api/submissions`.
4. The scoring service verifies flags using salted HMAC hashes and timing-safe comparison.
5. Accepted solves update user/team scores and emit Socket.io scoreboard updates.
6. Leaderboard jobs periodically snapshot global rankings.

## Security Notes

Flags are never stored in plaintext. Passwords are bcrypt-hashed. API routes use Helmet, CORS, request logging, JSON limits, input sanitization, and rate limiting. Submission velocity and payload anomalies are recorded as anti-cheat signals.
