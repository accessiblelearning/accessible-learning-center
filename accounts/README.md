# Inactive account foundation

Status: October 5, 2026. Code and fictional previews only. **Public login is OFF. Additional spending must remain $0.** Nothing here authorizes provisioning, billing, real users, migrations or launch. November remains a tentative target requiring explicit owner approval.

## Implemented boundary

`worker.js` dispatches `/api/accounts/*` and `/api/admin/*` before the legacy permissive CORS handler. Other routes, including anonymous Student IDs, retain their existing behavior. Student IDs are not authentication and never confer access to these new routes.

- No flags configured: account routes return 404; `/api/accounts/config` reports disabled.
- Only a server setting of `ACCOUNT_MODE=pilot`, an environment of `test` or `pilot`, and all dedicated bindings can open the pilot boundary. There is deliberately no production/public mode. Browser flags cannot enable it.
- Dedicated `ACCOUNT_IDENTITY` service binding, `ACCOUNT_DB`, `ACCOUNT_ISSUER`, `ACCOUNT_AUDIENCE` and `ACCOUNT_ORIGIN` are mandatory. None is configured in `wrangler.toml`. The existing `DB` binding is never used by the new account code.
- Identity adapter is **not implemented or deployed**. Its future `/verify` contract must validate provider signatures, issuer, audience, expiry, revocation and disabled identities using a maintained provider. It returns trusted subject/issuer/audience/expiry. Client identity/role fields are not trusted. Local tests use a fictional binding.
- The database maps verified issuer + subject to a preapproved pilot account. Unknown, suspended or non-pilot accounts are denied. No automatic user or administrator provisioning exists.
- Bearer authorization only, same-origin use, no wildcard CORS or cookie authentication. Never store bearer tokens in localStorage when the real client is built. Sign-in, registration and recovery routes remain unavailable, even with the test pilot configured.
- Administrator routes also require `ACCOUNT_ADMIN_ENABLED=true` and a server-stored admin role. They support name search, reading a learner's progress, and suspending/restoring a learner with a reason. No self/admin status changes, password access, role grants or impersonation. Status change and audit insert form one database transaction. Recovery is unavailable and never reports an email sent.

## Data and import

`migrations/0001_accounts.sql` is prepared for a separate empty database. **It has only been run against local, in-memory SQLite with fictitious records.** There are no runtime schema changes and no production migration.

`registry.mjs` freezes 18 mission IDs in current numeric order, command IDs scoped to their courses, and the 30 assessed-course identities. Do not reorder mission IDs. Do not regenerate command IDs on wording changes: retain an ID for the same learning outcome or create an explicit migration. Future command UI/progress adapters still need to consume this registry.

Typing validates lessons 1–50 independently for `both`, `left` and `right`. Assessed courses validate lesson 1–10 or quiz records. Client writes are always `practice` or `imported`, never `verified`. Imported scores do not unlock verified certificates. Private Braille is reserved structurally but explicitly rejected by the public ingestion validator until a private adapter and access review exist.

`prepareLocalImport(snapshot)` reads only a supplied snapshot; it does not access or modify browser storage. It converts current typing completion prefixes and Topic Mission numeric completions, deduplicates them, identifies unsupported records and keeps the original source. Detailed typing sessions and legacy quiz histories are retained locally for later adapter review. No legacy Student ID is claimed. The future UI must show the preview and require consent before authenticated upload. Upload in chunks of at most 40 records to stay within D1 Free query limits. Repeating identical records for the same account and verification class is idempotent. A partial retry cannot erase source history.

Progress responses currently cap at 200 records; account search caps at 50. Pagination, aggregate progress summaries, detailed-session imports, offline sync, account-switch cleanup, deletion/export and retention policies remain required before pilot use.

## Previews

`account-preview.html` and `admin-preview.html` are noindex design previews with fictional data, omitted from public navigation. They are public files, not a security boundary. Credential inputs are disabled. The sample administrator page supports search, reviewing fictional progress, separate hand-path WPM/accuracy history and trends, and in-memory sample status/audit changes. It never calls the account API or reads browser learning history; reloading resets it.

## Validation and launch blockers

Run `node --test --test-isolation=none tests/accounts.test.mjs`. Tests exercise the actual SQL schema and D1 query adapter through an in-memory SQLite binding, including rollback on audit failure. These are not tests of Cloudflare deployment or a real identity provider.

Before any separately authorized launch:

1. Owner approves a genuinely no-cost provider/setup after reviewing current limits. No paid trial, billing instrument, automatic overages or new service provisioning under the present authorization.
2. Implement and test the maintained-provider adapter, recovery delivery, abuse protection/rate limiting, token/session lifecycle, log redaction and revocation. Complete an independent security review.
3. Establish an isolated account database and deployment configuration only after authorization; never migrate the legacy production DB as a shortcut. Provision pilot administrators through a reviewed server-side process.
4. Build the real learner UI, consent/import review, cross-device/offline sync and account-switch cleanup. Define data retention/deletion and support policies. Add pagination and complete private Braille integration separately.
5. Test recovery, invalid/expired sessions, account isolation and keyboard/screen-reader flows on actual devices. Keep anonymous learning available through failure and rollback.
6. Obtain explicit launch permission. A November date does not enable anything automatically.

The Worker changes are source-only until a separately authorized Worker deployment. Publishing GitHub Pages does not deploy this backend.
