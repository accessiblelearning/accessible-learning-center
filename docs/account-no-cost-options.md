# No-cost identity research — October 5, 2026

Budget: **$0 additional spending**. No services were provisioned. Public login and recovery remain off. Research is not approval to activate a free tier or a trial.

| Option | Relevant published limits | Decision for now |
| --- | --- | --- |
| Firebase Authentication, Spark | Spark needs no payment method. Email/password is a candidate. Published Spark email limits include 150 password-reset messages/day, 1,000 verification messages/day and only 5 email-link sign-in messages/day. Identity Platform instrumentless limits include 3,000 Tier-1 daily active users. Phone/SMS requires billing. Abuse controls can impose additional limits. | Leading candidate for a later owner-approved email/password pilot with built-in recovery; do not enable SMS, Blaze or a trial. No project created. |
| Supabase default email service | Default SMTP sends only to project team addresses, currently 2 messages/hour, and is intended for non-production use. Public learner recovery needs separately configured SMTP. | Not a ready public recovery solution under the current no-provisioning constraint. No SMTP service activated. |
| Existing Cloudflare ecosystem, dedicated D1 Free database if later approved | Free limits: 5 million rows read/day, 100,000 written/day, 5 GB total storage; 500 MB per database and 50 queries per Worker invocation. Free quota exhaustion stops queries instead of automatically authorizing paid overages. Actual existing plan/usage has not been inspected. | Prepared SQL only, local test database only. No new binding/database, production queries, migration or billing changes. Need owner-approved capacity and isolation review before use. |

A future Firebase choice would require owner-authorized project setup, email/password configuration, approved site domains and recovery redirects/templates, a verified token adapter, and recovery tests using authorized pilot accounts. These are outstanding, not completed. Do not add a payment method to solve a quota limit; keep the feature inactive or limit the pilot instead. Hosting and database limits also need confirmation before activation.

Official sources reviewed October 5, 2026:

- https://firebase.google.com/pricing
- https://firebase.google.com/docs/auth/limits
- https://supabase.com/docs/guides/auth/auth-smtp
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/d1/platform/limits/

Limits can change; verify again before an explicitly approved pilot. No promise of unlimited no-cost operation is made.
