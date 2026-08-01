# LicenseTrack

A website where companies can create an account, invite their team, and
track renewal dates for every contractor license they're responsible for -
attaching the license certificate, insurance certificate, or bond to each
one. The dashboard highlights what's expired or expiring soon, and (once
you connect an email service) sends automatic reminder emails before a
license lapses.

This README is written for someone who has never run a web project before.
Follow it top to bottom.

## What this project is built with (for context, not action)

- **Next.js** - the web framework (handles pages, forms, and the server).
- **Prisma** - talks to the database on your behalf.
- **PostgreSQL** - the database itself. You'll need a connection string to
  one (see step 3 below - takes about a minute to get one for free).
- **Vercel Blob** - optional file storage, for uploaded documents.
- **Resend** - optional email-sending service, for reminder emails.

You don't need to understand any of these to run the app.

## 1. Running it on your own computer

1. Install [Node.js](https://nodejs.org) (version 20 or newer) if you don't
   already have it.
2. In a terminal, from this project's folder, install the dependencies:
   ```bash
   npm install
   ```
3. Get a free Postgres database - the app needs somewhere to store
   accounts and licenses. Easiest options, no credit card:
   - [neon.com](https://neon.com) - sign up, create a project, copy the
     connection string it gives you.
   - [prisma.io/postgres](https://www.prisma.io/postgres) - same idea.
4. Copy the example environment file and fill in two values:
   ```bash
   cp .env.example .env
   ```
   Open `.env` in any text editor:
   - Set `DATABASE_URL` to the connection string from step 3. If your
     provider gave you both a "pooled" and a "direct"/"unpooled" one, also
     set `DIRECT_URL` to the direct one (see the note in section 3 about
     why - migrations need it).
   - Set `SESSION_SECRET` to a random string - generate one with:
     ```bash
     openssl rand -base64 32
     ```
     This keeps login sessions secure; it can be anything random, you'll
     never need to remember it.
5. Create the database tables:
   ```bash
   npx prisma migrate deploy
   ```
6. Start the app:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) in your browser.
   Click "Sign up free", create an account, and add a license to try it out.
   Signing up automatically creates a team (named after your company) that
   you're the owner of - see section 4 to invite people onto it.

## 2. How the app is organized (if you're curious)

- `src/app/page.tsx` - the public landing page.
- `src/app/signup`, `src/app/login` - account creation and sign-in
  (invite-aware - see `src/app/invite/[token]`).
- `src/app/dashboard` - the logged-in view listing your team's licenses.
- `src/app/team` - team members list and invite form.
- `src/app/licenses/new`, `src/app/licenses/[id]/edit` - the add/edit forms
  (the edit page also handles document uploads).
- `src/app/actions` - the server-side logic behind those forms: `auth.ts`
  (accounts), `licenses.ts`, `team.ts` (invites/membership), `documents.ts`
  (uploads).
- `prisma/schema.prisma` - the definition of what's stored: `User`,
  `Organization` (a team), `Membership` (who's on which team, and whether
  they're the owner), `Invitation`, `License`, and `LicenseDocument`.
- `src/app/api/cron/send-reminders` - the job that emails people about
  upcoming expirations (see section 5).
- `proxy.ts` - guards `/dashboard`, `/licenses/*`, and `/team` so only
  logged-in users can reach them.

## 3. Putting it on the internet (deployment) - the live demo

Right now the app only runs on your own computer. To get a real web address
you (or anyone) can visit and click around on, deploy it - most simply to
[Vercel](https://vercel.com) (made by the creators of Next.js, free to
start). This has to happen from your own browser - I can't do this step
from inside this session, since this sandboxed environment's network
settings don't allow reaching Vercel, Prisma's hosting, or similar sites
directly (I tried; more on that below if you're curious).

1. Go to [vercel.com](https://vercel.com) and sign up (GitHub login is
   fastest).
2. Click "Add New" -> "Project", and import this GitHub repository
   (`franklin-3325/licensetrack`), branch `claude/license-renewal-tracker-2k6uhn`
   for now, or `main` once this is merged.
3. Before clicking Deploy, add storage: in the project's "Storage" tab (or
   during import):
   - Add **Postgres** (Marketplace Database Providers -> Neon) - sets
     `DATABASE_URL` for you automatically. No separate signup needed.
   - Add **Blob** - only needed if you want document uploads to work; sets
     `BLOB_READ_WRITE_TOKEN` for you automatically. Skip it and the app
     still works, uploads just show a friendly "not set up yet" message.
4. In the project's Settings -> Environment Variables, add:
   - `DIRECT_URL` - **important**: the database Vercel just created for you
     gives you a *pooled* connection string as `DATABASE_URL`. Migrations
     need the *unpooled/direct* one instead, or they can fail halfway and
     leave the database in a half-migrated state. Find it in your Postgres
     provider's dashboard (Neon: the ".env.local" tab shows both
     `DATABASE_URL` and `DATABASE_URL_UNPOOLED` - copy the unpooled one in
     here as `DIRECT_URL`).
   - `SESSION_SECRET` - any random string (generate with
     `openssl rand -base64 32`).
   - `CRON_SECRET` - any random string (generate with
     `openssl rand -hex 16`) - only needed for the reminder-email job, see
     section 5.
   - `RESEND_API_KEY` / `EMAIL_FROM` - optional, also for section 5.
5. In Settings -> Build & Deployment, set the **Build Command** to:
   ```
   npx prisma migrate deploy && npx prisma generate && next build
   ```
   This creates the database tables automatically on every deploy.
6. Deploy. Vercel gives you a `https://your-app.vercel.app` URL - that's
   your live demo.

<details>
<summary>If a deploy fails with a Prisma migration error (click to expand)</summary>

If the build log shows `Error: P3009` ("failed migrations in the target
database") or `Error: P3018` ("A migration failed to apply") with a
Postgres error code like `42710` ("already exists"), it means a migration
was run through a *pooled* connection and partially applied before Prisma
reported it failed - see the `DIRECT_URL` note above; this is what it
protects against. To recover from it once it's happened:

1. Open your database provider's SQL editor (Neon: left sidebar -> "SQL
   Editor" / "Query").
2. Find the name of the migration that's stuck - it's in the build log,
   e.g. `20260801151731_teams_and_documents`.
3. Run:
   ```sql
   DELETE FROM "_prisma_migrations" WHERE migration_name = 'PASTE_THE_NAME_HERE';
   ```
   If the retry then fails again with a "duplicate_object"/"already
   exists" error on some specific type or table, that object partially
   got created - also drop it (e.g. `DROP TYPE IF EXISTS "SomeType";`) so
   the migration can create it cleanly on the next attempt.
4. Make sure `DIRECT_URL` is set (see above) before redeploying, so this
   can't happen again.

</details>

<details>
<summary>Why I couldn't just hand you a live URL directly (click to expand)</summary>

I tried two ways to get you a working link without you needing to do
anything: a temporary public tunnel to the app running in this sandbox,
and deploying it via Prisma's own hosting platform (Prisma Compute) using
their CLI. Both were blocked by this environment's outbound network
policy - it only allows a short allowlist of hosts (npm, GitHub, etc.),
not general internet access, so neither request could get out. That's a
setting on this Claude Code environment, not a limitation of the app
itself - the app is fully deploy-ready, which is why the Vercel steps
above should just work. This is also why I switched the project from
SQLite to Postgres in the meantime: that switch was on the roadmap for
your first real deploy anyway, so it's already done.
</details>

## 4. Team accounts and documents

Every account belongs to a team (called an "organization" in the code).
Signing up creates a new team and makes you its owner; everyone on a team
sees and manages the same shared list of licenses - useful for a company
where several people need visibility into what's expiring.

- **Inviting people**: from `/team` (or the "Manage team" link on the
  dashboard), the owner enters a teammate's email. That creates an invite
  link - if `RESEND_API_KEY` is set, it's also emailed to them. They click
  it, create an account (or log in, if they already have one), and land on
  the shared dashboard.
- **Roles**: for now there are two - the owner (can invite/remove people)
  and members (can do everything else: add, edit, delete licenses and
  documents). There's no way to leave a team or transfer ownership yet.
- **License holder**: each license has an optional "License holder" field
  for the person or crew it actually belongs to - separate from who has a
  LicenseTrack login, since a license is usually issued to a specific
  individual even when the company account manages it.
- **Documents**: from a license's edit page, attach the license
  certificate, insurance certificate, bond, or anything else worth keeping
  with the record. Requires Vercel Blob storage to be connected (see
  section 3) - without it, uploads show a clear error instead of failing
  silently.

## 5. Turning on real reminder emails

Out of the box, the reminder job (`/api/cron/send-reminders`) works, but
without an email account connected it just logs "would have emailed..."
instead of actually sending anything - so nothing breaks if you skip this.

To send real emails:

1. Create a free account at [resend.com](https://resend.com).
2. Get an API key from their dashboard.
3. Set `RESEND_API_KEY` (and optionally `EMAIL_FROM`, once you've verified
   a sending domain there) in your `.env` file locally, and in Vercel's
   environment variables for the deployed site.
4. Set `CRON_SECRET` to a random string (`openssl rand -hex 16`) in both
   places - this stops strangers from triggering the email job themselves.
5. On Vercel, the included `vercel.json` already schedules this job to run
   once a day automatically. Locally, or on other hosts, you'd need your
   own scheduler to call it - Claude Code can help set that up.

Reminders are sent once, when a license enters its final 30 days before
expiring, to everyone on the license's team.

## 6. Making changes later

Come back to this same Claude Code session (or a new one pointed at this
repository) and describe what you want in plain English - e.g. "let people
upload a PDF of the license," "add multi-stage reminders," or "add a
compliance report." You don't need to write any code yourself.
