# Database

MongoDB collections:

- `users`
- `teams`
- `ctfs`
- `challenges`
- `submissions`
- `leaderboards`
- `writeups`
- `sponsors`

Challenge flags are stored as `flagHash` and `flagSalt` with `select: false`. The server computes HMAC-SHA256 using `FLAG_PEPPER`, then compares with `crypto.timingSafeEqual`.
