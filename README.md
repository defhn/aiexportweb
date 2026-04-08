# Export Growth Website System

## Local development

1. Copy `.env.example` to `.env.local`
2. Run `npm install`
3. Run `npm run db:generate`
4. Run `npm run db:migrate`
5. Run `npm run db:seed -- cnc`
6. Run `npm run dev`

## Verification

- `npm run test`
- `npm run test:e2e`
- `npm run build`

## Notes

- Public site is English-first.
- Admin is Chinese-first.
- Local development falls back to safe dev behavior for Turnstile, Brevo, and R2 when production credentials are not configured.
