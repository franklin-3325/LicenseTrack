# LicenseTrack

A website where individuals and companies can create an account, log in, and
track renewal dates for every contractor license they're responsible for.
The dashboard highlights what's expired or expiring soon, and (once you
connect an email service) sends automatic reminder emails before a license
lapses.

This README is written for someone who has never run a web project before.
Follow it top to bottom.

## What this project is built with (for context, not action)

- **Next.js** - the web framework (handles pages, forms, and the server).
- **Prisma** - talks to the database on your behalf.
- **PostgreSQL** - the database itself. You'll need a connection string to
  one (see step 3 below - takes about a minute to get one for free).
- **Resend** - an optional email-sending service, only needed for reminder
  emails.

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
   - Set `DATABASE_URL` to the connection string from step 3.
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

## 2. How the app is organized (if you're curious)

- `src/app/page.tsx` - the public landing page.
- `src/app/signup`, `src/app/login` - account creation and sign-in.
- `src/app/dashboard` - the logged-in view listing your licenses.
- `src/app/licenses/new`, `src/app/licenses/[id]/edit` - the add/edit forms.
- `src/app/actions` - the server-side logic behind those forms (create
  account, log in, save a license, etc.).
- `prisma/schema.prisma` - the definition of what's stored: `User` and
  `License`.
- `src/app/api/cron/send-reminders` - the job that emails people about
  upcoming expirations (see section 4).
- `proxy.ts` - guards `/dashboard` and `/licenses/*` so only logged-in users
  can reach them.

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
3. Before clicking Deploy, add a database: in the project's "Storage" tab
   (or during import), add **Postgres** - Vercel provisions one for you
   (powered by Neon) and automatically sets `DATABASE_URL` for you. No
   separate signup needed.
4. In the project's Settings -> Environment Variables, add:
   - `SESSION_SECRET` - any random string (generate with
     `openssl rand -base64 32`).
   - `CRON_SECRET` - any random string (generate with
     `openssl rand -hex 16`) - only needed for the reminder-email job, see
     section 4.
   - `RESEND_API_KEY` / `EMAIL_FROM` - optional, also for section 4.
5. In Settings -> Build & Deployment, set the **Build Command** to:
   ```
   npx prisma migrate deploy && npx prisma generate && next build
   ```
   This creates the database tables automatically on every deploy.
6. Deploy. Vercel gives you a `https://your-app.vercel.app` URL - that's
   your live demo.

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

## 4. Turning on real reminder emails

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
expiring.

## 5. Making changes later

Come back to this same Claude Code session (or a new one pointed at this
repository) and describe what you want in plain English - e.g. "let people
upload a PDF of the license," "add a way to invite a teammate," or "change
the reminder window to 60 days." You don't need to write any code yourself.
