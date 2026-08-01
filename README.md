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
- **SQLite** - the database itself, for local development. It's just a file
  (`prisma/dev.db`) - nothing to install or configure.
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
3. Copy the example environment file and fill in one value:
   ```bash
   cp .env.example .env
   ```
   Open `.env` in any text editor and set `SESSION_SECRET` to a random
   string - you can generate one by running:
   ```bash
   openssl rand -base64 32
   ```
   Paste the result in as `SESSION_SECRET="..."`. This is what keeps login
   sessions secure; it can be anything random, you'll never need to
   remember it.
4. Create the local database:
   ```bash
   npx prisma migrate dev
   ```
   This creates `prisma/dev.db` and sets up the tables (`User`, `License`).
5. Start the app:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser.
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

## 3. Putting it on the internet (deployment)

Right now the app only runs on your own computer. To give it a real web
address that anyone can visit, you deploy it - most simply to
[Vercel](https://vercel.com) (made by the creators of Next.js, free to
start):

1. Push this repository to GitHub (if it isn't already).
2. Create a Vercel account and "Import" this GitHub repository.
3. **Important:** SQLite (the local file database) does not work on Vercel,
   because Vercel doesn't keep files around between requests. Before your
   first real deploy, switch to a hosted database:
   - Create a free Postgres database at [neon.com](https://neon.com) or
     [prisma.io](https://www.prisma.io/postgres) (a couple of clicks, no
     credit card).
   - In `prisma/schema.prisma`, change `provider = "sqlite"` to
     `provider = "postgresql"`.
   - In `src/lib/prisma.ts`, swap the SQLite adapter for the Postgres one
     (`@prisma/adapter-pg`, package: `npm install @prisma/adapter-pg pg`).
     This is a good task to hand back to Claude Code / this assistant when
     you're ready - just say "switch the database to Postgres."
   - Set `DATABASE_URL` in Vercel's project settings to the connection
     string the Postgres provider gives you.
   - Run `npx prisma migrate deploy` once against that database (Claude
     Code can do this for you) to create the tables.
4. In Vercel's project settings, add these environment variables (same
   names as in `.env`): `DATABASE_URL`, `SESSION_SECRET`, `RESEND_API_KEY`,
   `EMAIL_FROM`, `CRON_SECRET`.
5. Deploy. Vercel gives you a `https://your-app.vercel.app` URL.

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
