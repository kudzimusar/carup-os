# CarUp OS Production Hardening

## Completed phases
1. API security and correctness
2. Data migration/indexing baseline
3. Observability baseline
4. CI pipeline bootstrap
5. Integration/deployment scaffolding
6. Production cutover checklist + docs

## AI providers configured (env scaffolding)
Set in `server/.env`:
- `OPENAI_API_KEY`
- `CLAUDE_API_KEY`
- `GEMINI_API_KEY`
- `KIMI_API_KEY`

Use `POST /api/ai/query` with provider: `openai|claude|gemini|kimi`.

## Run backend
```bash
cd server
npm install
npm run migrate
npm start
```

## Production checklist
- Set strong `JWT_SECRET`
- Set strict `CORS_ORIGINS`
- Configure reverse proxy + TLS
- Configure backups for `server/carup.db`
- Replace AI gateway stubs with official provider SDK calls
- Add payment webhook signature verification with provider secrets
