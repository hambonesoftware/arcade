# Hambone Arcade Community — deployment and operations

This is an account-free community for the existing GitHub Pages PWA. It accepts
moderated game suggestions, support votes and one official-poll vote per browser
identity (votes are changeable until closing). It does not guarantee one vote per
human; deleting browser storage or switching devices can generate another identity.

## Files

- community/: responsive Pages-hosted frontend; config.js defines the API origin.
- community-api/src/worker.js: public API and moderator-only endpoints.
- community-api/src/admin-page.js: owner-only moderation dashboard served by Worker.
- community-api/migrations/: Cloudflare D1 schema.
- community-api/wrangler.toml: Worker deployment settings.

## Deploy — needs Cloudflare account access

1. In Cloudflare, create a Turnstile Managed widget restricted to
   hambonesoftware.github.io. Keep its secret OUT of Git. The worker checks
   hostname and action=community via server-side Siteverify for every write.
2. Run: cd community-api && npm install. Authenticate with: npx wrangler login.
3. Run: npx wrangler d1 create hambone-community. Replace
   REPLACE_WITH_D1_DATABASE_ID in wrangler.toml with the returned UUID.
4. In wrangler.toml set TURNSTILE_SITE_KEY to the public Turnstile site key and
   ADMIN_EMAIL to the one authorized moderator email.
5. Set secrets from your trusted computer or secure CI:
   - npx wrangler secret put TURNSTILE_SECRET
   - npx wrangler secret put RATE_SALT
     (use a randomly generated 32+ byte secret; keep it out of source)
6. Apply schema: npx wrangler d1 migrations apply DB --remote.
7. Deploy Worker: npx wrangler deploy. Save its full HTTPS workers.dev origin.
8. In Cloudflare Zero Trust, configure an Access self-hosted application protecting
   the Worker's /admin page and EVERY /api/admin/* route. Restrict admission
   to ADMIN_EMAIL. The backend additionally requires Cloudflare's authenticated
   ctx.access identity with the exact email. Without Access all moderator
   routes return 403. Do not protect the whole public API.
9. Open the protected /admin URL and verify the Access login and pending queue.
   Test unauthenticated requests to /api/admin/overview return 403.
10. Set window.HAMBONE_COMMUNITY_API in community/config.js to the deployed
    Worker origin, for example
    https://hambone-arcade-community.some-account.workers.dev
    Commit and deploy Pages. The frontend stays disabled until this is done.
11. Confirm the Pages origin is allowed by ALLOWED_ORIGIN, test a real suggestion,
    approval, support vote, official poll, and vote-change flow in iPhone Safari.
12. Enable monitoring for Worker/D1 errors and create database backups.
    Never publish admin emails, guest tokens, or secrets in frontend code.

The worker's public API uses CORS restricted to the Arcade origin. CORS does
not replace authentication or rate limiting. GitHub Pages still hosts all games.

## Public API

- GET /api/config
- GET /api/ideas?sort=popular|new
- GET /api/polls/current
- GET /api/roadmap
- POST /api/ideas: title, description, genre, nickname, turnstileToken
- POST /api/ideas/:id/support: support (boolean), turnstileToken
- POST /api/polls/:id/vote: optionId, turnstileToken

The client sends an optional X-Guest-Token header for anonymous identity. A
valid first write returns guestToken; the browser stores it in localStorage.
The backend stores only its SHA-256 digest. Server-side Turnstile verification
is required on every write, and poll votes use a unique (poll_id, visitor_id)
database constraint.

## Moderator API

Cloudflare Access with the exact owner email is required on these routes:

- GET /admin
- GET /api/admin/overview
- POST /api/admin/ideas/:id/status
- POST /api/admin/polls
- POST /api/admin/polls/:id/close
- POST /api/admin/roadmap

All new suggestions enter pending and are hidden until moderator approval.
Duplicate suggestions can be rejected in favor of the original idea; automated
vote merging is deliberately not included in version one.
Official polls contain 2–5 approved ideas and may not overlap. Polls last no
more than 31 days and close at a server-controlled timestamp or when an
administrator ends them early.

There are no public comment threads in v1. We never guarantee one vote per
person without login verification. Turnstile and short-lived, daily rotated
IP-derived HMAC throttling reduce abuse, but do not make anonymous voting
sybil-proof.

A daily Worker scheduled cleanup removes expired rate-limit records; enable
the cron trigger in Wrangler. For privacy review, establish retention rules
for pseudonymous visitor/voting records and publish an appropriate privacy
notice before inviting widespread submissions.

## Testing

- From the repo root: npm test
- For just the API workspace: cd community-api && npm test
- Before going live, verify D1 operations in a real staging environment.

The GitHub Pages build must continue to verify offline installation, update,
removal, saved progress and launch of playable game packages.
